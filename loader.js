let app = require('./config/server');
let db = require('./config/database');
let routes = require('./config/routes')(app);

module.exports = app;