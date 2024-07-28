var level = {};

document.addEventListener('DOMContentLoaded', () => {
    loadLevel();
});

function loadLevel() {
    var level = sessionStorage.getItem('level-load');
    if (!level) return;
    window.electronAPI.startLevel(level).then((levelData) => {
        level = levelData;
        console.log(levelData);

        var map = document.getElementById('map');

        var img = new Image();
        console.log(`levels/${level.file}.png`);
        window.electronAPI.loadPath(`levels/${level.file}.png`).then((p) => {
            console.log(p);
            img.src = p;    
        });

        map.appendChild(img);

        document.querySelector("p[data-id='level-number']").innerText = 'Level 0';
        document.querySelector("p[data-id='level']").innerText = level.name;

        document.querySelector('.loading-screen').style.display = 'none';
    });
}