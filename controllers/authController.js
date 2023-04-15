const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');
const Email = require('../utils/email');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  };

  res.cookie('jwt', token, cookieOptions);

  // Remove password and active from output
  user.password = undefined;
  user.active = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    return next(new AppError('You are already logged in.', 400));
  }
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  const url = `${req.protocol}://${req.get('host')}/me`;
  // console.log(url);
  await new Email(newUser, url).sendWelcome();

  createSendToken(newUser, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  // Get Credentials
  const { email, password } = req.body;

  // Verify input
  if (!email || !password)
    return next(new AppError('Please send your email and password.', 400));

  // Verify Credentials
  let user = await User.findOne({ email }).select('+password +active');
  if (!user.active) user = undefined;

  if (!user || !(await user.checkPassword(password, user.password)))
    return next(new AppError('Incorrect user or password.', 401));

  // Sign Token

  createSendToken(user, 200, req, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async function(req, res, next) {
  // 1 Get Token from header
  let token;
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError('Please Login to Continue', 401));
  }

  // 2 Verify Token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3 Verify if user exits
  let user = await User.findById(decoded.id).select('+active');
  if (!user.active) user = undefined;

  if (!user)
    return next(
      new AppError(
        'The user belonging to the token does not exist. Please login with an existing id',
        401
      )
    );

  // 4 Verify if user has changed passwords
  if (user.isPasswordChanged(decoded.iat))
    return next(
      new AppError('Password has been changed recently. Please Login Again')
    );

  // User Verified Successfully
  req.user = user;
  res.locals.user = user;
  next();
});

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      let currentUser = await User.findById(decoded.id).select('+active');
      if (!currentUser.active) currentUser = undefined;

      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.isPasswordChanged(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      req.user = currentUser;
      res.locals.user = currentUser;
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError('You do not have the permission for this action.', 403)
      );
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //find user id
  let user = await User.findOne({ email: req.body.email }).select('+active');
  if (!user.active) user = undefined;

  if (!user)
    return next(new AppError('No user found for the given email', 404));

  //generate reset token and store it in db
  const resetToken = user.generateResetToken();
  await user.save({ validateBeforeSave: false });

  //send token to user email
  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Reset url sent to email'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpiry = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('Failed to send reset email', 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //Get user from token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  let user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpiry: { $gt: Date.now() }
  }).select('+active');
  if (!user.active) user = undefined;

  //Check if token has expired or user doen not exist
  if (!user)
    return next(new AppError('User not found or token has expired', 400));

  //Change the password

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpiry = undefined;

  await user.save();

  //Login user
  createSendToken(user, 200, req, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //Get user from collection
  const user = await User.findById(req.user._id).select('+password');

  //Check if password is correct
  if (!(await user.checkPassword(req.body.passwordCurrent, user.password)))
    return next(new AppError('Incorrect current password', 401));

  //update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  //Log the user in
  createSendToken(user, 200, req, res);
});
