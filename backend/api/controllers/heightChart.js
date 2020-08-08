/**
 *
 * @author André Schoul
 * @file controller for heightChart
 *
 */

const mongoose = require('mongoose');

const HeightChart = require('../models/heightChart');
const paging     = require('../middleware/paging');

exports.getAll = (req, res, next) => {
    let limit = parseInt(req.query.limit) || parseInt(10);
    let page = req.query.page || 1;
    HeightChart.find()
        .select('_id chart')
        .skip((limit * page) - limit)
        .limit(limit)
        .exec(function(err, docs) {
            HeightChart.countDocuments().exec(function(err, count) {
                if (err) return next(err.message);
                let headers = Object.keys(HeightChart.schema.paths);
                headers = JSON.stringify(headers).replace(/chart./g,'');
                headers = JSON.parse(headers);
                headers.pop();
                headers.pop();
                headers.push("region", "height");
                const response = {
                    count: docs.length,
                    headers: headers,
                    heightChart: docs.map(doc => {
                        return {
                            _id:   doc._id,
                            chart: doc.chart
                        }
                    })
                }
                paging(req, res, next, response, count, 'heightChart', limit, page);
            })
        });
}

exports.createOne = (req, res, next) => {
    const heightChart = new HeightChart({
        _id:   new mongoose.Types.ObjectId(),
        chart: req.body.chart
    });
    heightChart
        .save()
        .then(result => {
            res.status(201).json({
                message: 'Created Size',
                createdSize: {
                    _id:   result._id,
                    chart: result.chart
                }
            });
        })
        .catch(err => {res.status(500).json({error: err.message});});
}

exports.getOne = (req, res, next) => {
    HeightChart.findById(req.params.id)
        .select('_id chart')
        .exec()
        .then(doc => {
            if (doc) res.status(200).json({heightChart: doc});
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
    HeightChart.update({_id: id}, { $set: updateOps })
        .exec()
        .then(result => {res.status(200).json({message: 'Size updated'});})
        .catch(err => {res.status(500).json({error: err.message});});
}

exports.deleteOne = (req, res, next) => {
    HeightChart.deleteOne({_id: req.params.id})
        .exec()
        .then(result => {res.status(200).json({message: 'Size deleted'});})
        .catch(err => {res.status(500).json({error: err.message});});
}