const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var OAuthAuthorizationCodeSchema = new Schema({
  authorizationCode: String,
  expires: Date,
  redirectUri:  String,
  scope:  String,
  User:  { type : Schema.Types.ObjectId, ref: 'User' },
  OAuthClient: { type : Schema.Types.ObjectId, ref: 'OAuthClient' },
});

module.exports = mongoose.model('OAuthAuthorizationCode', OAuthAuthorizationCodeSchema);