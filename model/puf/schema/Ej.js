const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var EjSchema = new Schema({
  name:  String,
  ies:  String,
  courses: String,
  members: Number,
  revenue: Number,
  projects: Number,
  imgPath: String,
  goals: [{description: String, meta: Number, atual: Number}],
  type: Number
});

module.exports = mongoose.model('Ej', EjSchema);