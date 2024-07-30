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
            direction = 1;
        } else if (e.key === 's' || e.key === 'ArrowDown') {
            direction = -1;
        } else if (e.key === 'd' || e.key === 'ArrowRight') {
            direction = 1;
        } else if (e.key === 'a' || e.key === 'ArrowLeft') {
            direction = -1;
        }

        var borderReached = checkBorders(direction);

        console.log(`x: ${x}, y: ${y}`);
        if (!borderReached) {
            if(e.key === 'w' || e.key === 'ArrowUp') y -= stepSize;
            if(e.key === 'a' || e.key === 'ArrowLeft') x -= stepSize;
            if(e.key === 's' || e.key === 'ArrowDown') y += stepSize;
            if(e.key === 'd' || e.key === 'ArrowRight') x += stepSize;

            player.style.transform = `translate(${x}px, ${y}px)`;
            player.style.transition = 'transform 0.2s linear';
        }
        player.setAttribute('state', 'moving');

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

    const MapToPlayerStepFactor = map.width / viewArea.width;

    if (playerLoc.x < viewArea.width / 2) return false; // The screen should only move if the player is in the middle of the screen
    if (nearInt(map.x * -1 + viewArea.width, map.width, 5)) return false; // The screen should only move if the map is not at the end

    //move the map in the same direction with the same speed as the player
    if (direction === 1) {
        mapX -= stepSize * MapToPlayerStepFactor;
    } else if (direction === -1) {
        mapX += stepSize * MapToPlayerStepFactor;
    }

    document.getElementById('map-bg').style.transform = `translate(${mapX}px, ${mapY}px)`;
    return true;
}

function nearInt(op, target, range) {
    return op < target + range && op > target - range;
}