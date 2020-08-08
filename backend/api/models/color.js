const mongoose = require('mongoose');
const colorSchema = mongoose.Schema({
    _id:    mongoose.Schema.Types.ObjectId,
    name:  {type: String, required: true},
    color: {
        r:    {type: Number, required: true},
        g:    {type: Number, required: true},
        b:    {type: Number, required: true},
        a:    {type: Number, required: false}
    }
});

module.exports = mongoose.model('Color', colorSchema);