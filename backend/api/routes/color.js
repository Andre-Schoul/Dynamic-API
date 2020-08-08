/**
 *
 * @author André Schoul
 * @file route for colors <br>
 * <br>
 * =============================================================== <br>
 * ----------------------------------------  supported methods  ----------------------------------------- <br>
 * =============================================================== <br>
 * <br>
 *  GET {@link http://localhost:3000/productVariants} <br>
 *  - gets all productVariants from database <br>
 * <br>
 *  GET http://localhost:3000/productVariants/:id <br>
 *  - gets one productVariant from database if it exists <br>
 * <br>
 *  POST http://localhost:3000/productVariants <br>
 *  - creates a new productVariant in the database <br>
 * <br>
 *  Patch http://localhost:3000/productVariants/:id <br>
 *  - updates field(s) of one productVariant in the database if it exists <br>
 * <br>
 *  DELETE http://localhost:3000/productVariants/:id <br>
 *  - deletes one productVariant from database if it exists <br>
 * <br>
 * =============================================================== <br>
 *
 */

const express   = require('express');
const router    = express.Router();
const checkAuth = require('../middleware/check-auth');

const ColorController = require('../controllers/color');

router.route('/')
    .get(checkAuth, ColorController.getAll)
    .post(checkAuth, ColorController.createOne);

router.route('/:id')
    .get(checkAuth, ColorController.getOne)
    .patch(checkAuth, ColorController.patchOne)
    .delete(checkAuth, ColorController.deleteOne);

module.exports = router;