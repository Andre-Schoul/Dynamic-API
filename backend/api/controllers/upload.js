/**
 *
 * @author André Schoul
 * @file controller for uploads
 *
 */

const fs   = require('fs');
const path = require('path');

exports.getAll = (req, res, next) => {
    let route = __dirname + '/../../uploads/' + req.path;
    fs.readdir(route, (errDir, files) => {
        if (errDir) {
            fs.readFile(route, (errFile, file) => {
                if (errFile) res.status(404).json({message: 'Directory or File doesn\'t exist'});
                else res.status(200).json({file: path.basename(route)});
            });
        } else res.status(200).json({files: files});
    });
}

exports.createMany = (req, res, next) => {
    res.status(201).json({message: 'Created file(s)'});
}

exports.patchOne = (req, res, next) => {
    let route = __dirname + '/../../uploads' + req.path;
    fs.rename(route, route.replace(req.params.id, '') + req.query.name, (err) => {
        if (err) res.status(404).json({message: 'Directory or File doesn\'t exist'});
        else res.status(200).json({message: 'Directory or File renamed'});
    });
}

exports.deleteOne = (req, res, next) => {
    fs.unlink(__dirname + '/../../uploads' + req.path, (err) => {
        if (err) res.status(404).json({message: 'Directory or File doesn\'t exist'});
        else res.status(200).json({message: 'Directory or File deleted'});
    });
}