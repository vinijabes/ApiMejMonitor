let mongoose = require('mongoose');

const db_user = process.env.DB_USER;
const db_password = process.env.DB_PASS;
const db_hostname = process.env.DB_HOSTNAME;
const db_collection = process.env.DB_COLLECTION;

console.log(`mongodb://${db_user}:${db_password}@${db_hostname}/${db_collection}`);

mongoose.connect(
    `mongodb://${db_user}:${db_password}@${db_hostname}/${db_collection}`,
    {useNewUrlParser: true}
);

module.exports = mongoose;
