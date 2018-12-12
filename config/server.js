const express = require('express');
const bodyParser = require('body-parser');

let app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

let port = process.env.PORT || 5000;
app.listen(port, function(err){
    if(err) console.log(err);
    console.log(`Listening on ${port}!`);
});

module.exports = app;