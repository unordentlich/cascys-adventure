function saveDraftToFile(path) {
    const f = {
        height: project.height,
        width: project.width,
        pixelSize: project.pixelSize,
        metadata: {
            name: 'Test project',
            draft: true,
            created: Date.now(),
            lastUpdated: Date.now(),
            appVersion: currentVersion
        },
        chunks: project.chunks,
        collisions: project.collisions
    };

    window.electronAPI.saveGlobalFile(path[0] + '/cca-project.json', JSON.stringify(f, null, 2));
}

function requestDraftFromFile() {
    var recentProjects = localStorage.getItem('recent-draft-projects') ? JSON.parse(localStorage.getItem('recent-draft-projects')) : [];
    if (recentProjects.length >= 5) recentProjects.slice(0, 4);
    window.electronAPI.requestFile().then((file) => {
        if (!recentProjects.includes(file.path)) {
            recentProjects.unshift(file.path);
        } else {
            recentProjects.unshift(recentProjects.splice(recentProjects.indexOf(file.path), 1)[0]);
        }
        localStorage.setItem('recent-draft-projects', JSON.stringify(recentProjects));

        loadProject(file.content);
    })
}

function loadDraftFromFile(path) {
    var recentProjects = localStorage.getItem('recent-draft-projects') ? JSON.parse(localStorage.getItem('recent-draft-projects')) : [];
    if (recentProjects.length >= 5) recentProjects.slice(0, 4);
    window.electronAPI.loadGlobalFile(path).then((file) => {
        if (!recentProjects.includes(file.path)) {
            recentProjects.unshift(file.path);
        } else {
            recentProjects.unshift(recentProjects.splice(recentProjects.indexOf(file.path), 1)[0]);
        }
        localStorage.setItem('recent-draft-projects', JSON.stringify(recentProjects));

        loadProject(file.content);
    })
}

function showRecentsContextMenu(x, y) {
    let contextMenu = document.getElementById('context');
    let contextUl = document.querySelector('#context ul');
    contextUl.innerHTML = '';
    if (!localStorage.getItem('recent-draft-projects')) return;
    var recentProjects = JSON.parse(localStorage.getItem('recent-draft-projects'))

    for (let i = 0; i < recentProjects.length; i++) {
        let li = document.createElement('li');
        li.addEventListener('click', () => {
            loadDraftFromFile(recentProjects[i]);
        });
        li.innerText = recentProjects[i].split('/').slice(-1)[0];
        contextUl.appendChild(li);
    }


    console.log(contextUl.getBoundingClientRect().width, contextUl.getBoundingClientRect().height);
    contextMenu.style.left = x - contextUl.getBoundingClientRect().width + 'px';
    contextMenu.style.top = y - contextUl.getBoundingClientRect().height - 40 + 'px';
    contextMenu.style.display = 'block';
}