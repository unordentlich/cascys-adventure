let settings;
const githubRepoUrl = "https://api.github.com/repos/unordentlich/cascys-adventure";

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

    document.getElementById("star-amount").innerText = loadGitHubStarCount();
    document.getElementById("btn-exit").addEventListener("click", () => {window.electronAPI.switchPage('views/main_menu.html');});
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