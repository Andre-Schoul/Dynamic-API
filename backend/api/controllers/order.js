/**
 *
 * @author André Schoul
 * @file controller for orders
 *
 */

const mongoose       = require('mongoose');

const Order          = require('../models/order');
const ProductVariant = require('../models/productVariant');

exports.order_getAll = (req, res, next) => {
    Order.find()
        .select('_id productVariants')
        .populate('productVariants', '_id name price reduced reducedPrice manufacturer')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                headers: Object.keys(Order.schema.paths),
                productEnums: null,
                enumPosition: [],
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        productVariants: doc.productVariants
                    }
                })
            });
        })
        .catch(err => {
            res.status(500).json({error: err});
        });
}

exports.order_createOrder = (req, res, next) => {
    ProductVariant.findById(req.body.productVariantIDs)
        .then(productVariant => {
            if(!productVariant) {
                return res.status(404).json({
                    message: 'ProductVariant not found',
                });
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                productVariants: req.body.productVariantIDs
            });
            return order.save()
        })
        .then(result => {
            res.status(201).json({
                message: 'Order stored',
                order: {
                    _id:             result._id,
                    productVariants: result.productVariants
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' + result._id
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

exports.order_getOrder = (req, res, next) => {
    Order.findById(req.params.id)
        .select('_id productVariants')
        .populate('productVariants', '_id name price reduced reducedPrice manufacturer')
        .exec()
        .then(doc => {
            if(doc) {
                res.status(200).json({
                    order: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders'
                    }
                });
            }
            else res.status(404).json({message: 'No valid entry found for provided ID'});
        })
        .catch(err => {
            res.status(500).json({error: err});
        });
}

exports.order_patchOrder = (req, res, next) => {
    const id = req.params.id;
    const updateOps = {};
    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Order.update({_id: id}, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' + id
                }
            });
        })
        .catch(err => {
            res.status(500).json({error: err});
        });
}

exports.order_deleteOrder = (req, res, next) => {
    Order.deleteOne({_id: req.params.id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order deleted'
            });
        })
        .catch(err => {
            res.status(500).json({error: err});
        });
}