const Project = require('../models/project');
const controller = require('./template/controller');
const wrapper = require('../middleware/wrapper');
const creation = require('../Creation');

exports.getAll = wrapper(async (req, res, next) => {
  controller.getAll(req, res, next, Project, {
      modelName: 'projects',
      selectValues: 'name contributors',
      populateQuery: ''
  }, (headers, docs) => {
      headers.pop();
      return {
          count: docs.length,
          headers: headers
      };
  });
});

exports.createOne = wrapper(async (req, res, next) => { 
  const entry = await Project.find({name: req.body.name});
  if (entry.length > 0) {
    res.status(422).json({message: 'Project exists already'});
  } else {
    creation.createDirectory(`${__dirname}/../projects/${req.body.name.replace(/\s/g,'_')}`);
    req.body.contributors = req.userData.userID;
    controller.createOne(req, res, next, Project, {
        modelName: 'project',
        body: req.body
    });
  }
});

exports.getOne = (req, res, next) => {
  controller.getOne(req, res, next, Project, {
      selectValues: 'name contributors',
      populateQuery: ''
  });
}

exports.patchOne = (req, res, next) => {
  controller.patchOne(req, res, next, Project, {
      modelName: 'project'
  });
}

exports.deleteOne = (req, res, next) => {
  controller.deleteOne(req, res, next, Project, {
      modelName: 'project'
  });
}

exports.deleteAll = (req, res, next) => {
  controller.deleteAll(req, res, next, Project, {
      modelName: 'project'
  });
}