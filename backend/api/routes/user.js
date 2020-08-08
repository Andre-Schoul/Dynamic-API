/**
 *
 * @author André Schoul
 * @file route for user
 *
 * ===============================================================
 * ---------------------- supported methods ----------------------
 * ===============================================================
 *  GET http://localhost:3000/users
 *  - gets all user from database
 *
 *  GET http://localhost:3000/users/:id
 *  - gets one user from database if it exists
 *
 *  POST http://localhost:3000/users/signup
 *  - creates a new user in the database
 *
 *  POST http://localhost:3000/users/login
 *  - logs a user in if he was already registered
 *
 *  Patch http://localhost:3000/users/:id
 *  - updates field(s) of one user in the database if he exists
 *
 *  DELETE: http://localhost:3000/users/:id
 *  - deletes one user from database if he exists
 * ===============================================================
 *
 */

const express  = require('express');
const router   = express.Router();
const checkAuth = require('../middleware/check-auth');

const UserController = require('../controllers/user');

router.get('/', /*checkAuth,*/ UserController.getAll);

router.post('/signup', UserController.signup);

router.post('/login', UserController.login);

router.route('/:id')
    .get(checkAuth, UserController.getOne)
    .patch(checkAuth, UserController.patchOne)
    .delete(checkAuth, UserController.deleteOne);

module.exports = router;
