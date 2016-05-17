var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var debug = require('debug')('auth');

//auth
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  (email, password, done) => {
    debug(email, password);
    User.findOne({ email: email }, (err, user) => {
      console.log(user, email, password)
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (user.password != password) { return done(null, false); }
      return done(null, user);
    });
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});


passport.deserializeUser((id, done) => {
  User.findById(id, (err,user) => {
    err 
      ? done(err)
      : done(null,user);
  });
});

// Routes
router.get('/checkAccess', (req, res) => {
  if (req.user) {
    res.send(req.user);
  } else {
    res.send('Not authorized!', 403);
  }
})

router.get('/logout', (req, res) => {
  req.logout();

  req.session.destroy(function (err) {
    if (err) { return next(err); }
    return res.send({ authenticated: req.isAuthenticated() });
  });
})

router.post('/register', (req, res) => {
  var user = new User({
    email: req.body.email,
    password: req.body.password,
  });
  
  user.save((err, user) => {
    debug(err, user);
    res.send(user);
  });
})

router.post('/login',
  passport.authenticate('local', { failureRedirect: '/failure' }),
  (req, res) => {
    debug('Successful login!')
    res.send(req.user);
  }
);

module.exports = router;
