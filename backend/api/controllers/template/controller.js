/**
 *
 * @author André Schoul
 * @file template controller
 *
 */

const mongoose = require('mongoose');
const paging   = require('../../middleware/paging');
const Language = require('../../models/language');

/**
 * Modular controller function to get all entries of a given model with a given query
 * @param {Request} req Request object
 * @param {Response} res Response object
 * @param {Function} next Next function
 * @param {Schema} Model Mongoose schema
 * @param {JSON} options JSON object
 * @param {Function} callback Callback function
 */
exports.getAll = (req, res, next, Model, options, callback) => {
  let limit = parseInt(req.query.limit) || parseInt(10);
  let page  = req.query.page || 1;
  delete req.query.page;
  delete req.query.limit;
  Model.find(req.query)
    .select(options.selectValues)
    .populate(options.populateQuery)
    .skip((limit * page) - limit)
    .sort(options.sort)
    .limit(limit)
    .then(docs => {
      Model.countDocuments(req.query)
        .then(count => {
          const response = callback(Object.keys(Model.schema.paths), docs);
          response.entries = docs;
          paging(req, res, next, response, count, options.modelName, limit, page);
        })
        .catch(err => {res.status(500).json({error: err.message});});
    })
    .catch(err => {res.status(500).json({error: err.message});});
}

/**
 * Modular controller function to create an entry for a given model
 * @param {Request} req Request object
 * @param {Response} res Response object
 * @param {Function} next Next function
 * @param {Schema} Model Mongoose schema
 * @param {JSON} options JSON object
 * @param {Function} callbackAfterSave Callback function after saving the entry
 */
exports.createOne = (req, res, next, Model, options, callbackAfterSave) => {
  if (options.referencedModels) {
    for (let i = 0; i < options.referencedModels.length; i++) {
      options.referencedModels[i].Model.findById(options.referencedModels[i].id)
        .then(entity => {
          if (!entity) {
            return res.status(404).json({message: options.referencedModels[i].name + ' not found'});
          }
        })
        .catch(err => {res.status(500).json({error: err.message});});
    }
  }
  if (options.needsLanguage) {
    addLanguage(req, res, next, Model, options.isMiscellaneous, () => {
      save(res, req.body, Model, options, callbackAfterSave);
    });
  } else {
    save(res, req.body, Model, options, callbackAfterSave);
  }
}

/**
 * Modular controller function to get one entry for a given model with a specified id
 * @param {Request} req Request object
 * @param {Response} res Response object
 * @param {Function} next Next function
 * @param {Schema} Model Mongoose schema
 * @param {JSON} options JSON object
 */
exports.getOne = (req, res, next, Model, options) => {
  Model.findById(req.params.id)
    .select(options.selectValues)
    .populate(options.populateQuery)
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json({entry: doc});
      } else {
        res.status(404).json({message: 'No valid entry found for provided ID'});
      }
    })
    .catch(err => {res.status(500).json({error: err.message});});
}

/**
 * Modular controller function to patch an entry for a given model with a specified id
 * @param {Request} req Request object
 * @param {Response} res Response object
 * @param {Function} next Next function
 * @param {Schema} Model Mongoose schema
 * @param {JSON} options JSON object
 * @param {Function} callbackAfterUpdate Callback function after updating the entry
 */
exports.patchOne = (req, res, next, Model, options, callbackAfterUpdate) => {
  const id = req.params.id;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Model.findOneAndUpdate({_id: id}, {$set: updateOps}, {new: true})
    .exec()
    .then(result => {
      if (callbackAfterUpdate) {
        callbackAfterUpdate(result);
      }
      res.status(200).json({message: 'Updated ' + options.modelName});
    })
    .catch(err => {res.status(500).json({error: 'err.message'});});
}

/**
 * Modular controller function to delete an entry for a given model with a specified id
 * @param {Request} req Request object
 * @param {Response} res Response object
 * @param {Function} next Next function
 * @param {Schema} Model Mongoose schema
 * @param {JSON} options JSON object
 * @param {Function} callbackAfterDelete Callback function after deleting the entry
 */
exports.deleteOne = (req, res, next, Model, options, callbackAfterDelete) => {
  Model.deleteOne({_id: req.params.id})
    .exec()
    .then(result => {
      if (callbackAfterDelete) {
        callbackAfterDelete();
      }
      res.status(200).json({message: 'Deleted ' + options.modelName});
    })
    .catch(err => {res.status(500).json({error: err.message});});
}

/**
 * Modular controller function to delete all entries for a given model
 * @param {Request} req Request object
 * @param {Response} res Response object
 * @param {Function} next Next function
 * @param {Schema} Model Mongoose schema
 * @param {JSON} options JSON object
 * @param {Function} callbackAfterDelete Callback function after deleting all entries
 */
exports.deleteAll = (req, res, next, Model, options, callbackAfterDelete) => {
  Model.deleteMany({})
    .then(doc => {
      if (callbackAfterDelete) {
        callbackAfterDelete();
      }
      res.status(200).json({message: 'Deleted ' + options.modelName});
    })
    .catch(err => {res.status(500).json({error: err.message});});
}

/**
 * Modular controller function to add a language entry for a given model
 * @param {Request} req Request object
 * @param {Response} res Response object
 * @param {Function} next Next function
 * @param {Schema} Model Mongoose schema
 * @param {Boolean} isMiscellaneous
 * @param {Function} create
 */
const addLanguage = (req, res, next, Model, isMiscellaneous, create) => {
  Language.find({})
    .then(languages => {
      for (let i = 0; i < languages.length; i++) {
        let containsLanguage = false;
        for (let j = 0; j < req.body.languages.length; j++) {
          if (req.body.languages[j].language === languages[i].language) {
            containsLanguage = true;
          }
        }
        if (!containsLanguage) {
          req.body.languages.push({"language": languages[i].language});
          //if (isMiscellaneous) req.body.headline.push({language: languages[i].language});
        }
      }
      create();
    })
    .catch(err => {res.status(500).json({error: err.message});});
}

/**
 * Helper function to save an entry for a given model
 * @param {Request} req Request object
 * @param {Response} res Response object
 * @param {Schema} Model Mongoose schema
 * @param {JSON} options JSON object
 * @param {Function} callbackAfterSave Callback function after saving an entry
 */
const save = (res, body, Model, options, callbackAfterSave) => {
  const model = new Model(Object.assign({}, {_id: new mongoose.Types.ObjectId()}, body));
  model
    .save()
    .then(result => {
      if (callbackAfterSave) {
        callbackAfterSave(result);
      }
      const message = {message: `Created ${options.modelName}`};
      const resultValue = result.toJSON();
      delete resultValue['__v'];
      res.status(201).json(Object.assign(message, resultValue));
    })
    .catch(err => {res.status(500).json({error: err.message});});
}
