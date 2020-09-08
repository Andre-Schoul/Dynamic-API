const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const projectSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {type: String,  required: true, unique: true},
  contributors: [{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}]
});

projectSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Project', projectSchema);
