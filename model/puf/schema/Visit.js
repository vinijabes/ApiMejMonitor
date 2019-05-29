const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var VisitSchema = new Schema({
  date:  Date,
  responsible:  String,
  reason: String,
  type: Number,
  goals: [{description: String, meta: Number, atual: Number}],
  ej: {type: mongoose.Schema.Types.ObjectId, ref: 'Ej'}
});

module.exports = mongoose.model('Visit', VisitSchema);