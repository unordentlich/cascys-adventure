var level = {};
var x = 0, y = 0, stepSize = 5;

document.addEventListener('DOMContentLoaded', () => {
    loadLevel();
});

const movementKeys = ['w', 'a', 's', 'd', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];
document.addEventListener('keydown', (e) => {
    console.log(e.key);
    if (!movementKeys.includes(e.key)) return;
    if (e.key === 'w' || e.key === 'ArrowUp') {
        y -= 1;
    } else if (e.key === 's' || e.key === 'ArrowDown') {
        y += 1;
    } else if (e.key === 'd' || e.key === 'ArrowRight') {
        x += 1;
    } else if (e.key === 'a' || e.key === 'ArrowLeft') {
        x -= 1;
    }

    let player = document.getElementById('player');
    player.style.transform = `translate(${x * stepSize}px, ${y * stepSize}px)`;
    player.style.transition = 'transform 0.2s linear';
    player.setAttribute('state', 'moving');
});

document.addEventListener('keyup', (e) => {
    if (!movementKeys.includes(e.key)) return;
    let player = document.getElementById('player');
    player.setAttribute('state', 'idle');
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