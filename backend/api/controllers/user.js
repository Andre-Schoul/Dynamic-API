/**
 *
 * @author André Schoul
 * @file controller for user
 *
 */

const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const User     = require('../models/user');
const paging   = require('../middleware/paging');


exports.getAll = (req, res, next) => {
  let limit = parseInt(req.query.limit) || parseInt(20);
  let page = req.query.page || 1;
  let value = req.query.product;
  let query = {};
  console.log(req.query);
  //User.find(query)
  User.find(req.query)
    .select('_id email password role rights_profile rights_tables rights_charts rights_global firstName surname image street streetNumber postcode city country purchaseHistory waitingList')
    .skip((limit * page) - limit)
    .limit(limit)
    .exec(function(err, docs) {
      User.countDocuments(query).exec(function(err, count) {
        if (err) {
          return next(err.message);
        }
        const response = {
          count: docs.length,
          headers: Object.keys(User.schema.paths),
          productEnums: null,
          enumPosition: [],
          users: docs.map(doc => {
            return {
              _id:             doc._id,
              email:           doc.email,
              password:        doc.password,
              role:            doc.role,
              rights:          doc.rights,
              image:           doc.image,
              firstName:       doc.firstName,
              surname:         doc.surname,
              image:           doc.image,
              street:          doc.street,
              streetNumber:    doc.streetNumber,
              postcode:        doc.postcode,
              city:            doc.city,
              country:         doc.country,
              purchases:       doc.purchase,
              purchaseHistory: doc.purchaseHistory,
              waitingList:     doc.waitingList
            }
          })
        }
        paging(req, res, next, response, count, 'users', limit, page);
      })
    });
}
/*
exports.getAll = (req, res, next) => {
  controller.getAll(req, res, next, User, {
    modelName: 'users',
    query: {},
    selectValues: '_id email password role rights_profile rights_tables rights_charts rights_global firstName surname image street streetNumber postcode city country purchaseHistory waitingList',
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
*/
exports.signup = (req, res, next) => {
  bcryptjs.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({error: err.message});
    } else {
      const user = new User({
        _id:          new mongoose.Types.ObjectId(),
        email:        req.body.email,
        password:     hash,
        role:         req.body.role,
        rights:       req.body.rights,
        image:        req.body.image,
        firstName:    req.body.firstName,
        surname:      req.body.surname,
        image:        req.body.image,
        street:       req.body.street,
        streetNumber: req.body.streetNumber,
        postcode:     req.body.postcode,
        city:         req.body.city,
        country:      req.body.country
      });
      user
        .save()
        .then(result => {res.status(201).json({message: 'User created'});})
        //.catch(err => {res.status(500).json({message: err.message});});
        //.catch(err => {res.status(500).json({message: 'Email adress already taken'});});
        .catch(err => {
          if (err.message.includes('unique')) {
            res.status(500).json({message: 'Email address already taken'});
          } else {
            res.status(500).json({message: 'Invalid email address'});
          }
        });
    }
  });
}
/*
exports.login = (req, res, next) => {
  User.findOne({email: req.body.email})
    .then(user => {
      if (!user) {
        return res.status(401).json({message: 'Authorization failed'});
      }
      bcryptjs.compare(req.body.password, user.password, (err, result) => {
        if (result) {
          const token = jwt.sign({
            email: user.email,
            id:    user._id
          }, process.env.JWT_KEY, {
            expiresIn: "1h"
          });
          return res.status(200).json({
            message: 'Authorization successful',
            token: token,
            role: user.role
          });
        }
        return res.status(401).json({message: 'Authorization failed'});
      });
    })
    .catch(err => {res.status(500).json({error: err.message});});
}*/
exports.login = (req, res, next) => {
  User.findOne({email: req.body.email})
    .then(user => {
      if (!user) {
        //return res.status(401).json({message: 'Authorization failed'});
        return res.status(401).json({message: 'Invalid authentication credentials'});
      }
      bcryptjs.compare(req.body.password, user.password)
        .then(result => {
          if (result) {
            const token = jwt.sign({
              email: user.email,
              id:    user._id
            }, process.env.JWT_KEY, {
              expiresIn: "1h"
            });
            return res.status(200).json({
              message: 'Authorization successful',
              token: token,
              expiresIn: 3600,
              role: user.role
            });
          }
          //return res.status(401).json({message: 'Authorization failed'});
          return res.status(401).json({message: 'Invalid authentication credentials'});
        })
    })
    .catch(err => {res.status(500).json({error: err.message});});
}

exports.getOne = (req, res, next) => {
    User.findById(req.params.id)
        .select('_id email password role rights_profile rights_tables rights_charts rights_global firstName surname image street streetNumber postcode city country purchaseHistory waitingList')
        .exec()
        .then(doc => {
            if (doc) res.status(200).json({user: doc});
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
    User.update({_id: id}, { $set: updateOps })
        .exec()
        .then(result => {res.status(200).json({message: 'User updated'});})
        .catch(err => {res.status(500).json({error: err.message});});
}

exports.deleteOne = (req, res, next) => {
    User.deleteOne({_id: req.params.id})
        .exec()
        .then(result => {res.status(200).json({message: 'User deleted'});})
        .catch(err => {res.status(500).json({error: err.message});});
}
