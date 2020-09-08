const mongoose = require('mongoose');
const krakeSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId, 
  name: {type: String, required: true, minlength: 3, maxlength: 10},
  age: {type: Number, required: false, min: 10, max: 99},
  salary: {type: Number, required: false, default: 40000}
});

/*krakeSchema.pre('validate', function(next) {
  return next();
});

krakeSchema.pre('remove', function(next) {
  return next();
});


krakeSchema.post('init', function(next) {
  return next();
});

krakeSchema.post('remove', function(next) {
  return next();
});*/

module.exports = mongoose.model('Krake', krakeSchema);