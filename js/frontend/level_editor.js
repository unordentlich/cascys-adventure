const height = 12;
const width = 24;
const pixelSize = 20;
const previewScale = 8;
let canvas;
let ctx;

let previewBox, previewViewRect, previewMapRect;
let previewPixelPerMove = 2;

let offsetX = 0;
let offsetY = 0;

document.addEventListener("DOMContentLoaded", () => {
    canvas = document.getElementById("map");
    ctx = canvas.getContext("2d");

    previewBox = document.getElementById("map-hud");
    previewViewRect = document.getElementById("view-rect");
    previewMapRect = document.getElementById("map-rect");

    canvas.width = canvas.parentElement.getBoundingClientRect().width;
    canvas.height = canvas.parentElement.getBoundingClientRect().height;

    previewBox.style.width = canvas.width / previewScale + "px";
    previewBox.style.height = canvas.height / previewScale + "px";

    var prevHeight = (height / width) * height;
    var prevWidth = (height / width) * width;
    var toBeMultiplied = 0;
    if(prevHeight > prevWidth) {
        toBeMultiplied = (previewBox.getBoundingClientRect().height - 10) / prevHeight;
    } else {
        toBeMultiplied = (previewBox.getBoundingClientRect().width - 10) / prevWidth;
    }
    console.log(toBeMultiplied);
    prevHeight = prevHeight * toBeMultiplied;
    prevWidth = prevWidth * toBeMultiplied;

    previewMapRect.style.width = prevWidth + "px";
    previewMapRect.style.height = prevHeight + "px";

    previewViewRect.style.width = canvas.width * pixelSize / canvas.getBoundingClientRect().width + "px";
    previewViewRect.style.height = canvas.height * pixelSize / canvas.getBoundingClientRect().height + "px";
    
    console.log(previewPixelPerMove);
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
    //prepareCanvasPreview();
}

function prepareCanvasPreview() {
    previewViewRect.style.top = (previewPixelPerMove * (-offsetY + 1)) + "px";
    previewViewRect.style.left = (previewPixelPerMove * (-offsetX + 1)) + "px";
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}