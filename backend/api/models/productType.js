const mongoose          = require('mongoose');
const productTypeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    productType: {type: String, required: true, unique: true, default: 'none'}
});

module.exports = mongoose.model('ProductType', productTypeSchema);
