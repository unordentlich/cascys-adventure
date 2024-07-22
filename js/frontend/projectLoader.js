function saveDraftToFile(path) {
    const f = {
        height: project.height,
        width: project.width,
        pixelSize: pixelSize,
        metadata: {
            name: 'Test project',
            draft: true,
            created: Date.now(),
            lastUpdated: Date.now(),
            appVersion: currentVersion
        },
        chunks: project.chunks
    };

    window.electronAPI.saveGlobalFile(path[0] + '/cca-project.json', JSON.stringify(f, null, 2));
}

function loadDraftFromFile() {
    var recentProjects = localStorage.getItem('recent-draft-projects') || [];
    if(recentProjects.length >= 5) recentProjects.slice(0,4);
    window.electronAPI.requestFile().then((file) => {
        console.log(file.content);
        if(!recentProjects.includes(file.path)) recentProjects.push(file.path);
    })
}