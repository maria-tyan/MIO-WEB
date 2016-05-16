var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var morgan = require('morgan')('dev');
var LocalStrategy = require('passport-json').Strategy;

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
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  (email, password, done) => {
    console.log(email, password)
    var User = require('./models/user.js');
    User.findOne({ email: email }, (err, user) => {
      console.log(user, email, password)
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (user.password != password) { return done(null, false); }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// Routes
app.post('/login',
  passport.authenticate('json', { failureRedirect: '/failure' }),
  (req, rse) => {
    debug('Successful login!')
    res.redirect('/');
  });
app.use('/api/user', require('./routes/user.js'));

app.listen(config.port, () => {
  debug('Binded to port');
});

module.exports = app;
