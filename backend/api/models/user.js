const mongoose        = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const userSchema      = mongoose.Schema({
  _id:               mongoose.Schema.Types.ObjectId,
  email:            {type: String,  required: true, unique: true, match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/},
  password:         {type: String,  required: true},
  role:             {type: String,  enum: ['admin', 'developer', 'employee', 'b2b-customer', 'customer'], required: false, default: 'customer'},
  rights: {
    profile: {
      read:         {type: Boolean, required: true, default: true},
      write:        {type: Boolean, required: true, default: true},
    },
    tables: {
      read:         {type: Boolean, required: true, default: false},
      write:        {type: Boolean, required: true, default: false},
    },
    charts: {
      read:         {type: Boolean, required: true, default: false},
      write:        {type: Boolean, required: true, default: false},
    },
    global: {
      read:         {type: Boolean, required: true, default: false},
      write:        {type: Boolean, required: true, default: false},
    }
  },
  image:            {type: String,  required: false},
  firstName:        {type: String,  required: false},
  surname:          {type: String,  required: false},
  image:            {type: String,  required: false},
  street:           {type: String,  required: false},
  streetNumber:     {type: Number,  required: false},
  postcode:         {type: Number,  required: false},
  city:             {type: String,  required: false},
  country:          {type: String,  required: false},
  purchases:       [{type: String,  required: false}],
  purchaseHistory: [{type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: false}],
  waitingList:     [{type: String,  required: false}]
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
