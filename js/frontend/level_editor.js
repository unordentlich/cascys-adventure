const height = 256;
const width = 256;
const pixelSize = 20;
let canvas;
let ctx;

let offsetX = 0;
let offsetY = 0;

let isDragging = false;
let dragStartX, dragStartY;

document.addEventListener("DOMContentLoaded", () => {
    canvas = document.getElementById("map");
    ctx = canvas.getContext("2d");
    canvas.width = canvas.parentElement.getBoundingClientRect().width;
    canvas.height = canvas.parentElement.getBoundingClientRect().height;
    prepareCanvas();


    canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragStartX = e.clientX - offsetX;
        dragStartY = e.clientY - offsetY;
    });

    canvas.addEventListener('mousemove', (e) => {
        if (isDragging) {
            offsetX = e.clientX - dragStartX;
            offsetY = e.clientY - dragStartY;
            prepareCanvas();
        }
    });

    canvas.addEventListener('mouseup', () => {
        isDragging = false;
    });

    canvas.addEventListener('mouseleave', () => {
        isDragging = false;
    });
})

function prepareCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(offsetX, offsetY);

    let xPos = 0;
    let yPos = 0;

    for (let i = 0; i < height * width; i++) {
        if (xPos >= width * pixelSize) {
            xPos = 0;
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