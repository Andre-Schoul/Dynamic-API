/**
 *
 * @author André Schoul
 * @file route for products
 *
 * ===============================================================
 * ---------------------- supported methods ----------------------
 * ===============================================================
 *  GET http://localhost:3000/products
 *  - gets all products from database
 *
 *  GET http://localhost:3000/products/:id
 *  - gets one product from database if it exists
 *
 *  POST http://localhost:3000/products
 *  - creates a new product in the database
 *
 *  Patch http://localhost:3000/products/:id
 *  - updates field(s) of one product in the database if it exists
 *
 *  DELETE http://localhost:3000/products/:id
 *  - deletes one product from database if it exists
 * ===============================================================
 *
 */

const express   = require('express');
const router    = express.Router();
const checkAuth = require('../middleware/check-auth');

const StorageController = require('../controllers/storage');

router.route('/')
    .get(checkAuth, StorageController.getAll)
    .post(checkAuth, StorageController.createOne);

router.route('/:id')
    .get(checkAuth, StorageController.getOne)
    .patch(checkAuth, StorageController.patchOne)
    .delete(checkAuth, StorageController.deleteOne);

module.exports = router;