const githubRepoUrl = "https://api.github.com/repos/unordentlich/streamchat";

document.addEventListener('DOMContentLoaded', () => {
    var json = loadGitHubChangelog();
    const container = document.getElementById('changelog-container');
    for (let i = 0; i < json.entries.length; i++) {
        const entry = json.entries[i]
        var e = document.createElement('div');
        e.classList.add('entry');
        e.innerHTML = entry.notes;
        container.appendChild(e);
    }
})

function loadGitHubChangelog() {
    if (localStorage.getItem("github-releases-request")) {
        let info = JSON.parse(localStorage.getItem("github-releases-request"));
        if (info.lastFetch + 60000 > Date.now()) return info;
    }
    var xhr = new XMLHttpRequest();
    xhr.open("GET", githubRepoUrl + "/releases?per_page=3", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);

            var storage = {};
            var array = [];
            for (let i = 0; i < json.length; i++) {
                const release = json[i];
                console.log(release);
                console.log('release found', (release['tag_name'] && release['body']))
                if (release['tag_name'] && release['body']) {
                    array.push({
                        version: release['tag_name'],
                        notes: release['body']
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
