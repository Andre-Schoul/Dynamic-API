/**
 *
 * @author André Schoul
 * @file route for manufacturers
 *
 * ===============================================================
 * ---------------------- supported methods ----------------------
 * ===============================================================
 *  GET http://localhost:3000/manufacturers
 *  - gets all manufacturers from database
 *
 *  GET http://localhost:3000/manufacturers/:id
 *  - gets one manufacturer from database if it exists
 *
 *  POST http://localhost:3000/manufacturers
 *  - creates a new manufacturer in the database
 *
 *  Patch http://localhost:3000/manufacturers/:id
 *  - updates field(s) of one manufacturer in the database if it exists
 *
 *  DELETE http://localhost:3000/manufacturers/:id
 *  - deletes one manufacturer from database if it exists
 * ===============================================================
 *
 */

const express   = require('express');
const router    = express.Router();
const checkAuth = require('../middleware/check-auth');

const ManufacturerController = require('../controllers/manufacturer');

router.route('/')
    .get(checkAuth, ManufacturerController.getAll)
    .post(checkAuth, ManufacturerController.createOne);

router.route('/:id')
    .get(checkAuth, ManufacturerController.getOne)
    .patch(checkAuth, ManufacturerController.patchOne)
    .delete(checkAuth, ManufacturerController.deleteOne);

module.exports = router;