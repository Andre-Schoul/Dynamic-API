/*const mongoose            = require('mongoose');
const miscellaneousSchema = mongoose.Schema({
    _id:     mongoose.Schema.Types.ObjectId,
    languages: [{
        language: {type: String, required: true},
        name:     {type: String, required: false,  default: ''},
        href:     {type: String, required: false,  default: ''}
    }],
    listPosition: {type: Number, required: true},
    listNumber:   {type: Number, required: true},
    isTop:        {type: Boolean,required: true},
    headline: [{
        language: {type: String, required: false},
        name:     {type: String, required: false, default: ''},
    }]
});

module.exports = mongoose.model('Miscellaneous', miscellaneousSchema);

miscellaneousSchema.pre('save', function(next) {
    if (!this.isTop && this.languages.length !== this.headline.length) {
        next(new Error('If navigation.isTop is false language & headline need the same amount of entries.'));
    }
    if (this.languages.length === 0) {
        next(new Error('Entry needs a language.'));
    }
    for (let i = 0; i < this.headline.length; i++) {
        //if ((!this.headline[i].language && this.headline[i].name) || (this.headline[i].language && !this.headline[i].name)) {
        //    next(new Error('Headline needs a language & a name.'));
        //}
        if (this.headline[i].language === '') next(new Error('Headline needs a language.'));
    }
    next();
});*/

const mongoose            = require('mongoose');
const miscellaneousSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  languages: [{
    language: {type: String, required: true},
    name:     {type: String, required: false,  default: ''},
    href:     {type: String, required: false,  default: ''},
    headline: {type: String, required: false,  default: ''}
  }],
  listPosition: {type: Number, required: true},
  listNumber:   {type: Number, required: true},
  isTop:        {type: Boolean,required: true}
});

miscellaneousSchema.pre('save', function(next) {
  if (!this.isTop && !this.languages[0].headline) {
    next(new Error('If \'navigation.isTop\' is false \'languages\' needs a \'headline\' entry.'));
  }
  if (this.languages.length === 0) {
    next(new Error('Entry needs at least one \'languages\' entry.'));
  }
  next();
});

module.exports = mongoose.model('Miscellaneous', miscellaneousSchema);
