var express = require('express');
var router = express.Router();
var Ticket = require('../models/ticket.js');

router.get('/', (req, res) => {
  Ticket.find({}, (err, tickets) => {
    res.send(tickets);
  });
});

router.post('/', (req, res) => {
  var ticket = new Ticket({
  	header: req.body.header,
  	description: req.body.description,
    email: req.user.email,
  });
  
  ticket.save((err, ticket) => {
    res.send(ticket);
  });
})

router.post('/answer', (req, res) => {
  Ticket.findById(req.body._id, function(err, ticket) {
    if (err)
      res.send(err);
    ticket.answer = req.body.answer;
    ticket.save(function(err) {
      if (err)
        res.send(err);
    });
  })
})

router.get('/:id', function(req, res) {
  Ticket
    .findOne({_id: req.params.id})
    .exec((err, ticket) => {
      res.send(ticket);
    })
});

module.exports = router;
