const express   = require('express');
//const router    = express.Router();
const router    = express.Router({ mergeParams : true });
const checkAuth = require('../middleware/check-auth');

const DatabaseController = require('../controllers/database');

router.route('/')
    .get(checkAuth, DatabaseController.getAll)
    .post(checkAuth, DatabaseController.createOne);

router.route('/:id')
    .get(checkAuth, DatabaseController.getOne)
    .patch(checkAuth, DatabaseController.patchOne)
    .delete(checkAuth, DatabaseController.deleteOne);

module.exports = router;
