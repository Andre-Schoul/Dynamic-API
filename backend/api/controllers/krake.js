
const Krake = require('../models/krake');
const controller = require('./template/controller');

exports.getAll = async (req, res, next) => {
    controller.getAll(req, res, next, Krake, {
        modelName: 'krakes',
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
};

exports.createOne = (req, res, next) => {
    controller.createOne(req, res, next, Krake, {
        modelName: 'krake'
    });
}

exports.getOne = (req, res, next) => {
    controller.getOne(req, res, next, Krake, {
        selectValues: 'name age salary',
        populateQuery: ''
    });
}

exports.patchOne = (req, res, next) => {
    controller.patchOne(req, res, next, Krake, {
        modelName: 'krake'
    });
}

exports.deleteOne = (req, res, next) => {
    controller.deleteOne(req, res, next, Krake, {
        modelName: 'krake'
    });
}

exports.deleteAll = (req, res, next) => {
    controller.deleteAll(req, res, next, Krake, {
        modelName: 'krake'
    });
}