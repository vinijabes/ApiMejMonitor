let mongoose = require('mongoose');
// mongoose.connect(
//     'mongodb://api_user:dvora1@ds249583.mlab.com:49583/dvora',
//     {useNewUrlParser: true}
// );

mongoose.connect(
    'mongodb://api_user:teste_123@localhost/expande',
    {useNewUrlParser: true}
);

module.exports = mongoose;
