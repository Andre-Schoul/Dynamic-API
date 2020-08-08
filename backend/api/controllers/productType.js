/**
 *
 * @author André Schoul
 * @file controller for orders
 *
 */

const ProductType    = require('../models/productType');
const controller = require('./template/controller');

exports.getAll = (req, res, next) => {
    controller.getAll(req, res, next, ProductType, {
        modelName: 'ProductType',
        selectValues: '_id productType',
        populateQuery: ''
    }, function(headers, docs) {
        const response = {
            count: docs.length,
            headers: {}
        }
        return response;
    });
}

exports.createOne = (req, res, next) => {
    controller.createOne(req, res, next, ProductType, {
        modelName: 'productType'
    });
}

exports.getOne = (req, res, next) => {
    controller.getOne(req, res, next, ProductType, {
        selectValues: '_id productType'
    });
}

exports.patchOne = (req, res, next) => {
    controller.patchOne(req, res, next, ProductType, {
        modelName: 'productType'
    });
}

exports.deleteOne = (req, res, next) => {
    controller.deleteOne(req, res, next, ProductType, {
        modelName: 'productType'
    });
}