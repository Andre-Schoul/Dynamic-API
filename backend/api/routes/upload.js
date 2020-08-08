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

const UploadController = require('../controllers/upload');






/*
const path       = require('path');
const fs         = require('fs');



function ensureExists(path, mask, cb) {
    if (typeof mask == 'function') {            // Allow the `mask` parameter to be optional
        cb = mask;
        mask = 484;
    }
    fs.mkdir(path, mask, (err) => {
        if (err) {
            if (err.code == 'EEXIST') cb(null); // Ignore the error if the folder already exists
            else cb(err);                       // Something else went wrong
        } else cb(null);                        // Successfully created folder
    });
}
// upload test
const multer     = require('multer');
const storage    = multer.diskStorage({
    destination: function(req, file, cb) {
        let folder   = file.originalname.toLowerCase().split('_')[0];
        let fileName = file.originalname.toLowerCase().split('_')[1];
        ensureExists(__dirname + '/../../uploads/products/images/' + folder, 484, function(err) {
            if (err) console.log(err);
            else {
                ensureExists(__dirname + '/../../uploads/products/images/' + folder + '/' + fileName.replace(path.extname(fileName), ''), 484, function(err) {
                    if (err) console.log(err);
                    else {
                        cb(null, './uploads/products/images/' + folder + '/' + fileName.replace(path.extname(fileName), ''));
                    }
                });
            }
        });
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname.toLowerCase().split('_')[1]);
    }
});
const fileFilter = (req, file, cb) => {
    // Accept / Reject a file
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') cb(null, true);
    else cb(null, false);
};

let upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})
*/


const upload = require('../middleware/upload');

router.route('/*')
    .get(UploadController.getAll);

router.route('/')
    .post(checkAuth, upload.upload.array('uploadedImages', 30), UploadController.createMany);

router.route('/*/:id')
    .patch(checkAuth, UploadController.patchOne)
    .delete(checkAuth, UploadController.deleteOne);

module.exports = router;