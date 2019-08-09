const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const City = require('./City');

var dadosIesSchema = new Schema();
dadosIesSchema.add({
  phone: [String],
  email: [String],
  site: String 
});

var campiSchema = new Schema();
campiSchema.add({
  _id: Number,
  name: String,
  city: {type: Number, ref: 'City'},
  courses: [{type: Schema.Types.ObjectId, ref: 'Course'}]
})

var IesSchema = new Schema();
IesSchema.add({
  _id: Number,
  name: String,
  tag: String,
  city: {type: Number, ref: 'City'},
  presential: Boolean,
  ead: Boolean,
  type: String,
  info: dadosIesSchema,
  campus: [campiSchema],
  courses: [{type: Schema.Types.ObjectId, ref: 'Course'}]
});

module.exports = mongoose.model('Ies', IesSchema);