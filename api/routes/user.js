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
