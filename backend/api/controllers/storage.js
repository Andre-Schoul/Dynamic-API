/**
 *
 * @author André Schoul
 * @file controller for products
 *
 */

const mongoose = require('mongoose');

const Storage        = require('../models/storage');
const ProductVariant = require('../models/productVariant');
const Manufacturer   = require('../models/manufacturer');

const paging = require('../middleware/paging');

exports.getAll = (req, res, next) => {
    let limit = parseInt(req.query.limit) || parseInt(10);
    let page = req.query.page || 1;
    // query to filter
    //let value = req.query.product;
    let query = {};
    //if(value) query['productType'] = value;
    //if(req.query.productType !== 'start' && req.query.productType !== 'hosen' && req.query.productType !== undefined)  query['productType'] = req.query.productType;
    Storage.find(query)
        .select('_id goods address')
        .populate('goods.provider', 'name street streetNumber postcode country')
        .populate('goods.productVariant', '_id name price reduced reducedPrice artikelnr groesse EAN product live')
        .skip((limit * page) - limit)
        .limit(limit)
        .exec(function(err, docs) {
            Storage.countDocuments(query).exec(function(err, count) {
                if (err) return res.status(500).json({error: err.message});
                let headers = Object.keys(Storage.schema.paths);
                headers = JSON.stringify(headers).replace(/address./g,'');
                headers = JSON.parse(headers);
                headers.pop();
                headers = Storage.schema.path('goods').schema._requiredpaths.concat(headers);
                let finishedHeaders = [];
                for (let i = 0; i < headers.length; i++) {
                    if (headers[i] !== 'goods') finishedHeaders.push(headers[i]);
                }
                const response = {
                    count: docs.length,
                    dropdowns: [],
                    headers: finishedHeaders,
                    productVariantHeaders: Object.keys(ProductVariant.schema.paths),
                    storage: docs.map(doc => {
                        return {
                            _id:     doc._id,
                            goods:   doc.goods,
                            address: doc.address
                        }
                    })
                }
                paging(req, res, next, response, count, 'storage', limit, page);
            })
        });
}

exports.createOne = (req, res, next) => {
    for (let i = 0; i < req.body.goods.length; i++) {
        Manufacturer.findById(req.body.goods[i].provider)
            .then(manufacturer => {
                if (!manufacturer) {
                    return res.status(404).json({message: 'Manufacturer not found'});
                } else {
                    ProductVariant.findById(req.body.goods[i].productVariant)
                        .then(productVariant => {
                            if (!productVariant) return res.status(404).json({ message: 'ProductVariant not found'});
                        });
                }
            });
    }
    const storage = new Storage({
        _id:     new mongoose.Types.ObjectId(),
        goods:   req.body.goods,
        address: req.body.address
    });
    storage
        .save()
        .then(result => {
            res.status(201).json({
                message: 'Created storage',
                createdStorage: {
                    _id:     result._id,
                    goods:   result.goods,
                    address: result.address
                }
            });
        })
        .catch(err => {res.status(510).json({error: err.message});});
}

exports.getOne = (req, res, next) => {
    Product.findById(req.params.id)
        .select('_id goods address')
        .populate('goods.provider', 'name street streetNumber postcode country')
        .populate('goods.productVariant', '_id name price reduced reducedPrice artikelnr groesse EAN product live')
        .exec()
        .then(doc => {
            if(doc) res.status(200).json({product: doc});
            else res.status(404).json({message: 'No valid entry found for provided ID'});
        })
        .catch(err => {res.status(500).json({error: err.message});});
}

exports.patchOne = (req, res, next) => {
    const id = req.params.id;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Storage.update({_id: id}, { $set: updateOps })
        .exec()
        .then(result => {res.status(200).json({message: 'Storage updated'});})
        .catch(err => {res.status(500).json({error: err.message});});
}

exports.deleteOne = (req, res, next) => {
    Storage.deleteOne({_id: req.params.id})
        .exec()
        .then(result => {res.status(200).json({message: 'Product deleted'});})
        .catch(err => {res.status(500).json({error: err.message});});
}