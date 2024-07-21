
document.addEventListener('DOMContentLoaded', () => {
    /**var json = loadGitHubChangelog();
    const container = document.getElementById('changelog-container');
    for (let i = 0; i < json.entries.length; i++) {
        const entry = json.entries[i]
        var e = document.createElement('div');
        e.classList.add('entry');
        e.innerHTML = entry.notes;
        container.appendChild(e);
    }**/

    visualizeList();
})

function visualizeList() {
    const previewList = document.getElementById('preview-list');
    var entries = localStorage.getItem('github-releases-request');
    entries = JSON.parse(entries);
    entries = entries.entries;

    for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];

        let container = document.createElement('div');
        container.classList.add('entry');
        let flex = document.createElement('div');
        flex.classList.add('flex');
        flex.style.justifyContent = 'space-between';

        let tag = document.createElement('p');
        tag.innerText = entry.version;
        let date = document.createElement('p');
        date.classList.add('sub');
        date.innerText = formatCustomDate(Date.parse(entry.date));

        flex.appendChild(tag);
        flex.appendChild(date);

        let changes = document.createElement('p');
        changes.classList.add('sub');
        changes.classList.add('primary');
        changes.innerText = 'x Changes';

        container.appendChild(flex);
        container.appendChild(changes);
        container.addEventListener('click', () => { openEntry(entry.version) })
        previewList.appendChild(container);
    }
}

function openEntry(version) {
    const preview = document.getElementById('preview');
    var entries = localStorage.getItem('github-releases-request');
    entries = JSON.parse(entries);
    entries = entries.entries;

    var entry = entries.filter(e => e.version === version)[0];
    preview.innerHTML = entry.notes;
}

function formatCustomDate(dateInput) {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
        throw new Error("Invalid date input");
    }

    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    const dayInMillis = 24 * 60 * 60 * 1000;
    const daysDifference = Math.floor((now - date) / dayInMillis);

    if (date.toDateString() === now.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    } else if (daysDifference < 7) {
        return `${daysDifference} days ago`;
    } else {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    }
}