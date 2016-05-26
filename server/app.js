var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var morgan = require('morgan')('dev');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Debug output
var debug = require('debug')('app');

// Express
var app = express();

var config = {
  mongoConnectionString: 'mongodb://localhost/diplom',
  port: 2599,
}

// Connect to MongoDB
mongoose.connect(config.mongoConnectionString);
mongoose.connection.on('error', () => {
  debug('Connection error');
});
mongoose.connection.once('open', (callback) => {
  debug('Mongoose connected');
});

// Attach express middleware
app.use(cookieParser());
app.use(bodyParser.json());
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(morgan);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('../client'));

// Allow cross-domain requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, X-Auth-Token');
  if (req.method === 'OPTIONS') {
    return res.end();
  }
  next();
});

//auth
function isLoggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.send('Not authorized!', 403);
  }
}

// Routes
app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/user', isLoggedIn, require('./routes/user.js'));
app.use('/api/ticket', isLoggedIn, require('./routes/ticket.js'));

app.listen(config.port, () => {
  debug('Binded to port');
});

module.exports = app;
