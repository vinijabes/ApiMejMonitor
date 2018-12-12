const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UserSchema = new Schema({
  username:  String,
  password:  String,
  firstname: String,
  lastname: String,
  scope: String
});

module.exports = mongoose.model('User', UserSchema);