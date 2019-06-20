const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var AccompanimentSchema = new Schema({
  date: Date,
  participants: Number,
  description: String
});

var VisitSchema = new Schema({
  date:  Date,
  responsible:  String,
  reason: String,
  type: Number,
  goals: [{description: String, meta: Number, atual: Number}],
  accompaniments: [AccompanimentSchema],
  ej: {type: mongoose.Schema.Types.ObjectId, ref: 'Ej'}
});

module.exports = mongoose.model('Visit', VisitSchema);