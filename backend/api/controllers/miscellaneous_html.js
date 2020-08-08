/**
 *
 * @author André Schoul
 * @file controller for miscellaneous
 *
 */

const Miscellaneous_html = require('../models/miscellaneous_html');
const controller         = require('./template/controller');

exports.getAll = (req, res, next) => {
    controller.getAll(req, res, next, Miscellaneous_html, {
        modelName: 'miscellaneous_html',
        query: {},
        selectValues: '_id languages html listPosition',
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
    controller.createOne(req, res, next, Miscellaneous_html, {
        modelName: 'miscellaneous_html',
        needsLanguage: true
    });
}

exports.getOne = (req, res, next) => {
    controller.getOne(req, res, next, Miscellaneous_html, {
        selectValues: '_id languages html listPosition',
        populateQuery: ''
    });
}

exports.patchOne = (req, res, next) => {
    controller.patchOne(req, res, next, Miscellaneous_html, {
        modelName: 'miscellaneous_html'
    });
}

exports.deleteOne = (req, res, next) => {
    controller.deleteOne(req, res, next, Miscellaneous_html, {
        modelName: 'miscellaneous_html'
    });
}