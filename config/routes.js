let express = require('express');
let router = express.Router();
let authenticate = require('../controller/oauth2').authenticate;
module.exports = (app) => {
    var normalizedPath = require("path").join(__dirname, "../routes/v1");
    require("fs").readdirSync(normalizedPath).forEach(function(file) {
        require(`../routes/v1/${file}`)(router, authenticate);
    });

    app.use('/api/v1', router);
}