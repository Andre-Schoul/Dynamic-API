/**
 *
 * @author André Schoul
 * @file controller for navigation
 *
 */

const mongoose = require('mongoose');

const Navigation = require('../models/navigation');
const paging     = require('../middleware/paging');

exports.links_getAll = (req, res, next) => {
    let limit = parseInt(req.query.limit) || parseInt(10);
    let page = req.query.page || 1;
    Navigation.find()
        .select('_id links')
        .skip((limit * page) - limit)
        .limit(limit)
        .exec(function(err, docs) {
            Navigation.countDocuments().exec(function(err, count) {
            if (err) return next(err);
            const response = {
                count: docs.length,
                headers: Object.keys(Navigation.schema.paths),
                links: docs.map(doc => {
                    return {
                        _id:   doc._id,
                        links: doc.links,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/navigations/' + doc._id
                        }
                    }
                })
            }
            paging(req, res, next, response, count, 'navigations', limit, page);
        })
        /*.catch(err => {
            res.status(500).json({error: err});
        });
        */
    });
}

exports.navigation_createLink = (req, res, next) => {
    const navigation = new Navigation({
        _id:   new mongoose.Types.ObjectId(),
        links: req.body.links,
    });
    navigation
        .save()
        .then(result => {
            res.status(201).json({
                message: 'Created link',
                createdLink: {
                    _id:   result._id,
                    links: result.links,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/navigations/' + result._id
                    }
                }
            });
        })
        .catch(err => {
            res.status(500).json({error: err});
        });
}

exports.navigation_getLink = (req, res, next) => {
    Navigation.findById(req.params.id)
        .select('_id links')
        .exec()
        .then(doc => {
            if(doc) {
                res.status(200).json({
                    navigation: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/navigations'
                    }
                });
            }
            else res.status(404).json({message: 'No valid entry found for provided ID'});
        })
        .catch(err => {
            res.status(500).json({error: err});
        });
}

exports.navigation_patchLink = (req, res, next) => {
    const id = req.params.id;
    const updateOps = {};
    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    console.log(updateOps);
    Navigation.update({_id: id}, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Link updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/navigations/' + id
                }
            });
        })
        .catch(err => {
            res.status(500).json({error: err});
        });
}

exports.navigation_deleteLink = (req, res, next) => {
    Navigation.deleteOne({_id: req.params.id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Link deleted'
            });
        })
        .catch(err => {
            res.status(500).json({error: err});
        });
}