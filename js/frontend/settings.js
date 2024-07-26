document.addEventListener("DOMContentLoaded", () => {
    loadSettings();
    switchTab('performance');

    let select = document.querySelector('select[key="general.language"]');
    let languages = getSupportedLanguages();
    languages.forEach((lang) => {
        let option = document.createElement('option');
        option.value = lang.code;
        option.innerText = lang.displayName;
        select.appendChild(option);
    })

    let inputs = document.querySelectorAll("input[key], select[key]");
    for (let i = 0; i < inputs.length; i++) {
        let element = inputs[i];

        if (!element.hasAttribute("key")) return;
        element.addEventListener("change", () => {
            var val = element.type === 'checkbox' ? element.checked : element.value;
            saveSetting(element.getAttribute("key"), val);

            if (element.hasAttribute("liveUpdate")) {
                liveUpdate(element.getAttribute("key"), val);
            }
            console.log("Setting %s has changed to %s", element.getAttribute("key"), val);
        });
    }

    document.getElementById("star-amount").innerText = loadGitHubStarCount();
    document.getElementById("version").innerText = currentVersion;
    document.getElementById("btn-exit").addEventListener("click", () => { window.electronAPI.switchPage('views/main_menu.html'); });
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

        const inputList = document.querySelectorAll("input[key], select[key]");
        for (let i = 0; i < inputList.length; i++) {
            const element = inputList[i];
            if (!element.hasAttribute("key")) return;

            var value = getSetting(element.getAttribute("key"));
            if (value) {
                if (element.type === 'checkbox') {
                    element.checked = value;
                } else {
                    element.value = value;
                }
            }
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

function loadGitHubStarCount() {
    if (localStorage.getItem("github-request")) {
        let info = JSON.parse(localStorage.getItem("github-request"));
        if (info.lastFetch + 1800000 > Date.now()) return info.stars;
    }
    var xhr = new XMLHttpRequest();
    xhr.open("GET", githubRepoUrl, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            if (json["stargazers_count"]) {
                localStorage.setItem("github-request", JSON.stringify({
                    lastFetch: Date.now(),
                    stars: json["stargazers_count"]
                }));
                return json["stargazers_count"];
            }
        }
    };
    xhr.send();
    return 0;
}

function liveUpdate(key, newValue) {
    console.log(key, newValue);
    switch (key) {
        case 'performance.window_mode':
            if (newValue === '2') {
                window.electronAPI.toggleFullscreen(true);
                document.getElementById('titlebar').style.display = 'none';
            } else if (newValue === '1') {
                window.electronAPI.toggleFullscreen(false);
                document.getElementById('titlebar').style.display = 'flex';
            }
            break;
        case 'general.language':
            window.electronAPI.reloadI18n();
            break;
        case 'general.discord_rpc':
            window.electronAPI.settingsLiveUpdate(key, newValue);
            break;
    }
}

window.addEventListener('storage', (e) => {
    if (e.key === 'i18n') {
        loadI18n();
    }
})