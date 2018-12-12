let OAuth2Server = require('oauth2-server');
let model = require('../../model/oauth2');

let oauth = new OAuth2Server({
    debug: true,
    model: model
})

module.exports = oauth;