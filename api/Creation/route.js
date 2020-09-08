/**
 * Creates a mongoose route
 * @param {string} name The name of the route
 * @param {JSON} needAuth Boolean to determine if the route needs authentication
 * @returns {string} The route as a string
 */
exports.createRoute = (name, needAuth) => {
  return `
const express   = require('express');
const router    = express.Router();
${needAuth.auth ? `const checkAuth = require('../middleware/check-auth');` : ''}

const ${name.singular}Controller = require('../controllers/${name.singular.toLowerCase()}');

router.route('/')
  .get(${needAuth.getAll ? `checkAuth, ` : ''}${name.singular}Controller.getAll)
  .post(${needAuth.createOne ? `checkAuth, ` : ''}${name.singular}Controller.createOne)
  .delete(${needAuth.deleteAll ? `checkAuth, ` : ''}${name.singular}Controller.deleteAll);

router.route('/:id')
  .get(${needAuth.getOne ? `checkAuth, ` : ''}${name.singular}Controller.getOne)
  .patch(${needAuth.patchOne ? `checkAuth, ` : ''}${name.singular}Controller.patchOne)
  .delete(${needAuth.deleteOne ? `checkAuth, ` : ''}${name.singular}Controller.deleteOne);

module.exports = router;
module.exports.plural = '${name.plural}';
`
};
