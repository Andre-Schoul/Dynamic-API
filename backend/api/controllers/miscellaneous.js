/**
 *
 * @author André Schoul
 * @file controller for miscellaneous
 *
 */

const Miscellaneous      = require('../models/miscellaneous');
const controller         = require('./template/controller');

exports.getAll = (req, res, next) => {
  controller.getAll(req, res, next, Miscellaneous, {
    modelName: 'miscellaneous',
    query: {},
    selectValues: '_id languages listPosition listNumber isTop',
    populateQuery: ''
  }, function(headers, docs) {
    headers.pop();
    const response = {
        count: docs.length,
        headers: headers
    }
    return response;
  });
}

exports.createOne = (req, res, next) => {
  controller.createOne(req, res, next, Miscellaneous, {
    modelName: 'miscellaneous',
    needsLanguage: true,
    isMiscellaneous: !req.body.isTop
  });
}

exports.getOne = (req, res, next) => {
  controller.getOne(req, res, next, Miscellaneous, {
    selectValues: '_id languages listPosition listNumber isTop',
    populateQuery: ''
  });
}


exports.patchOne = (req, res, next) => {
  controller.patchOne(req, res, next, Miscellaneous, {
    modelName: 'miscellaneous'
  });
}


exports.deleteOne = (req, res, next) => {
  controller.deleteOne(req, res, next, Miscellaneous, {
    modelName: 'miscellaneous'
  });
}

exports.deleteAll = (req, res, next) => {
  controller.deleteAll(req, res, next, Miscellaneous, {
    modelName: 'miscellaneous'
  });
}

