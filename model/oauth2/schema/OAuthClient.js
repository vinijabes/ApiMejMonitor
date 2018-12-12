const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var OAuthClientSchema = new Schema({
  name:  String,
  clientId:  String,
  clientSecret: String,
  redirectUris: Array,
  grantTypes: Array,
  scope: String,
  User:  { type : Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('OAuthClient', OAuthClientSchema);