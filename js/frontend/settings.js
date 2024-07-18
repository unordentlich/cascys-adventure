let settings;

document.addEventListener("DOMContentLoaded", () => {
    loadSettings();
    switchTab('performance');
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

function getSetting(key) {
    const keys = key.split('.');
    let current = settings;

    for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
            current[keys[i]] = {};
        }
        current = current[keys[i]];
    }
    return current[keys[keys.length - 1]];
}

function saveSetting(key, value) {
    const keys = key.split('.');
    let current = settings;

    for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
            current[keys[i]] = {};
        }
        current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;

    window.electronAPI.saveFile('settings.json', JSON.stringify(settings));
}

function loadSettings() {
    window.electronAPI.loadFile('settings.json').then((f) => {
        settings = f;
        try {
            settings = JSON.parse(settings);
        } catch (e) {
            settings = {};
        }

        const inputList = document.querySelectorAll("input[key]");
        for (let i = 0; i < inputList.length; i++) {
            const element = inputList[i];
            if (!element.hasAttribute("key")) return;

            var value = getSetting(element.getAttribute("key"));
            if (value) element.value = value;
        }
    });
}

function switchTab(tab) {
    const currentTab = document.querySelector(".setting-list.active");
    const currentTabNavigationElement = document.querySelector(".navigation li.active");
    const targetContainer = document.getElementById(tab);
    const targetNavigationElement = document.querySelector(`.navigation li[key='${tab}']`)
    if (!targetContainer) return;

    if (currentTab && currentTabNavigationElement) {
        if (tab === currentTab.id) return;

        currentTab.classList.remove("active");
        currentTabNavigationElement.classList.remove("active");
    };

    targetContainer.classList.add("active");
    targetNavigationElement.classList.add("active");
}