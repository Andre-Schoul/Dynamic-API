const mongoose = require('mongoose');
const klopsSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId, 
  name: {type: String, required: true, minlength: 3, maxlength: 10},
  age: {type: Number, required: false, min: 10, max: 99},
  salary: {type: Number, required: false, default: 40000}
});



module.exports = mongoose.model('Klops', klopsSchema);