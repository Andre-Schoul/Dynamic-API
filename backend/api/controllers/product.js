/**
 *
 * @author André Schoul
 * @file controller for products
 *
 */

const Product            = require('../models/product');
const ProductType        = require('../models/productType');
const ProductVariant     = require('../models/productVariant');
const Manufacturer       = require('../models/manufacturer');
const controller         = require('./template/controller');

exports.getAll = (req, res, next) => {
    ProductType.find()
        .select('productType')
        .exec()
        .then(result => {
            let productTypes = [];
            for (let i = 0; i < result.length; i++) {
                productTypes.push(result[i].productType);
            }
            let productTypeValue = req.query.product;
            let productName = req.query.name;
            let query = {};
            if (productTypeValue) query['productType'] = productTypeValue;
            if (productName) query['languages.name'] = new RegExp(productName, "i");
            controller.getAll(req, res, next, Product, {
                modelName: 'products',
                query: query,
                selectValues: '_id id languages productType image additionalImages producer productVariants',
                populateQuery: [
                    {path: 'productVariants', select: 'languages price reduced reducedPrice itemNumber size EAN live'},
                    {path: 'producer',        select: 'name'}],
                sort: {
                    id: 1,
                    productType: 1
                }
            }, function (headers, docs) {
                headers = JSON.stringify(headers).replace('"languages",', '"languages","name",');
                headers = JSON.parse(headers);
                headers.shift();
                headers.pop();

                const headerTable = {};
                for (let i = 0; i < headers.length; i++) {
                  if (headers[i] !== 'productVariants' && headers[i] !== 'languages') {
                    if (headers[i] === 'productType') {
                      headerTable[headers[i]] = productTypes;
                    } else {
                      if (!headers[i].startsWith('image') && !headers[i].startsWith('additionalImages')) {
                        headerTable[headers[i]] = "sort";
                      } else {
                        headerTable[headers[i]] = "";
                      }
                    }
                  }
                }

                let productVariantHeaders = Object.keys(ProductVariant.schema.paths);
                productVariantHeaders.pop();
                const response = {
                    count: docs.length,
                    headers: headerTable,
                    productTypes: productTypes,
                    productVariantHeaders: productVariantHeaders
                }
                return response;
            });
        })
        .catch(err => {res.status(500).json({error: err});});
}

exports.createOne = (req, res, next) => {
    ProductType.find()
        .select('productType')
        .exec()
        .then(result => {
            let matchedType = false;
            let productType = req.body.productType || 'none';
            for (let i = 0; i < result.length; i++) {
                if (productType === result[i].productType) matchedType = true;
            }
            if (matchedType) {
                controller.createOne(req, res, next, Product, {
                    modelName: 'product',
                    referencedModels: [
                        {
                            Model: Manufacturer,
                            name: 'Manufacturer',
                            id: req.body.producer
                        }
                    ],
                    needsLanguage: true
                }, function (result) {
                    Manufacturer.findByIdAndUpdate(req.body.producer, {$addToSet: {productVariants: result.productVariants}})
                        .then(doc => {})
                        .catch(err => {res.status(500).json({error: err.message});});
                });
            } else res.status(404).json({error: `Product validation failed: productType '${req.body.productType}' is not a valid value for path 'productType'.`});
        })
        .catch(err => {res.status(500).json({error: err.message});});
}

exports.getOne = (req, res, next) => {
    controller.getOne(req, res, next, Product, {
        selectValues: '_id name productType image additionalImages languages producer id',
        populateQuery: [
            {path: 'productVariants', select: 'languages price reduced reducedPrice itemNumber size EAN live'},
            {path: 'producer', select: 'name'}]
    });
}

exports.patchOne = (req, res, next) => {
    controller.patchOne(req, res, next, Product, {
        modelName: 'product'
    })
}

exports.deleteOne = (req, res, next) => {
    Product.findById(req.params.id)
        .then(product => {
            for (let i = 0; i < product.productVariants.length; i++) {
                ProductVariant.deleteOne({_id: product.productVariants[i]})
                    .exec()
                    .then(result => {})
                    .catch(err => {res.status(500).json({error: err.message});});
            }
            controller.deleteOne(req, res, next, Product, {
                modelName: 'product'
            });
        })
        .catch(err => {res.status(500).json({error: err.message});});
}

exports.deleteAll = (req, res, next) => {
    Product.deleteMany({})
        .exec()
        .then(doc => {
            ProductVariant.deleteMany({})
                .exec()
                .then(result => {res.status(200).json({message: 'All products and their variants deleted'});})
                .catch(err => {res.status(500).json({error: err.message});});
        })
        .catch(err => {res.status(500).json({error: err.message});});
}
