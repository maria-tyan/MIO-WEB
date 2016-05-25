var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  modeldata: {
  	type: String,
  	required: false,
  }
});

module.exports = mongoose.model('User', UserSchema, 'users');
