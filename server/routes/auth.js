var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var passport = require('passport');

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
router.post('/login',
  passport.authenticate('json', { failureRedirect: '/failure' }),
  (req, rse) => {
    debug('Successful login!')
    res.redirect('/');
  });
router.use('/api/user', require('./routes/user.js'));

router.listen(config.port, () => {
  debug('Binded to port');
});

module.exports = router;
