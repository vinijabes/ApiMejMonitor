const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var CitySchema = new Schema();
CitySchema.add({
  name: String,
  _id: Number,
});

module.exports.CitySchema = CitySchema;
module.exports.model = mongoose.model('City', CitySchema);