const mongoose   = require('mongoose');
const navigationSchema = mongoose.Schema({
    _id:       mongoose.Schema.Types.ObjectId,
    links: [{           // no array
        name:         {type: String, required: true},
        listNumber:   {type: Number, required: true},
        listPosition: {type: Number, required: true}
    }]
});

module.exports = mongoose.model('Navigation', navigationSchema);