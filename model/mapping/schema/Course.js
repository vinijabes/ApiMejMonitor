const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var CourseSchema = new Schema();
CourseSchema.add({
  name: String,
});

module.exports = mongoose.model('Course', CourseSchema);