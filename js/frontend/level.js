var level = {};
var x = 0, y = 0, stepSize = 7, viewBorder = 50;
let player;

document.addEventListener('DOMContentLoaded', () => {
    loadLevel();
    player = document.getElementById('player');

    const movementKeys = ['w', 'a', 's', 'd', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];
    document.addEventListener('keydown', (e) => {
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

        player.style.transform = `translate(${x * stepSize}px, ${y * stepSize}px)`;
        player.style.transition = 'transform 0.2s linear';
        player.setAttribute('state', 'moving');

        checkBorders();
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

function checkBorders() {
    var location = player.getBoundingClientRect();
    var viewArea = document.getElementById('map').getBoundingClientRect();
    var map = document.getElementById('map-bg').getBoundingClientRect();

    console.log(map.x, map.y)
    if (location.x < viewBorder) {
        console.log('border hit');
        scroll('x', -1);
    } else if(location.x + location.width > viewArea.width - viewBorder) {
        console.log('border right hit');
        scroll('x', 1);
    } else if (location.y < viewBorder) {
        console.log('border hit');
    } else if(location.y + location.height > viewArea.height - viewBorder) {
        console.log('border hit');
    }

    function scroll(axis = 'x', direction = 1) {
        if(axis === 'x') {
            if((direction === 1 && map.x - stepSize > 0) || (direction === -1 && map.x + map.width < viewArea.width)) {
                document.getElementById('map-bg').style.transform = `translate(${viewArea.width - map.width}px, ${map.y}px)`;
                //todo
            } else {
                document.getElementById('map-bg').style.transform = `translate(${direction === 1 ? map.x - map.width : map.x + map.width}px, ${map.y}px)`;
                x = 0;
                player.style.transform = `translate(${x * stepSize}px, ${y * stepSize}px)`;
            }
        }
    }
}