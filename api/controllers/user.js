
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const User     = require('../models/user');

const Project = require('../models/project');

const controller = require('./template/controller');

exports.getAll = (req, res, next) => {
  controller.getAll(req, res, next, User, {
    modelName: 'users',
    selectValues: 'email password tariff image firstName surname street streetNumber postcode city country',
    populateQuery: ''
  }, (headers, docs) => {
      headers.pop();
      return {
          count: docs.length,
          headers: headers
      };
  });
};

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

exports.login = (req, res, next) => {
  User.findOne({email: req.body.email})
    .then(user => {
      if (!user) {
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
          return res.status(401).json({message: 'Invalid authentication credentials'});
        })
    })
    .catch(err => {res.status(500).json({error: err.message});});
}

exports.getOne = (req, res, next) => {
  controller.getOne(req, res, next, User, {
    selectValues: 'email password tariff image firstName surname street streetNumber postcode city country',
    populateQuery: ''
  });
}

exports.patchOne = (req, res, next) => {
  controller.patchOne(req, res, next, User, {
      modelName: 'user'
  });
}

exports.deleteOne = (req, res, next) => {
  controller.deleteOne(req, res, next, User, {
      modelName: 'user'
  });
}
