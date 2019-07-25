const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const getPort = require('get-port');

let authenticate = require('../controller/oauth2').authenticate;
let app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors())
app.use('/public', express.static('public'));

(async () => {
    let port = process.env.PORT || await getPort({port: 5015});
    app.listen(port, function(err){
        if(err) console.log(err);
        console.log(`Listening on ${port}!`);
    });
})();

module.exports = app;