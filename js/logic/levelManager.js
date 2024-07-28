const { app, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const levels = [];

ipcMain.handle('level-list', (extended = false) => {
    return levels;
});

ipcMain.handle('level-start', async (event, file) => {
    return await startLevel(file);
});

function loadLevels() {
    var dirname = path.join(app.getPath('userData'), 'levels');
    fs.readdir(dirname, function (err, filenames) {
        if (err) {
            return;
        }

        var id = 1;
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
                    file: filename.replace('.json', ''),
                    translation: json.translation,
                    creation: json.creation,
                    filesPresent: filenames.includes(filename.replace('.json', '.png'))
                });
            });
            id++;
        });
    });
}

async function startLevel(file) {
    var level = levels.find(l => l.file === file);
    if (!level) return;

    var dirname = path.join(app.getPath('userData'), 'levels');
    var filename = path.join(dirname, level.file + '.json');

    try {
        var content = await fs.promises.readFile(filename, 'utf-8');
        var json = JSON.parse(content);
        var levelData = {
            name: json.name,
            translation: json.translation,
            creation: json.creation,
            file: level.file.replace('.json', ''),
        };
        return levelData;
    } catch (err) {
        console.error(err);
        return;
    }
}

module.exports.loadLevels = loadLevels;
module.exports.startLevel = startLevel;