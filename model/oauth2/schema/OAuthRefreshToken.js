const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var RefreshTokenSchema = new Schema({
  accessToken: String,
  refreshToken: String,
  expires: Date,
  scope:  String,
  User:  { type : Schema.Types.ObjectId, ref: 'User' },
  OAuthClient: { type : Schema.Types.ObjectId, ref: 'OAuthClient' },
});

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);