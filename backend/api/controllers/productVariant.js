/**
 *
 * @author André Schoul
 * @file controller for product variants
 *
 */

const controller     = require('./template/controller');
const ProductVariant = require('../models/productVariant');
const Manufacturer   = require('../models/manufacturer');
const Product        = require('../models/product');;

exports.getAll = (req, res, next) => {
    controller.getAll(req, res, next, ProductVariant, {
        modelName: 'productvariants',
        query: {},
        selectValues: '_id languages price reduced reducedPrice itemNumber size EAN live product',
        populateQuery: [{path: 'product', select: 'name productType image additionalImages'}],
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
    Product.findById(req.body.product)
        .then(product => {
            if (!product) return res.status(404).json({message: 'Product not found'});
            controller.createOne(req, res, next, ProductVariant, {
                modelName: 'product variant',
                needsLanguage: true
            }, function (result) {
                Product.findByIdAndUpdate(req.body.product, {$addToSet: {productVariants: result._id}})
                    .then(updatedProduct => {
                        Manufacturer.findByIdAndUpdate(updatedProduct.producer, {$addToSet: {productVariants: result._id}})
                            .then(doc => {})
                            .catch(err => {res.status(500).json({error: err.message});});
                    })
                    .catch(err => {res.status(500).json({error: err.message});});
            });
        })
        .catch(err => {res.status(500).json({error: err.message});});
}

exports.getOne = (req, res, next) => {
    controller.getOne(req, res, next, ProductVariant, {
        selectValues: '_id languages price reduced reducedPrice itemNumber size EAN live product',
        populateQuery: [{path: 'product', select: 'name productType image additionalImages'}]
    });
}

exports.patchOne = (req, res, next) => {
    controller.patchOne(req, res, next, ProductVariant, {
        modelName: 'product variant'
    });
}

exports.deleteOne = (req, res, next) => {
    controller.deleteOne(req, res, next, ProductVariant, {
        modelName: 'product variant'
    });
}
