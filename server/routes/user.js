var express = require('express');
var router = express.Router();
var User = require('../models/user.js');

router.get('/', (req, res) => {
  User.find({}, (err, users) => {
    res.send(users);
  });
});

router.get('/:id', function(req, res) {
  User
    .findOne({_id: req.params.id})
    .exec((err, user) => {
      res.send(user);
    })
});

module.exports = router;
