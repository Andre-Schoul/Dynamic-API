const mongoose = require('mongoose');
const manufacturerSchema = mongoose.Schema({
    _id:               mongoose.Schema.Types.ObjectId,
    name:             {type: String,  required: true},
    street:           {type: String,  required: true},
    streetNumber:     {type: Number,  required: true},
    postcode:         {type: Number,  required: true},
    country:          {type: String,  required: true},
    productVariants: [{type: mongoose.Schema.Types.ObjectId, ref: 'ProductVariant', required: false}]
});

module.exports = mongoose.model('Manufacturer', manufacturerSchema);

