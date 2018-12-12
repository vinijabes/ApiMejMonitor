let OAuth2Server = require('oauth2-server');
let Request = OAuth2Server.Request;
let Response = OAuth2Server.Response;

let oauth = require('./oauth');

module.exports = (app) => {
    app.all('/oauth/token', function(req, res, next){
        let request = new Request(req);
        let response = new Response(res);
    
        oauth.token(request, response)
             .then(function(token) {
                 return res.json(token);
             }).catch(function(err){
                 return res.status(500).json(err);
             })
    });

    app.all('/authorize', function(req, res){
        let request = new Request(req);
        let response = new Response(res);
    
        const options = {
            authenticateHandler: {
                handle: (data) => {
                    return {id: 2};
                }
            }
        }
    
        try{
            oauth.authorize(request, response, options).then(function(success) {
                return res.json(success)
            }).catch(function(err){
                console.log(typeof 'err');
                return res.status(err.code || 500).json(err)
            })
        }catch(err){
            res.json(err);
        }
    });

    return app;
}