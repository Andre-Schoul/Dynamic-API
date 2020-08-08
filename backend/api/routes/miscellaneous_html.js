/**
 *
 * @author André Schoul
 * @file route for product variants
 *
 * ===============================================================
 * ---------------------- supported methods ----------------------
 * ===============================================================
 *  GET http://localhost:3000/productVariants
 *  - gets all productVariants from database
 *
 *  GET http://localhost:3000/productVariants/:id
 *  - gets one productVariant from database if it exists
 *
 *  POST http://localhost:3000/productVariants
 *  - creates a new productVariant in the database
 *
 *  Patch http://localhost:3000/productVariants/:id
 *  - updates field(s) of one productVariant in the database if it exists
 *
 *  DELETE http://localhost:3000/productVariants/:id
 *  - deletes one productVariant from database if it exists
 * ===============================================================
 *
 */

const express   = require('express');
const router    = express.Router();
const checkAuth = require('../middleware/check-auth');

const MiscellaneousHTML_Controller = require('../controllers/miscellaneous_html');

router.route('/')
    .get(checkAuth,  MiscellaneousHTML_Controller.getAll)
    .post(checkAuth, MiscellaneousHTML_Controller.createOne);

router.route('/:id')
    .get(checkAuth, MiscellaneousHTML_Controller.getOne)
    .patch(checkAuth, MiscellaneousHTML_Controller.patchOne)
    .delete(checkAuth, MiscellaneousHTML_Controller.deleteOne);

module.exports = router;