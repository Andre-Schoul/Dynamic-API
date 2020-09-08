
const express   = require('express');
const router    = express.Router();
const checkAuth = require('../middleware/check-auth');

const KlopsController = require('../controllers/klops');

router.route('/')
  .get(KlopsController.getAll)
  .post(checkAuth, KlopsController.createOne)
  .delete(checkAuth, KlopsController.deleteAll);

router.route('/:id')
  .get(KlopsController.getOne)
  .patch(checkAuth, KlopsController.patchOne)
  .delete(checkAuth, KlopsController.deleteOne);

module.exports = router;
module.exports.plural = 'klopse';
