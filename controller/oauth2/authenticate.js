let oauth = require('./oauth');
let OAuth2Server = require('oauth2-server');
let Request = OAuth2Server.Request;
let Response = OAuth2Server.Response;

module.exports = (options) => {
    var options = options || {};
    return function(req, res, next){
        let request = new Request({
            headers:{authorization: req.headers.authorization},
            method: req.method,
            query: req.query,
            body: req.body
        });
        let response = new Response(res);

        oauth.authenticate(request, response, options)
            .then(function(token){
                req.token = token;
                next();
            })
            .catch(function(err){
                res.status(err.code || 500).json(err);
            })
    }
}