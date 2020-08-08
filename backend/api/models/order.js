const mongoose    = require('mongoose');
const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    productVariants: [{type: mongoose.Schema.Types.ObjectId, ref: 'ProductVariant', required: true}], // required: true
    status: {
      status:   {type: String,  enum: ['pending', 'in delivery', 'arrived at customer', 'reorderd'], required: true},
      schedule: {type: String,  enum: ['on schedule', 'behind schedule'], required: true}
    }
});

module.exports = mongoose.model('Order', orderSchema);
