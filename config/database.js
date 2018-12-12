let mongoose = require('mongoose');
mongoose.connect(
    'mongodb://api_user:dvora1@ds249583.mlab.com:49583/dvora',
    {useNewUrlParser: true}
);

module.exports = mongoose;
