document.addEventListener("DOMContentLoaded", () => {
    let inputs = document.querySelectorAll("input[key]");
    for (let i = 0; i < inputs.length; i++) {
        let element = inputs[i];

        if (!element.hasAttribute("key")) return;
        element.addEventListener("change", () => {
            saveSetting(element.getAttribute("key"), element.value);
            console.log("Setting %s has changed to %s", element.getAttribute("key"), element.value);
        });
    }
})

function saveSetting(key, value) {
    let settingsFile = {};
    window.electronAPI.loadFile('settings.json').then((f) => {
        settingsFile = f;
        try {
            settingsFile = JSON.parse(settingsFile);
        } catch(e) {
            settingsFile = {};
        }

        console.log(f);

        const keys = key.split('.');
        let current = settingsFile;

        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) {
                current[keys[i]] = {};
            }
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;

        console.log(settingsFile);
        window.electronAPI.saveFile('settings.json', JSON.stringify(settingsFile));
    });
}