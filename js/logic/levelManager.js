const { app } = require('electron');
const fs = require('fs');
const path = require('path');
const levels = [];

function loadLevels() {
    var dirname = path.join(app.getPath('userData'), 'levels');
    fs.readdir(dirname, function (err, filenames) {
        if (err) {
            return;
        }
        console.log(filenames);
        filenames.forEach(function (filename) {
            if (!filename.endsWith('.txt')) return;
            fs.readFile(path.join(dirname, filename), 'utf-8', function (err, content) {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(filename, content);
            });
        });
    });
}

module.exports.loadLevels = loadLevels;