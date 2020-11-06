// Helper
const helpers = {};

const { sendEmailHtml } = require('./mailsend.helper');

helpers.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error_msg', 'No autorizado');
  res.redirect('/');
};

helpers.isVerified = (req, res, next) => {
  if (req.user.verified) {
    return next();
  }

  sendEmailHtml(
    req.user.email,
    'Verificación de usuario 👌',
    '<p>Abra la siguiente dirección en su navegador para verificar  su cuenta de usuario. ¡Gracias!</p><p><strong>https://' +
      req.headers.host +
      '/user/verify/' +
      req.user._id +
      '/' +
      req.user.token +
      '</strong></p>'
  );
  req.flash(
    'error_msg',
    'Es necesario verificar esta cuenta de usuario. Por favor, revise su email incluida la carpeta de correo no deseado. Gracias.'
  );
  res.redirect('/');
};

module.exports = helpers;
