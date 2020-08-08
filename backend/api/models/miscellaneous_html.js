const mongoose                 = require('mongoose');
const miscellaneous_htmlSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    languages: [{
        language: {type: String, required: true},
        href:     {type: String, required: false, default: ''}
    }],
    html:         {type: String, required: true},
    listPosition: {
        type: Number, required: true,
        min: [0, 'The value of path `{PATH}` ({VALUE}) is beneath the limit ({MIN}).'],
        max: [3, 'The value of path `{PATH}` ({VALUE}) exceeds the limit ({MAX}).']
    }
});

module.exports = mongoose.model('Miscellaneous_html', miscellaneous_htmlSchema, 'miscellaneous_html');
