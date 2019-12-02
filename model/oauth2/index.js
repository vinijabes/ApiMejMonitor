const con = require('../../config/database');
let schemas = require('./schema');
const User = schemas.User;
const OAuthClient = schemas.OAuthClient;
const OAuthAccessToken = schemas.OAuthAccessToken;
const OAuthAuthorizationCode = schemas.OAuthAuthorizationCode;
const OAuthRefreshToken = schemas.OAuthRefreshToken;

module.exports.getAccessToken = async (bearerToken) => {
    let token = (await con.promise().execute(`SELECT *, OAuthToken.scope as scope FROM OAuthToken INNER JOIN User ON OAuthToken.username = User.username WHERE access_token = '${bearerToken}'`))[0][0];

    console.log("getAccessToken");

    return {
        user: { firstname: token.firstname, lastname: token.lastname },
        client: { id: token.client_id },
        accessTokenExpiresAt: token.expires,
        scope: token.scope
    };
}

module.exports.getRefreshToken = async (refreshToken) => {
    let token = (await con.promise().execute(`SELECT *, OAuthToken.scope as scope FROM OAuthToken INNER JOIN User ON OAuthToken.username = User.username WHERE access_token = '${bearerToken}'`))[0][0];

    console.log("getRefreshToken");

    let result = {
        user: { firstname: token.firstname, lastname: token.lastname },
        client: { id: token.client_id },
        accessToken: token.accessToken,
        refreshToken: refreshToken,
        refreshTokenExpiresAt: token.expires,
    };

    if (token.scope) result.scope = token.scope

    //console.log(result);

    return result;
}

module.exports.getClient = async (clientId, clientSecret) => {
    console.log("getClient");

    const options = { clientId: clientId };
    if (clientSecret) options.clientSecret = clientSecret;

    let client = (await con.promise().execute(`SELECT * FROM OAuthClient WHERE client_id = '${clientId}' AND client_secret = '${clientSecret}'`))[0][0];
    let grantTypes = (await con.promise().execute(`SELECT grantName FROM OAuthGrantOauthClient WHERE OAuthGrantOauthClient.client_id = '${clientId}'`))[0];
    let redirectUris = (await con.promise().execute(`SELECT redirect_uri FROM RedirectUriOauthClient WHERE RedirectUriOauthClient.client_id = '${clientId}'`))[0];

    return {
        id: client.client_id,
        grants: grantTypes.map((elem) => { return elem.grantName }),
        redirectUris: redirectUris.map((elem) => { return elem.redirect_uri })
    }
}

module.exports.getUser = async (username, password) => {
    console.log("getUser");
    let user = (await con.promise().execute(`SELECT * FROM User WHERE username = '${username}'`))[0][0];

    if (user && user.password === password) return {
        id: user.username,
        scope: user.scope
    }
    else return false;
}

module.exports.revokeAuthorizationCode = async (code) => {
    return !!(await OAuthAuthorizationCode.findOneAndDelete({ authorizationCode: code.code }).exec());
}

module.exports.revokeToken = async (token) => {
    return !!(await OAuthAccessToken.findOneAndDelete({ accessToken: token.accessToken }).exec())
        || !!(await OAuthRefreshToken.findByIdAndDelete({ accessToken: token.accessToken }).exec());
}

module.exports.saveToken = async (token, client, user) => {
    let expireDate = token.accessTokenExpiresAt.toISOString().slice(0, 19).replace('T', ' ');;    
    let result = await (con.promise().execute(`INSERT INTO OAuthToken(access_token, username, client_id, refresh_token, scope, expires) VALUES ('${token.accessToken}', '${user.id}', '${client.id}', '${token.refreshToken}', '${token.scope}', '${expireDate}')`));

    return {
        client: { id: client.id },
        user: { id: user.id },
        accessToken: token.accessToken,
        accessTokenExpiresAt: token.accessTokenExpiresAt,
        refreshToken: token.refreshToken
    }
}

module.exports.verifyScope = (accessToken, scope) => {
    return accessToken.scope == scope;
}