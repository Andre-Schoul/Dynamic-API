
const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const ProjectController = require('../controllers/project');

router.route('/')
  .get(checkAuth, ProjectController.getAll)
  .post(checkAuth, ProjectController.createOne)
  .delete(checkAuth, ProjectController.deleteAll);

router.route('/:id')
  .get(checkAuth, ProjectController.getOne)
  .patch(checkAuth, ProjectController.patchOne)
  .delete(checkAuth, ProjectController.deleteOne);

module.exports = router;
module.exports.plural = 'projects';
