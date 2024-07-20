const fs = require('fs');
const path = require("path");

async function loadI18NFile(language) {
    return new Promise(async (resolve, reject) => {
        const filePath = path.join(path.resolve('./'), 'assets', 'i18n', '%lang%.json');
        let file;
        try {
            file = await fs.promises.readFile(filePath.replace('%lang%', language), 'utf-8');
            if (!file) {
                file = await fs.promises.readFile(filePath.replace('%lang%', 'en'), 'utf-8')
            }
        } catch { }
        resolve(file);
    });
}

module.exports.loadI18NFile = loadI18NFile;