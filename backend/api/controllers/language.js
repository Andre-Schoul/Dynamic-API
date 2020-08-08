/**
 *
 * @author André Schoul
 * @file controller for orders
 *
 */

const controller         = require('./template/controller');
const Language           = require('../models/language');
// Schemas whose languages need to be updated
const Product            = require('../models/product');
const ProductVariant     = require('../models/productVariant');
const Miscellaneous      = require('../models/miscellaneous');
const Miscellaneous_html = require('../models/miscellaneous_html');

exports.getAll = (req, res, next) => {
    controller.getAll(req, res, next, Language, {
        modelName: 'languages',
        query: {},
        selectValues: '_id defaultLanguage language',
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
    controller.createOne(req, res, next, Language, {
        modelName: 'language',
    }, function (result) {
        updateLanguages([Product, ProductVariant, Miscellaneous, Miscellaneous_html], result, true, res);
    });
}

exports.getOne = (req, res, next) => {
    controller.getOne(req, res, next, Language, {
        selectValues: '_id defaultLanguage language',
        populateQuery: ''
    });
}

exports.patchOne = (req, res, next) => {
    controller.patchOne(req, res, next, Language, {
        modelName: 'language'
    });
}

exports.deleteOne = (req, res, next) => {
    Language.findById(req.params.id)
        .exec()
        .then(doc => {
            if (doc) {
                if (doc.defaultLanguage === doc.language) res.status(403).json({message: 'Default language cannot be deleted'});
                else {
                    controller.deleteOne(req, res, next, Language, {
                        modelName: 'language'
                    }, function () {
                        updateLanguages([Product, ProductVariant, Miscellaneous, Miscellaneous_html], doc, false, res);
                    });
                }
            } else res.status(404).json({message: 'No valid entry found for provided ID'});
        })
        .catch(err => {res.status(500).json({error: err.message});});
}

exports.deleteAll = (req, res, next) => {
  controller.deleteAll(req, res, next, Language, {
      modelName: 'language'
  });
}

function updateLanguages(Models, doc, add, res) {
    for (let i = 0; i < Models.length; i ++) {
        if (add) {
            if (Models[i] === Miscellaneous) {
                Models[i].updateMany({isTop: true}, {$addToSet: {languages: {language: doc.language}}})
                    .exec()
                    .then(result => {})
                    .catch(err => {res.status(500).json({error: err.message});});
                Models[i].updateMany({isTop: false}, {$addToSet: {languages: {language: doc.language}, headline: {language: doc.language}}})
                    .exec()
                    .then(result => {})
                    .catch(err => {res.status(500).json({error: err.message});});
            } else {
                Models[i].updateMany({}, {$addToSet: {languages: {language: doc.language}}})
                    .exec()
                    .then(result => {})
                    .catch(err => {res.status(500).json({error: err.message});});
            }
        } else {
            if (Models[i] === Miscellaneous) {
                Models[i].updateMany({isTop: true}, {$pull: {languages: {language: doc.language}}})
                    .exec()
                    .then(result => {})
                    .catch(err => {res.status(500).json({error: err.message});});
                Models[i].updateMany({isTop: false}, {$pull: {languages: {language: doc.language}, headline: {language: doc.language}}})
                    .exec()
                    .then(result => {})
                    .catch(err => {res.status(500).json({error: err.message});});
            } else {
                Models[i].updateMany({}, {$pull: {languages: {language: doc.language}}})
                    .exec()
                    .then(result => {})
                    .catch(err => {res.status(500).json({error: err.message});});
            }
        }
    }
}
