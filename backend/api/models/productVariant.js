const mongoose = require('mongoose');
const productVariantSchema = mongoose.Schema({
    _id:           mongoose.Schema.Types.ObjectId,
    languages: [{
        language:    {type: String, required: true},
        name:        {type: String, required: false, default: '-'}
    }],
    price:        {type: String,  required: true},
    reduced:      {type: Boolean, required: true},
    reducedPrice: {type: String,  required: false},
    itemNumber:   {type: String,  required: false}, // true
    size:         {type: String,  required: false}, // true
    EAN:          {type: Number,  required: false}, // true ?
    live:         {type: Boolean, required: false},
    product:      {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true}
});

module.exports = mongoose.model('ProductVariant', productVariantSchema);

productVariantSchema.pre('remove', function(next) {
    // Remove product variant from product & manufacturer
    this.model('Manufacturer').remove({ productVariants: this._id }, next);
    this.model('Product').remove({ productVariants: this._id }, next);
});
