/**
 *
 * @author André Schoul
 * @file controller for database models
 *
 */

const Database = require('../models/database');
const controller = require('./template/controller');
const creation = require('../Creation');

exports.getAll = (req, res, next) => {
  controller.getAll(req, res, next, Database, {
      modelName: 'databases',
      query: {},
      selectValues: '_id name data auth',
      populateQuery: ''
  }, (headers, docs) => {
      const response = {
          count: docs.length,
          headers: {
              "_id": "sort",
              "name": "sort",
              "data": "sort",
              "auth": "sort"
          }
      }
      return response;
  });
}

exports.createOne = (req, res, next) => {
  if (!creation.findFileInDirectory(`./backend/api/models/${req.body.name.singular}.js`) ||
      !creation.findFileInDirectory(`./backend/api/controllers/${req.body.name.singular}.js`) ||
      !creation.findFileInDirectory(`./backend/api/routes/${req.body.name.singular}.js`)) {
    controller.createOne(req, res, next, Database, {
      modelName: 'database',
    }, () => {
      //creation.createEndpoint(req.body.name, req.body.data, req.body.auth);
      creation.createEndpoint(req.body.name, req.body, req.body.auth);
    });
  } else {
    res.status(422).json({message: 'Endpoint exists already'});
  }
}

exports.getOne = (req, res, next) => {
  controller.getOne(req, res, next, Database, {
    selectValues: '_id name data auth',
      populateQuery: ''
  });
}

exports.patchOne = (req, res, next) => {
  controller.patchOne(req, res, next, Database, {
      modelName: 'database'
  });
}

exports.deleteOne = (req, res, next) => {
  Database.findById(req.params.id)
    .exec()
    .then(doc => {
      if (doc) {
        controller.deleteOne(req, res, next, Database, {
            modelName: 'database'
        }, () => {
          creation.deleteEndpoint(doc.name.singular);
          });
      } else {
        res.status(404).json({message: 'No valid entry found for provided ID'});
      }
    })
    .catch(err => {res.status(500).json({error: err.message});});
}
