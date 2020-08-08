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
/*
const multer     = require('multer');
const storage    = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/products/images');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    // reject a file
    console.log(file);
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        console.log('file accepted');
        cb(null, true);
    }
    else {
        console.log("DB doesn't accept " + file.mimetype + " mimetypes. Please upload image/jpeg's or image/png's.");
        cb(null, false);
    }
};
const upload  = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});
*/
const fileUpload = require('../middleware/fileUpload');

const ProductController = require('../controllers/product');

router.route('/')
    .get(ProductController.getAll)
    //.post(checkAuth, upload.single('image'), ProductController.createOne)
    .post(checkAuth, fileUpload, ProductController.createOne)
    .delete(checkAuth, ProductController.deleteAll);

router.route('/:id')
    .get(ProductController.getOne)
    .patch(checkAuth, ProductController.patchOne)
    .delete(checkAuth, ProductController.deleteOne);

module.exports = router;
