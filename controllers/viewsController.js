const User = require('../models/userModel');
const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'order')
    res.locals.alert =
      "Your order was successful! Please check your email for a confirmation. If your order doesn't show up here immediatly, please come back later.";
  next();
};

exports.index = async (req, res) => {
  const url = `${req.protocol}://${req.get('host')}/`;
  const products = await Product.find();
  res.render('index', {
    url,
    rabi: products.filter(product => product.type === 'rabi'),
    kharif: products.filter(product => product.type === 'kharif'),
    cereal: products.filter(product => product.type === 'cereal')
  });
};

exports.getSingupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'create your account!'
  });
};

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
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
