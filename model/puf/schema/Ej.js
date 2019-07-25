const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ProjectSchema = new Schema({
  date: {type: Date, required: true, default: Date.now()},
  revenue: {type: Number, required: true},
  connected: Boolean
});

var EjSchema = new Schema({
  name:  String,
  ies:  String,
  courses: String,
  members: Number,
  revenue: Number,
  projects: Number,
  imgPath: String,
  goals: [{description: String, meta: Number, atual: Number}],
  madeProjects: [ProjectSchema],
  type: Number
});

module.exports = mongoose.model('Ej', EjSchema);