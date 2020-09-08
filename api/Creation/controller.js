/**
 * Creates a mongoose controller
 * @param {JSON} name The name (singular & plural) of the controller
 * @param {JSON} data The data of the controller
 * @returns {string} The controller as a string
 */
exports.createController = (name, data) => {
  return `
const ${name.singular} = require('../models/${name.singular.toLowerCase()}');
const controller = require('./template/controller');

exports.getAll = (req, res, next) => {
    controller.getAll(req, res, next, ${name.singular}, {
        modelName: '${name.plural}',
        query: {},
        selectValues: '${data.map(({property}) => {return property}).join(' ')}',
        populateQuery: ''
    }, (headers, docs) => {
        headers.pop();
        const response = {
            count: docs.length,
            headers: headers
        }
        return response;
    });
}

exports.createOne = (req, res, next) => {
    controller.createOne(req, res, next, ${name.singular}, {
        modelName: '${name.singular.toLowerCase()}'
    });
}

exports.getOne = (req, res, next) => {
    controller.getOne(req, res, next, ${name.singular}, {
        selectValues: '${data.map(({property}) => {return property}).join(' ')}',
        populateQuery: ''
    });
}

exports.patchOne = (req, res, next) => {
    controller.patchOne(req, res, next, ${name.singular}, {
        modelName: '${name.singular.toLowerCase()}'
    });
}

exports.deleteOne = (req, res, next) => {
    controller.deleteOne(req, res, next, ${name.singular}, {
        modelName: '${name.singular.toLowerCase()}'
    });
}

exports.deleteAll = (req, res, next) => {
    controller.deleteAll(req, res, next, ${name.singular}, {
        modelName: '${name.singular.toLowerCase()}'
    });
}`
};
