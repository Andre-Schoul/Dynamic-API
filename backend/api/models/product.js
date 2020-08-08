const mongoose      = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const productSchema = mongoose.Schema({
  _id:            mongoose.Schema.Types.ObjectId,
  id:            {type: Number, default: 0},
  languages: [{
    language:    {type: String, required: true},
    name:        {type: String, required: false, default: '-'},
    description: {type: String, required: false, default: '-'}
  }],
  productType:   {type: String, required: false}, // true
  image:         {type: String, required: false, default: ''},
  additionalImages: [{
    picture:     {type: String, required: false, default: ''},
    thumbnail:   {type: String, required: false, default: ''}
  }],
  productVariants: [{type: mongoose.Schema.Types.ObjectId, ref: 'ProductVariant', required: false}],
  producer:         {type: mongoose.Schema.Types.ObjectId, ref: 'Manufacturer',   required: false} // true
});

productSchema.path('languages').validate((languages) => {
  // console.log(languages);
  if (!languages || languages.length === 0) return false;
  return true;
}, 'Product needs to have at least one "language" entry');

productSchema.pre('save', function(next) {
  let safe = true;
  /*if ((!this.image.picture &&  this.image.thumbnail) ||
      ( this.image.picture && !this.image.thumbnail)) safe = false;*/
  if (safe) {
    for (let i = 0; i < this.additionalImages.length; i++) {
      if ((!this.additionalImages[i].picture &&  this.additionalImages[i].thumbnail) ||
          ( this.additionalImages[i].picture && !this.additionalImages[i].thumbnail)) safe = false;
    }
  } // else return next(new Error('Image needs picture and thumbnail component.'));
  if (safe) next();
  else next(new Error('Additional images need picture and thumbnail components.'));
});

productSchema.pre('delete', function(next) {
  // Remove all the product variant docs that reference the removed ProductVariant.
  this.model('ProductVariant').remove({ _id: this._id }, next);
});

productSchema.plugin(AutoIncrement, {inc_field: 'id'});

productSchema.statics.counterReset('id', (err) => {
  // Now the counter is 0
});

module.exports = mongoose.model('Product', productSchema);
