const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {type: String,  required: true, unique: true, match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/},
  password: {type: String,  required: true},
  tariff: {type: String,  enum: ['free', 'team', 'enterprise'], required: false, default: 'free'},
  image: {type: String,  required: false},
  firstName: {type: String,  required: false},
  surname: {type: String,  required: false},
  street: {type: String,  required: false},
  streetNumber: {type: Number,  required: false},
  postcode: {type: Number,  required: false},
  city: {type: String,  required: false},
  country: {type: String,  required: false}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
