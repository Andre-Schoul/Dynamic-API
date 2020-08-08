/**
 *
 * @author André Schoul
 * @file route for height charts
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

const LanguageController = require('../controllers/language');

router.route('/')
    .get(LanguageController.getAll)
    .post(checkAuth, LanguageController.createOne)
    .delete(checkAuth, LanguageController.deleteAll);

router.route('/:id')
    .get(LanguageController.getOne)
    .patch(checkAuth, LanguageController.patchOne)
    .delete(checkAuth, LanguageController.deleteOne);

module.exports = router;
