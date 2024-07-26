const supportedLanguages = ['de', 'en'];
let settings;
let soundLock = false;
let currentVersion = localStorage.getItem('version');
const githubRepoUrl = "https://api.github.com/repos/unordentlich/streamchat";

document.addEventListener("DOMContentLoaded", () => {
    loadSettingsFromFile();
    getInformationFromController();
    hideTaskbarOnFullscreen();
    loadI18n();

    let buttons = document.getElementsByTagName('button');
    for(let i=0; i < buttons.length; i++) {
        buttons[i].addEventListener('mouseover', () => {
            if(soundLock) return;
            playSoundEffect('button_hover');
            soundLock = true;
        });
        buttons[i].addEventListener('mouseleave', () => {
            soundLock = false;
        })
    }
})

window.addEventListener("load", () => {
    var isMenuPage = window.location !== 'main_menu.html' && window.location !== 'intro/logo.html' && window.location !== 'changelog.html';
    if(!isMenuPage) return;
    loadGitHubChangelog();
})

function hideTaskbarOnFullscreen() {
    if (localStorage.getItem('fullscreenMode') === 'true') {
        document.getElementById('titlebar').style.display = 'none';
    } else {
        document.getElementById('titlebar').style.display = 'flex';
    }
}

function getInformationFromController() {
    window.electronAPI.getInformation().then((cb) => {
        localStorage.setItem('fullscreenMode', cb.fullscreen ?? false);
        localStorage.setItem('version', cb.version ?? '1.0.0');
    });

    currentVersion = localStorage.getItem('version');
}

function getSupportedLanguages() {
    const languageNames = new Intl.DisplayNames(['en'], {
        type: 'language'
    });
    var list = [];
    for (let i = 0; i < supportedLanguages.length; i++) {
        let lang = supportedLanguages[i];
        try {
            lang = JSON.parse(lang);
            if (!lang.code || !lang.displayName) return;
            list.push(lang);
        } catch {
            list.push({
                code: lang,
                displayName: languageNames.of(lang)
            });
        }
    }
    return list;
}

function loadI18n() {
    if (!localStorage.getItem('i18n') || localStorage.getItem('i18n') === '{}') return;
    let translationElements = document.querySelectorAll("*[i18n]");
    for (let i = 0; i < translationElements.length; i++) {
        let element = translationElements[i];
        let i18nKey = element.getAttribute('i18n');

        var translation = getJsonProperty(localStorage.getItem('i18n'), i18nKey);
        if (translation) {
            element.innerText = translation;
        }
    }
}

function getJsonProperty(json, key) {
    try {
        json = JSON.parse(json);
    } catch {
        return;
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

function loadGitHubChangelog() {
    if (localStorage.getItem("github-releases-request")) {
        let info = JSON.parse(localStorage.getItem("github-releases-request"));
        if (info.lastFetch + 60000 > Date.now()) return info;
    }
    var xhr = new XMLHttpRequest();
    xhr.open("GET", githubRepoUrl + "/releases", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);

            var storage = {};
            var array = [];
            for (let i = 0; i < json.length; i++) {
                const release = json[i];
                if (release['tag_name'] && release['body']) {
                    array.push({
                        version: release['tag_name'],
                        notes: release['body'],
                        date: release['published_at']
                    });
                }
            }
            storage.lastFetch = Date.now();
            storage.entries = array;
            localStorage.setItem("github-releases-request", JSON.stringify(storage));
            return array;
        }
    };
    xhr.send();
    return [];
}

function loadSettingsFromFile() {
    window.electronAPI.loadFile('settings.json').then((f) => {
        settings = f;
        try {
            settings = JSON.parse(settings);
        } catch (e) {
            settings = {};
        }
    });
}

function getSetting(key, fallback) {
    const keys = key.split('.');
    let current = settings;
    console.log(settings);

    for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
            current[keys[i]] = {};
        }
        current = current[keys[i]];
    }
    return current[keys[keys.length - 1]];
}

