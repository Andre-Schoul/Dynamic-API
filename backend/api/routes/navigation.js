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

const NavigationController = require('../controllers/navigation');

router.route('/')
    .get(checkAuth,  NavigationController.links_getAll)
    .post(checkAuth, NavigationController.navigation_createLink);

router.route('/:id')
    .get(checkAuth, NavigationController.navigation_getLink)
    .patch(checkAuth, NavigationController.navigation_patchLink)
    .delete(checkAuth, NavigationController.navigation_deleteLink);

module.exports = router;