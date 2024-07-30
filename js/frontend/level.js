var level = {};
var x = 0, y = 0, stepSize = 7, viewBorder = 50;
var mapX = 0, mapY = 0;
let player;

document.addEventListener('DOMContentLoaded', () => {
    loadLevel();
    player = document.getElementById('player');

    const movementKeys = ['w', 'a', 's', 'd', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];
    document.addEventListener('keydown', (e) => {
        if (!movementKeys.includes(e.key)) return;

        var direction = 0;
        if (e.key === 'w' || e.key === 'ArrowUp') {
            y -= stepSize;
            direction = 1;
        } else if (e.key === 's' || e.key === 'ArrowDown') {
            y += stepSize;
            direction = -1;
        } else if (e.key === 'd' || e.key === 'ArrowRight') {
            x += stepSize;
            direction = 1;
        } else if (e.key === 'a' || e.key === 'ArrowLeft') {
            x -= stepSize;
            direction = -1;
        }

        player.style.transform = `translate(${x}px, ${y}px)`;
        player.style.transition = 'transform 0.2s linear';
        player.setAttribute('state', 'moving');

        checkBorders(direction);
    });

    document.addEventListener('keyup', (e) => {
        if (!movementKeys.includes(e.key)) return;
        let player = document.getElementById('player');
        player.setAttribute('state', 'idle');
    });
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
        img.id = 'map-bg';
        window.electronAPI.loadPath(`levels/${level.file}.png`).then((p) => {
            img.src = p;
        });

        map.appendChild(img);

        document.querySelector("p[data-id='level-number']").innerText = 'Level 0';
        document.querySelector("p[data-id='level']").innerText = level.name;

        document.querySelector('.loading-screen').style.display = 'none';
    });
}

function checkBorders(direction) {
    var playerLoc = player.getBoundingClientRect();
    var viewArea = document.getElementById('map').getBoundingClientRect();
    var map = document.getElementById('map-bg').getBoundingClientRect();

    scroll(direction);

    function scroll(direction = 0) {
        var m = document.getElementById('map-bg');
        const mapToPlayerRatio = map.width / viewArea.width;

        mapX += (direction === 1 ? stepSize : -stepSize) * mapToPlayerRatio;
        mapY += stepSize * 2; // do same for height
        console.log(mapX);

        m.style.transform = `translate(-${mapX}px, -${0}px)`;
        m.style.transition = 'transform 0.2s linear';
    }
}