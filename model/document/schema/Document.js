const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var SectionSchema = new Schema();
SectionSchema.add({
  title: String,
  description: mongoose.Schema.Types.Mixed,
  subSections: [SectionSchema]
});

var DocumentSchema = new Schema({
  name:  String,
  sections: [SectionSchema],
  aliases: [{key: String, value: String}]
});

module.exports = mongoose.model('Document', DocumentSchema);