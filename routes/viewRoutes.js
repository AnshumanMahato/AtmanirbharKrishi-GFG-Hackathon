const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const products = require('../productData');

const router = express.Router();

router.use(viewsController.alerts);

router.get('/', authController.isLoggedIn, viewsController.index);
router.get('/signup', authController.isLoggedIn, viewsController.getSingupForm);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);

router.get('/me', authController.protect, viewsController.getAccount);

router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;
