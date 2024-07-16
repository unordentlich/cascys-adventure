const height = 32;
const width = 32;
const pixelSize = 20;
let canvas;
let ctx;

let offsetX = 0;
let offsetY = 0;

document.addEventListener("DOMContentLoaded", () => {
    canvas = document.getElementById("map");
    ctx = canvas.getContext("2d");
    canvas.width = canvas.parentElement.getBoundingClientRect().width;
    canvas.height = canvas.parentElement.getBoundingClientRect().height;
    prepareCanvas();
});

const movementKeys = ['w', 'a', 's', 'd', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];
document.addEventListener('keydown', (e) => {
    console.log(e.key);

    if(!movementKeys.includes(e.key)) return;
    if(e.key === 'w' || e.key === 'ArrowUp') {
        offsetY += 1;
    } else if(e.key === 's' || e.key === 'ArrowDown') {
        offsetY -= 1;
    } else if(e.key === 'd' || e.key === 'ArrowRight') {
        offsetX -= 1;
    } else if(e.key === 'a' || e.key === 'ArrowLeft') {
        offsetX += 1;
    }
    console.log(offsetX, offsetY);

    prepareCanvas();
});

function prepareCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    let xPos = 0 + (offsetX * pixelSize);
    let yPos = 0 + (offsetY * pixelSize);

    for (let i = 0; i < height * width; i++) {
        if (xPos >= width * pixelSize + offsetX * pixelSize) {
            xPos = 0 + (offsetX * pixelSize);
            yPos += pixelSize;
        }

        ctx.beginPath();
        ctx.fillStyle = getRandomColor();
        ctx.fillRect(xPos, yPos, pixelSize, pixelSize);
        ctx.stroke();
        xPos += pixelSize;
    }
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}