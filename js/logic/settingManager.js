function getSetting(file, key, fallback) {
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

module.exports.getSetting = getSetting;