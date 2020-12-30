const router = require('express').Router();

// Controllers
const {
  viewSignup,
  signup,
  verify,
  viewLogin,
  login,
  logout,
  viewLostPassword,
  doLostPassword,
  viewUserHome,
} = require('../controllers/user.controller');

// Helpers
const { isAuthenticated, isVerified } = require('../helpers/auth.helper');

// Routes
router.get('/user/signup', viewSignup);
router.post('/user/signup', signup);

router.get('/user/verify/:user/:token', verify);

router.get('/user/login', viewLogin);
router.post('/user/login', login);

router.get('/user/logout', logout);

router.get('/user/lostpassword', viewLostPassword);

router.post('/user/lostpassword', doLostPassword);

router.get('/user/home', isAuthenticated, isVerified, viewUserHome);

module.exports = router;
