
const express   = require('express');
const router    = express.Router();
const checkAuth = require('../middleware/check-auth');

const KrakeController = require('../controllers/krake');

router.route('/')
  .get(KrakeController.getAll)
  .post(checkAuth, KrakeController.createOne)
  .delete(checkAuth, KrakeController.deleteAll);

router.route('/:id')
  .get(KrakeController.getOne)
  .patch(checkAuth, KrakeController.patchOne)
  .delete(checkAuth, KrakeController.deleteOne);

module.exports = router;
module.exports.plural = 'krakes';
