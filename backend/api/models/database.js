const mongoose = require('mongoose');
const databaseSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
      singular: {type: String, required: true},
      plural: {type: String, required: true}
    },
    data: [{
      property: {type: String, required: true},
      type: {type: String, required: true}
    }],
    auth: {
      auth: {type: Boolean, required: true},
      getAll: {type: Boolean, required: true},
      createOne: {type: Boolean, required: true},
      deleteAll: {type: Boolean, required: true},
      getOne: {type: Boolean, required: true},
      patchOne: {type: Boolean, required: true},
      deleteOne: {type: Boolean, required: true},
    },
    preHooks: {
      init: {type: Boolean, required: true},
      validate: {type: Boolean, required: true},
      save: {type: Boolean, required: true},
      remove: {type: Boolean, required: true}
    },
    postHooks: {
      init: {type: Boolean, required: true},
      validate: {type: Boolean, required: true},
      save: {type: Boolean, required: true},
      remove: {type: Boolean, required: true}
    }
});

module.exports = mongoose.model('Database', databaseSchema);
