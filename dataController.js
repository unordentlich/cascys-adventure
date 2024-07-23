const path = require('node:path')
const fs = require('fs');
const { app } = require('electron');

const filesRequireCaching = ['settings.json'];
const cachedFiles = new Map();


async function getSetting(key, fallback) {
    let file = await cachedFiles.get('settings.json') || {};
    let json;
    try {
        json = JSON.parse(file);
    } catch {
        return fallback ?? null;
    }
    const keys = key.split('.');
    let current = json;

    for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
            current[keys[i]] = {};
        }
        current = current[keys[i]];
    }
    return current[keys[keys.length - 1]];
}

async function preCacheFiles() {
    return new Promise(async (resolve, reject) => {
        filesRequireCaching.forEach(async item => {
            let file = await loadFile(null, item);
            if (!file) return;

            cachedFiles.set(item, file);
        });
        resolve();
    });
}

async function loadFile(event, p, fromRoot) {
    if (cachedFiles.has(p)) return cachedFiles.get(p);
    const filePath = path.join(app.getPath('userData'), p);
    let file = await fs.promises.readFile((fromRoot ? p : filePath), 'utf-8');
    return file;
}


function saveFile(event, p, file) {
    console.log('Save file in ' + p);
    if (cachedFiles.has(p)) cachedFiles.set(p, file);
    const filePath = path.join(app.getPath('userData'), p);
    fs.writeFileSync(filePath, file);
}

exports.getSetting = getSetting;
exports.preCacheFiles = preCacheFiles;
exports.loadFile = loadFile;
exports.saveFile = saveFile;