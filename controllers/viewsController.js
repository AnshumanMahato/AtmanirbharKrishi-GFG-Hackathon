const User = require('../models/userModel');
// const userController = require('./userController');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'order')
    res.locals.alert =
      "Your order was successful! Please check your email for a confirmation. If your order doesn't show up here immediatly, please come back later.";
  next();
};

exports.getSingupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'create your account!'
  });
};

exports.getLoginForm = (req, res) => {
  res
    .status(200)
    // .set(
    //   'Content-Security-Policy',
    //   "connect-src 'self' http://127.0.0.1:3000/ https://cdnjs.cloudflare.com"
    // )
    .render('login', {
      title: 'Log into your account'
    });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser
  });
});

exports.edit = catchAsync(async (req, res, next) => {
  const userdata = await User.findOne({ _id: req.params.id }).select('+active');

  if (!userdata)
    next(
      new AppError(
        'User not found. It might have been deleted. Please refresh to get the current list of users.',
        404
      )
    );

  res.status(200).render('editUser', {
    title: 'Edit User',
    userdata
  });
});
