const { app, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const levels = [];

ipcMain.handle('level-list', (extended = false) => {
    return levels;
})

function loadLevels() {
    var dirname = path.join(app.getPath('userData'), 'levels');
    fs.readdir(dirname, function (err, filenames) {
        if (err) {
            return;
        }
        filenames.forEach(function (filename) {
            if (!filename.endsWith('.json')) return;
            fs.readFile(path.join(dirname, filename), 'utf-8', function (err, content) {
                if (err) {
                    console.error(err);
                    return;
                }

                var json = JSON.parse(content);
                levels.push({
                    name: json.name,
                    translation: json.translation,
                    creation: json.creation
                });
            });
        });
    });
}

module.exports.loadLevels = loadLevels;