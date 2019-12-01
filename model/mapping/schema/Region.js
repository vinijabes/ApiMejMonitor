const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var RegionSchema = new Schema();
RegionSchema.add({
  name: String,
  cities: [{type: Number, ref: 'City'}]
});

module.exports = mongoose.model('Region', RegionSchema);