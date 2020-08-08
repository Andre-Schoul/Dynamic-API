const mongoose      = require('mongoose');
const storageSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    goods: [{
        productVariant:     {type: mongoose.Schema.Types.ObjectId, ref: 'ProductVariant', required: true},
        stock:              {type: Number, required: true},
        thresholdTillOrder: {type: Number, required: true},
        AmountToOrder:      {type: Number, required: true},
        provider:           {type: mongoose.Schema.Types.ObjectId, ref: 'Manufacturer', required: true}
    }],
    address: {
        name:         {type: String,  required: true},
        street:       {type: String,  required: true},
        streetNumber: {type: Number,  required: true},
        postcode:     {type: Number,  required: true},
        country:      {type: String,  required: true},
    }
});

module.exports = mongoose.model('Storage', storageSchema, 'storage');
