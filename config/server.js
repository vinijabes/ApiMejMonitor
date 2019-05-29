const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')

let authenticate = require('../controller/oauth2').authenticate;
let app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors())
app.use('/public', express.static('public'));

let port = process.env.PORT || 5015;
app.listen(port, function(err){
    if(err) console.log(err);
    console.log(`Listening on ${port}!`);
});

module.exports = app;