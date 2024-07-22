function saveDraftToFile(path) {
    const f = {
        metadata: {
            name: 'Test project',
            draft: true,
            created: Date.now(),
            lastUpdated: Date.now(),
            appVersion: currentVersion
        },
        chunks: elements
    };

    window.electronAPI.saveGlobalFile(path[0] + '/cca-project.json', JSON.stringify(f, null, 2));
}

function loadDraftFromFile() {
    window.electronAPI.requestFile().then((file) => {
        console.log(file);
    })
}