const supportedLanguages = ['de', 'en'];

document.addEventListener("DOMContentLoaded", () => {
    hideTaskbarOnFullscreen();
    loadI18n();
})

function hideTaskbarOnFullscreen() {
    if (localStorage.getItem('fullscreenMode') === 'true') {
        document.getElementById('titlebar').style.display = 'none';
    } else {
        document.getElementById('titlebar').style.display = 'flex';
    }
    window.electronAPI.getInformation().then((cb) => {
        localStorage.setItem('fullscreenMode', cb.fullscreen ?? false);
    });
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