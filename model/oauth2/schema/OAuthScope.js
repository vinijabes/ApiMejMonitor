const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var OAuthScopeSchema = new Schema({
  scope:  String,
  is_default: Boolean
});

module.exports = mongoose.model('OAuthScope', OAuthScopeSchema);