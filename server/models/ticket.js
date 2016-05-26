var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TicketSchema = new Schema({
  header: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  email: {
  	type: String,
  	required: true,
  },
  answer: {
    type: String,
    required: false,
  }
});

module.exports = mongoose.model('Ticket', TicketSchema, 'tickets');
