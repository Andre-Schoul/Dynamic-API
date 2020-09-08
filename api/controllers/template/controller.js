/**
 *
 * @author André Schoul
 * @file template controller
 *
 */

const mongoose = require('mongoose');
const wrapper = require('../../middleware/wrapper');
const paging = require('../../middleware/paging');

/**
 * Modular controller function to get all entries of a given model with a given query
 * @param {Request} req Request object
 * @param {Response} res Response object
 * @param {Function} next Next function
 * @param {Schema} Model Mongoose schema
 * @param {JSON} options JSON object
 * @param {Function} callback Callback function
 */
/*exports.getAll = (req, res, next, Model, options, callback) => {
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
}*/
exports.getAll = wrapper(async (req, res, next, Model, options, callback) => {
  const limit = parseInt(req.query.limit) || parseInt(10);
  const page  = req.query.page || 1;
  delete req.query.page;
  delete req.query.limit;
  const query = options.query || req.query;
  const entries = await Model
    .find(query)
    .select(options.selectValues)
    .populate(options.populateQuery)
    .skip((limit * page) - limit)
    .sort(options.sort)
    .limit(limit);
  const count = await Model
    .countDocuments(query);
  const response = callback(Object.keys(Model.schema.paths), entries);
  response.entries = entries;
  paging(req, res, next, response, count, options.modelName, limit, page);
});

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
  const body = options.body || req.body;
  save(res, body, Model, options, callbackAfterSave);
}

/**
 * Modular controller function to get one entry for a given model with a specified id
 * @param {Request} req Request object
 * @param {Response} res Response object
 * @param {Function} next Next function
 * @param {Schema} Model Mongoose schema
 * @param {JSON} options JSON object
 */
/*exports.getOne = (req, res, next, Model, options) => {
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
}*/
exports.getOne = wrapper(async (req, res, next, Model, options) => {
  const entry = await Model
    .findById(req.params.id)
    .select(options.selectValues)
    .populate(options.populateQuery)
    .exec();
  if (entry) {
    res.status(200).json({entry: entry});
  } else {
    res.status(404).json({message: 'No valid entry found for provided ID'});
  }
});

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
/*exports.deleteOne = (req, res, next, Model, options, callbackAfterDelete) => {
  Model.deleteOne({_id: req.params.id})
    .exec()
    .then(result => {
      if (callbackAfterDelete) {
        callbackAfterDelete();
      }
      res.status(200).json({message: 'Deleted ' + options.modelName});
    })
    .catch(err => {res.status(500).json({error: err.message});});
}*/
exports.deleteOne = wrapper(async (req, res, next, Model, options, callbackAfterDelete) => {
  const entity = await Model
    .deleteOne({_id: req.params.id})
    .exec();
    if (entity && callbackAfterDelete) {
      callbackAfterDelete();
    }
});

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
      //res.status(201).json(Object.assign(message, resultValue));
      res.status(201).json({message: `Created ${options.modelName}`, entry: resultValue});
    })
    .catch(err => {res.status(500).json({error: err.message});});
}
