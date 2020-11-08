const userController = {};

// Models
const modelUser = require('../models/User');

// Helpers
const { sendEmail, sendEmailHtml } = require('../helpers/mailsend.helper');

// Modules
const passport = require('passport');

userController.viewSignup = (req, res) => {
  res.render('user/signup');
};

userController.signup = async (req, res) => {
  let errors = [];
  const { name, email, password, confirm_password } = req.body;
  if (password != confirm_password) {
    errors.push({ text: 'Las contraseñas no coinciden.' });
  }
  if (password.length < 8) {
    errors.push({
      text: 'La contraseña debe tener un mínimo de 8 caracteres.',
    });
  }
  if (errors.length > 0) {
    res.render('user/signup', {
      errors,
      name,
      email,
      password,
      confirm_password,
    });
  } else {
    // Look for email coincidence
    const emailUser = await modelUser.findOne({ email: email });
    if (emailUser) {
      req.flash('error_msg', 'El email no es válido.');
      res.redirect('/user/signup');
    } else {
      // Save a new User
      const newUser = new modelUser({ name, email, password });
      newUser.password = await newUser.encryptPassword(password);
      newUser.token = Math.random() * (99999999 - 10000000) + 10000000;
      const userSaved = await newUser.save();
      sendEmailHtml(
        userSaved.email,
        'Verificación de usuario',
        '<p>Abra la siguiente dirección en su navegador para verificar  su cuenta de usuario. ¡Gracias!</p><p><strong>https://' +
          req.headers.host +
          '/user/verify/' +
          userSaved._id +
          '/' +
          userSaved.token +
          '</strong></p>'
      );
      req.flash(
        'success_msg',
        'Usuario registrado correctamente. Para verificar su usuario revise su email, incluida la carpeta de correo no deseado. Gracias.'
      );
      res.redirect('/');
    }
  }
};

userController.verify = async (req, res) => {
  let user;

  try {
    user = await modelUser.findById(req.params.user).exec();
  } catch (err) {
    throw err;
  }

  if (user.token == req.params.token) {
    user.verified = true;
    try {
      await user.save();
    } catch (err) {
      throw err;
    }
    req.flash(
      'success_msg',
      'El usuario ha sido verificado. Ya puede acceder a su cuenta 😃'
    );
    res.redirect('/');
  } else {
    req.flash(
      'error_msg',
      'El usuario no ha podido ser verificado. Por favor, inténtelo de nuevo.'
    );
    res.redirect('/');
  }
};

userController.viewLogin = (req, res) => {
  res.render('user/login');
};

userController.login = passport.authenticate('local', {
  successRedirect: '/user/home',
  failureRedirect: '/user/login',
  failureFlash: true,
});

userController.logout = (req, res) => {
  req.logout();
  req.flash('success_msg', 'Sesión cerrada correctamente.');
  res.redirect('/');
};

userController.viewLostPassword = (req, res) => {
  res.render('user/lostPassword');
};

userController.doLostPassword = async (req, res) => {
  try {
    const user = await modelUser.findOne({ email: req.body.email }).exec();
    if (user != null) {
      let newPassword = Math.random() * (99999999 - 10000000) + 10000000;
      user.password = await user.encryptPassword(newPassword.toString());
      await user.save();
      sendEmail(
        user.email,
        'Nueva contraseña',
        'Su nueva contraseña es: ' + newPassword.toString()
      );
    } else {
      res.render('index');
    }
  } catch (err) {
    throw err;
  }

  let success_msg = ['Revisa tu email'];
  res.render('index', { success_msg });
};

userController.viewUserHome = (req, res) => {
  res.render('user/home');
};

module.exports = userController;
