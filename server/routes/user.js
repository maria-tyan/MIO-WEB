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
    });
});

router.get('/:id/model', function(req, res) {
  User
    .findOne({_id: req.params.id})
    .then((user) => { 
      return user.getModel();
    })
    .then((model) => {
      res.status(200).send(model);
    });
});

router.put('/:id/model', function(req, res) {
  User
    .findOne({_id: req.params.id})
    .then((user) => { 
      return user.setModel(req.body)
        .then(() => user.save());
    })
    .then(() => {
      res.status(200).send('Model updated!');
    });
});

module.exports = router;
