document.addEventListener('DOMContentLoaded', () => {
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
        tag.classList.add('flex');
        tag.innerHTML = (isVersionNewer(entry.version) ? '<span class="new-label">NEW</span>' : '') + entry.version;
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
    preview.style.display = 'none';
    var entries = localStorage.getItem('github-releases-request');
    entries = JSON.parse(entries);
    entries = entries.entries;

    var entry = entries.filter(e => e.version === version)[0];
    preview.innerHTML = entry.notes;
    preview.style.display = 'block';
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

function isVersionNewer(ver) {
    ver = ver.replaceAll('v', '');
    const versionLength = 8;

    let verWithoutPoints = ver.replaceAll('.', '');
    let currentVerWithoutPoints = currentVersion.replaceAll('.', '');

    for(let i = 0; i < versionLength - verWithoutPoints.length; i++) {
        verWithoutPoints += '0';
    }

    for(let i = 0; i < versionLength - currentVerWithoutPoints.length; i++) {
        currentVerWithoutPoints += '0';
    }

    let parsedVer = parseInt(verWithoutPoints);
    let parsedCurrentVer = parseInt(currentVerWithoutPoints);

    return parsedVer > parsedCurrentVer;
}