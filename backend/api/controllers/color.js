/**
 *
 * @author André Schoul
 * @file controller for colors
 *
 */

const Color      = require('../models/color');
const controller = require('./template/controller');

exports.getAll = (req, res, next) => {
    controller.getAll(req, res, next, Color, {
        modelName: 'colors',
        query: {},
        selectValues: '_id name color',
        populateQuery: ''
    }, function(headers, docs) {
        const response = {
            count: docs.length,
            headers: {
                "_id": "",
                "name": "sort",
                "color": ""
            }
        }
        return response;
    });
}

exports.createOne = (req, res, next) => {
    controller.createOne(req, res, next, Color, {
        modelName: 'color',
    });
}

exports.getOne = (req, res, next) => {
    controller.getOne(req, res, next, Color, {
        selectValues: '_id name color',
        populateQuery: ''
    });
}

exports.patchOne = (req, res, next) => {
    controller.patchOne(req, res, next, Color, {
        modelName: 'color'
    });
}

exports.deleteOne = (req, res, next) => {
    controller.deleteOne(req, res, next, Color, {
        modelName: 'color'
    });
}
