
const Klops = require('../models/klops');
const controller = require('./template/controller');

exports.getAll = (req, res, next) => {
    controller.getAll(req, res, next, Klops, {
        modelName: 'klopse',
        query: {},
        selectValues: 'name age salary',
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
    controller.createOne(req, res, next, Klops, {
        modelName: 'klops'
    });
}

exports.getOne = (req, res, next) => {
    controller.getOne(req, res, next, Klops, {
        selectValues: 'name age salary',
        populateQuery: ''
    });
}

exports.patchOne = (req, res, next) => {
    controller.patchOne(req, res, next, Klops, {
        modelName: 'klops'
    });
}

exports.deleteOne = (req, res, next) => {
    controller.deleteOne(req, res, next, Klops, {
        modelName: 'klops'
    });
}

exports.deleteAll = (req, res, next) => {
    controller.deleteAll(req, res, next, Klops, {
        modelName: 'klops'
    });
}