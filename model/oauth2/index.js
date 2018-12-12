let schemas = require('./schema');
const User = schemas.User;
const OAuthClient = schemas.OAuthClient;
const OAuthAccessToken = schemas.OAuthAccessToken;
const OAuthAuthorizationCode = schemas.OAuthAuthorizationCode;
const OAuthRefreshToken = schemas.OAuthRefreshToken;

module.exports.getAccessToken = async (bearerToken) => { 
    let token = await OAuthAccessToken
                    .findOne({accessToken: bearerToken})
                    .populate('User')
                    .populate('OAuthClient').lean();


    token.User.id = token.User._id;

    delete token.User._id;
    delete token.User.password;
    delete token.User.username;

    return {
        user: token.User,
        client: {id: String(token.OAuthClient._id)},
        accessTokenExpiresAt: token.expires,
        scope: token.scope
    };
}

module.exports.getRefreshToken = async(refreshToken) => {
    let token = await OAuthRefreshToken
                        .findOne({refreshToken: refreshToken})
                        .populate('User')
                        .populate('OAuthClient')
                        .lean();

    token.User.id = token.User._id;

    delete token.User._id;
    delete token.User.password;
    delete token.User.username;    

    let result = {
        user: token.User,
        client: {id: String(token.OAuthClient._id)},
        accessToken: token.accessToken,
        refreshToken: refreshToken,
        refreshTokenExpiresAt: token.expires,        
    };

    if(token.scope) result.scope = token.scope

    //console.log(result);

    return result;
}

module.exports.getClient =  async (clientId, clientSecret) => {
    const options = {clientId: clientId};
    if(clientSecret) options.clientSecret = clientSecret;

    let client = await OAuthClient
                        .findOne(options)
                        .lean();

    return {
        id: String(client._id),
        grants: client.grantTypes,
        redirectUris: client.redirectUris
    }
}

module.exports.getUser = async (username, password) => {
    
    let user = await User   
                        .findOne({username: username})
                        .lean();

    if(user && user.password === password) return {
        id: user._id,
        scope: user.scope
    }
    else return false;
}

module.exports.revokeAuthorizationCode = async (code) => {
    return !!(await OAuthAuthorizationCode.findOneAndDelete({authorizationCode: code.code}).exec());
}

module.exports.revokeToken = async (token) => {
    return !!(await OAuthAccessToken.findOneAndDelete({accessToken: token.accessToken}).exec())
        || !!(await OAuthRefreshToken.findByIdAndDelete({accessToken: token.accessToken}).exec());
}

module.exports.saveToken = async (token, client, user) => {
    let oToken = new OAuthAccessToken({
        accessToken: token.accessToken,
        expires: token.accessTokenExpiresAt,
        OAuthClient: client.id,
        User: user.id,
        scope: token.scope
    });

    let oRefreshToken = new OAuthRefreshToken({
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        expires: token.refreshTokenExpiresAt,
        OAuthClient: client.id,
        User: user.id,
        scope: token.scope
    });

    await [oToken.save(),oRefreshToken.save()];
    
    return {
        client: {id: client.id},
        user: {id: user.id},
        accessToken: token.accessToken,
        accessTokenExpiresAt: token.accessTokenExpiresAt,
        refreshToken: token.refreshToken
    }
}

module.exports.verifyScope = (accessToken,scope) => {
    return accessToken.scope == scope;
}