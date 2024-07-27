function saveDraftToFile() {
    const f = {
        height: project.height,
        width: project.width,
        pixelSize: project.pixelSize,
        metadata: {
            name: project.name,
            draft: true,
            created: Date.now(),
            lastUpdated: Date.now(),
            appVersion: currentVersion
        },
        chunks: project.chunks,
        collisions: project.collisions
    };
    if(project.translationKey) f.metadata.translationKey = project.translationKey;

    window.electronAPI.requestLocationSave(JSON.stringify(f, null, 2)).then(async (result) => {
        setTimeout(() => {
            console.log(result);
            if(!result.success) {
                alert('Something went wrong! Please try it again!')
            }
        }, 500);
    });
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
            document.getElementById('context').style.display = 'none';
            document.removeEventListener('click', contextListener);
        });
        li.innerText = recentProjects[i].split('/').slice(-1)[0];
        contextUl.appendChild(li);
    }

    contextMenu.style.display = 'block';
    contextMenu.style.left = x - contextUl.getBoundingClientRect().width + 'px';
    contextMenu.style.top = y - contextUl.getBoundingClientRect().height - 40 + 'px';
    document.addEventListener('click', contextListener);
}

const contextListener = (event) => {
    console.log('ring ring bananaphone');
    if(event.target.id !== 'context') {
        document.getElementById('context').style.display = 'none';
        document.removeEventListener('click', contextListener);
    }
}