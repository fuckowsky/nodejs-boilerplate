// .env
require('dotenv').config();

// APM Integration
if (process.env.APM_ACTIVATE == 'true') {
  const apm = require('elastic-apm-node').start({
    serviceName: process.env.APM_SERVICENAME,
    serverUrl: process.env.APM_SERVERURL,
  });
  console.log('✅ APM integration activated');
}

// Dependencies
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');
const methodOverride = require('method-override');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const expressLayouts = require('express-ejs-layouts');

// Dev Dependencies
const morgan = require('morgan');

// Initializations
const app = express();
require('./database');
require('./config/passport');

// Settings
app.set('port', process.env.PORT || 3000);

// Template views config
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/layout');
app.use(expressLayouts);

// Middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(methodOverride('_method'));
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Routes
app.use(require('./routes/index.routes'));
app.use(require('./routes/user.routes'));

// Manage 404
app.use(function (req, res, next) {
  res.status(404);
  if (req.accepts('html')) {
    res.render('404', { url: req.url });
    return;
  }
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }
  res.type('txt').send('Not found');
});

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Start Server
app.listen(app.get('port'), () => {
  console.log('✅ Server available on port', app.get('port'));
});
