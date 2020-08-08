const mongoose       = require('mongoose');
const languageSchema = mongoose.Schema({
    _id:              mongoose.Schema.Types.ObjectId,
    defaultLanguage: {type: String, required: true},
    language:        {type: String, required: true, unique: true}
    //languages:      [{type: String, required: true}]
});

module.exports = mongoose.model('Language', languageSchema);
