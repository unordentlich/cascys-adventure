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
            y -= stepSize;
        } else if (e.key === 's' || e.key === 'ArrowDown') {
            y += stepSize;
        } else if (e.key === 'd' || e.key === 'ArrowRight') {
            x += stepSize;
        } else if (e.key === 'a' || e.key === 'ArrowLeft') {
            x -= stepSize;
        }

        player.style.transform = `translate(${x}px, ${y}px)`;
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

    if (location.x < viewBorder) {
        console.log('border hit');
    } else if(location.x + location.width > viewArea.width - viewBorder) {
        console.log('border right hit');
        scroll(800, 0);
    } else if (location.y < viewBorder) {
        console.log('border hit');
    } else if(location.y + location.height > viewArea.height - viewBorder) {
        console.log('border hit');
    }

    function scroll(moveX, moveY) {

        //todo possible approaches:
        // 1. move the player as fast as the map (player to the other end (0 + border & width - border))
        // 2. Move the map with every key press a little bit (player stays in the middle) <- try this one tmrw
        var m = document.getElementById('map-bg');
        var currentTransformX = map.left;
        var currentTransformY = map.top;
        console.log('Current Map:', currentTransformX, currentTransformY);

        console.log('Current Player:', x, y);
        x -= moveX;
        y -= moveY;
        console.log('New Player:', x, y);
        player.style.transform = `translate(${x}px, ${y}px)`;
        player.style.transition = 'transform 0.2s linear';

        console.log('New Map:', currentTransformX - moveX, currentTransformY - moveY);
        m.style.transform = `translate(${currentTransformX - moveX}px, ${currentTransformY - moveY}px)`;
        m.style.transition = 'transform 0.2s linear';
    }
}