/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Schema definitions.
 */

mongoose.model('OAuthTokens', new Schema({
  accessToken: { type: String },
  accessTokenExpiresAt: { type: Date },
  client : { type: Object },  // `client` and `user` are required in multiple places, for example `getAccessToken()`
  clientId: { type: String },
  refreshToken: { type: String },
  refreshTokenExpiresAt: { type: Date },
  user : { type: Object },
  userId: { type: String },
  scope: {type: String}
}));

mongoose.model('OAuthClients', new Schema({
  clientId: { type: String },
  clientSecret: { type: String },
  redirectUris: { type: Array },
  grants: {type: Array}
}));

mongoose.model('OAuthAuthorizationCodes', new Schema({
  authorizationCode: { type: String, default: '' },
  expires: { type: Date },
  redirectUri: { type: String },
  scope: { type: String },
  clientId: { type: String },
  userId:  { type:String },  
}));

mongoose.model('OAuthUsers', new Schema({
  email: { type: String, default: '' },
  firstname: { type: String },
  lastname: { type: String },
  password: { type: String },
  username: { type: String }
}));

var OAuthTokensModel = mongoose.model('OAuthTokens');
var OAuthClientsModel = mongoose.model('OAuthClients');
var OAuthUsersModel = mongoose.model('OAuthUsers');
var OAuthAuthorizationCode = mongoose.model('OAuthAuthorizationCodes');

/**
 * Get access token.
 */

module.exports.getAccessToken = function(bearerToken) {
  // Adding `.lean()`, as we get a mongoose wrapper object back from `findOne(...)`, and oauth2-server complains.
  return OAuthTokensModel.findOne({ accessToken: bearerToken }).lean();
};

/**
 * Get client.
 */

module.exports.getClient = async function(clientId, clientSecret) {
  let client;
  if(clientSecret) client = await OAuthClientsModel.findOne({ clientId: clientId, clientSecret: clientSecret }).lean();
  else client = await OAuthClientsModel.findOne({ clientId: clientId }).lean();

  return {
    id: client.clientId,
    grants: client.grants,
    redirectUris: client.redirectUris
  }
};

/**
 * Get refresh token.
 */

module.exports.getRefreshToken = function(refreshToken) {
  return OAuthTokensModel.findOne({ refreshToken: refreshToken }).lean();
};

/**
 * Get user.
 */

module.exports.getUser = async function(username, password) {
  let {_id, ...userdata} = await OAuthUsersModel.findOne({ username: username, password: password }).lean();
   
  return {id: _id, ...userdata};
};

/**
 * Save token.
 */

module.exports.saveToken = function(token, client, user) {
  var accessToken = new OAuthTokensModel({
    accessToken: token.accessToken,
    accessTokenExpiresAt: token.accessTokenExpiresAt,
    client : client,
    clientId: client.id,
    refreshToken: token.refreshToken,
    refreshTokenExpiresAt: token.refreshTokenExpiresAt,
    user : user,
    userId: user.id,
    scope: token.scope
  });
  // Can't just chain `lean()` to `save()` as we did with `findOne()` elsewhere. Instead we use `Promise` to resolve the data.
  return new Promise( function(resolve,reject){
    accessToken.save(function(err,data){
      if( err ) reject( err );
      else resolve( data );
    }) ;
  }).then(function(saveResult){
    // `saveResult` is mongoose wrapper object, not doc itself. Calling `toJSON()` returns the doc.
    saveResult = saveResult && typeof saveResult == 'object' ? saveResult.toJSON() : saveResult;
    
    // Unsure what else points to `saveResult` in oauth2-server, making copy to be safe
    var data = new Object();
    for( var prop in saveResult ) data[prop] = saveResult[prop];
    
    // /oauth-server/lib/models/token-model.js complains if missing `client` and `user`. Creating missing properties.
    data.client = data.clientId;
    data.user = data.userId;

    return data;
  });
};

module.exports.revokeToken = (token) => {
  return !!OAuthTokensModel.findOneAndDelete({accessToken: token.accessToken}).exec();
}

module.exports.getAuthorizationCode = async (authorizationCode) => {
  let code = await OAuthAuthorizationCode.findOne({authorizationCode: authorizationCode}).lean();  
  return {
      authorizationCode: code.authorizationCode,
      expiresAt: code.expires,
      redirectUri: code.redirectUri,
      scope: code.scope,
      client: {id: code.clientId},
      user: {id: code.userId}
  } 
}

module.exports.revokeAuthorizationCode = (code) => {
  return !!OAuthAuthorizationCode.findOneAndDelete({authorizationCode: code.authorizationCode}).exec();
}

module.exports.saveAuthorizationCode = async (code, client, user) => {
    let authCode = new OAuthAuthorizationCode({
        authorizationCode: code.authorizationCode,
        expires: code.expiresAt,
        redirectUri: code.redirectUri,
        scope: code.scope,
        clientId: client.id,
        userId: user.id
    });

    return authCode.save().then((code) => {
        return {
            authorizationCode: code.authorizationCode,
            expiresAt: code.expires,
            redirectUri: code.redirectUri,
            scope: code.scope,
            client: {id: code.clientId},
            user: {id: code.userId}
        }
    }).catch(err => {
      console.log(err);
    });
}