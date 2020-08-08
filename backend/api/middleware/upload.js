/*
const multer     = require('multer');
const storage    = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename:    function(req, file, cb) {
        cb(null, file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    // reject a file
    console.log(file);
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        console.log('accepted');
        cb(null, true);
    }
    else {
        console.log(file.mimeType);
        cb(null, false);
    }
};
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

module.exports = (req, res, next) => {
    upload.single('image'); // ???
};*/


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
const multer  = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        let folder = file.originalname.toLowerCase().split('_')[0];
        let fileName = file.originalname.toLowerCase().split('_')[1].replace('paigh-', '');
        ensureExists(__dirname + '/../../uploads/products/images/' + folder, 484, function (errCategory) {
            if (errCategory) res.status(500).json({message: 'Coudln\'t create directory'});
            else {
                ensureExists(__dirname + '/../../uploads/products/images/' + folder + '/' + fileName.replace(path.extname(fileName), ''), 484, function (errProdcut) {
                    if (errProdcut) res.status(500).json({message: 'Coudln\'t create directory'});
                    else {
                        if (!file.originalname.toLowerCase().split('_')[2]) cb(null, './uploads/products/images/' + folder + '/' + fileName.replace(path.extname(fileName), ''));
                        else ensureExists(__dirname + '/../../uploads/products/images/' + folder + '/' + fileName.replace(path.extname(fileName), '') + '/additionalImages', 484, function (errAdditional) {
                            if (errAdditional) res.status(500).json({message: 'Coudln\'t create directory'});
                            else cb(null, './uploads/products/images/' + folder + '/' + fileName.replace(path.extname(fileName), '') + '/additionalImages');
                        });
                    }
                });
            }
        });
    },
    filename: function(req, file, cb) {
        if (!file.originalname.toLowerCase().split('_')[2]) cb(null, file.originalname.toLowerCase().split('_')[1]);
        else cb(null, file.originalname.toLowerCase().split('_')[1] + '-' + file.originalname.toLowerCase().split('_')[2]);
    }
});
const fileFilter = (req, file, cb) => {
    // Accept / Reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') cb(null, true);
    else cb(null, false);
};

let upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

module.exports.upload = upload;