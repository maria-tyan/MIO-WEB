var fs = require('fs');
var path = require('path');
var NodeRSA = require('node-rsa');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var keyPath = path.resolve(__dirname + '/../userkey');

function encrypt(input, keyPath, cb) {
  fs.readFile(keyPath, function(err, keyData) {
    if (err) return cb(err);
    
    var key = new NodeRSA(keyData);
    var result = key.encrypt(input, 'base64');
    cb(null, result);
  });
}

function decrypt(input, keyPath, cb) {
  fs.readFile(keyPath, function(err, keyData) {
    if (err) return cb(err);
    
    var key = new NodeRSA(keyData);
    var result = key.decrypt(input, 'utf8');
    cb(null, result);
  });
}

function encryptObject(object, keyPath, cb) {
  encrypt(JSON.stringify(object), keyPath, cb);
}

function decryptObject(input, keyPath, cb) {
  decrypt(input, keyPath, function(err, res) {
    if (err) return cb(err);
    
    cb(null, JSON.parse(res));
  });
}

var UserSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  modelData: {
  	type: String,
  	required: false,
  }
});


UserSchema.methods.setModel = function(model) {
  var self = this;

  return new Promise((resolve, reject) => {
    if (!model) return reject();
    
    encryptObject(model, keyPath, function(err, res) {
      if (err) return next(err);
      self.modelData = res;
      resolve();
    });
  });
};

UserSchema.methods.getModel = function() {
  var self = this;

  return new Promise((resolve, reject) => {
    if (!self.modelData) return resolve({});
    
    decryptObject(self.modelData, keyPath, function(err, res) {
      return err ? reject(err) : resolve(res);
    });
  });
};

// Hide private fields
UserSchema.set('toJSON', {
  virtuals: false,
  transform(doc, result, options) {
    delete result.__v;
    delete result.password;
    delete result.modelData;
    return result;
  }
});

module.exports = mongoose.model('User', UserSchema, 'users');
