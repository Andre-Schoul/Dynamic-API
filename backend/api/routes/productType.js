/**
 *
 * @author André Schoul
 * @file route for oders
 *
 * ===============================================================
 * ---------------------- supported methods ----------------------
 * ===============================================================
 *  GET http://localhost:3000/orders
 *  - gets all orders from database
 *
 *  GET http://localhost:3000/orders/:id
 *  - gets one order from database if it exists
 *
 *  POST http://localhost:3000/orders
 *  - creates a new order in the database
 *
 *  Patch http://localhost:3000/orders/:id
 *  - updates field(s) of one order in the database if it exists
 *
 *  DELETE http://localhost:3000/orders/:id
 *  - deletes one order from database if it exists
 * ===============================================================
 *
 */

const express   = require('express');
const router    = express.Router();
const checkAuth = require('../middleware/check-auth');

const ProductTypeController = require('../controllers/productType');

router.route('/')
    .get(ProductTypeController.getAll)
    .post(checkAuth, ProductTypeController.createOne);

router.route('/:id')
    .get(ProductTypeController.getOne)
    .patch(checkAuth, ProductTypeController.patchOne)
    .delete(checkAuth, ProductTypeController.deleteOne);

module.exports = router;