/**
 *
 * @author André Schoul
 * @file controller for manufacturers
 *
 */

const mongoose       = require('mongoose');
const Manufacturer   = require('../models/manufacturer');
const paging         = require('../middleware/paging');

exports.getAll = (req, res, next) => {
    let limit = parseInt(req.query.limit) || parseInt(20);
    let page = req.query.page || 1;
    Manufacturer.find()
        .select('_id name street streetNumber postcode country productVariants')
        .populate('productVariants', '_id name price reduced reducedPrice manufacturer')
        .skip((limit * page) - limit)
        .limit(limit)
        .exec(function(err, docs) {
            Manufacturer.count().exec(function(err, count) {
                if (err) return next(err);
                let headers = Object.keys(Manufacturer.schema.paths);
                headers.pop();
                let producer = new Set();
                const response = {
                    headers: headers,
                    productEnums: null,
                    enumPosition: [],
                    producer: docs.producer,
                    manufacturers: docs.map(doc => {
                        producer.add({name: doc.name, id: doc._id});
                        return {
                            _id:             doc._id,
                            name:            doc.name,
                            street:          doc.street,
                            streetNumber:    doc.streetNumber,
                            postcode:        doc.postcode,
                            country:         doc.country,
                            productVariants: doc.productVariants
                        }
                    }),
                    producer: [...producer]
                }
                paging(req, res, next, response, count, 'manufacturers', limit, page);
            })
        });
}

exports.createOne = (req, res, next) => {
    const manufacturer = new Manufacturer({
        _id:             mongoose.Types.ObjectId(),
        name:            req.body.name,
        street:          req.body.street,
        streetNumber:    req.body.streetNumber,
        postcode:        req.body.postcode,
        country:         req.body.country,
        productVariants: req.body.productVariantIDs
    });
    manufacturer
        .save()
        .then(result => {
            res.status(201).json({
                message: 'Manufacturer stored',
                manufacturer: {
                    _id:             result._id,
                    name:            result.name,
                    street:          result.street,
                    streetNumber:    result.streetNumber,
                    postcode:        result.postcode,
                    country:         result.country,
                    productVariants: result.productVariants
                }
            });
        })
        .catch(err => {res.status(500).json({error: err.message});});
}

exports.getOne = (req, res, next) => {
    Manufacturer.findById(req.params.id)
        .select('_id name street streetNumber postcode country productVariants')
        .populate('productVariants', '_id name price reduced reducedPrice manufacturer')
        .exec()
        .then(doc => {
            if (doc) res.status(200).json({manufacturer: doc});
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
    Manufacturer.update({_id: id}, { $set: updateOps })
        .exec()
        .then(result => {res.status(200).json({message: 'Manufacturer updated'});})
        .catch(err => {res.status(500).json({error: err.message});});
}

exports.deleteOne = (req, res, next) => {
    Manufacturer.deleteOne({_id: req.params.id})
        .exec()
        .then(result => {res.status(200).json({message: 'Manufacturer deleted'});})
        .catch(err => {res.status(500).json({error: err.message});});
}