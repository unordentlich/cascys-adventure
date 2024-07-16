const height = 12;
const width = 24;
const pixelSize = 20;
const previewScale = 8;
let canvas;
let ctx;

let offsetX = 0;
let offsetY = 0;

let dragging = false;
let mouseClicked = [];
let mouseOffsetX = 0;
let mouseOffsetY = 0;

let zoom = 1;
let zoomStep = 0.2;
let maxZoom = 4.5;
let minZoom = 0.5;

document.addEventListener("DOMContentLoaded", () => {
    canvas = document.getElementById("map");
    ctx = canvas.getContext("2d");

    canvas.width = canvas.parentElement.getBoundingClientRect().width;
    canvas.height = canvas.parentElement.getBoundingClientRect().height;

    prepareCanvas();

    canvas.addEventListener("wheel", (e) => {
        console.log(zoom);
        if(e.wheelDelta) {
            if(e.wheelDelta > 0) {
                if(zoom >= maxZoom) return;
                zoom += zoomStep;
            } else {
                if(zoom <= minZoom) return;
                zoom -= zoomStep;
            }
            prepareCanvas();
            return;
        }

        if(e.deltaY > 0) {
            if(zoom >= maxZoom) return;
            zoom += zoomStep;
        } else {
            if(zoom <= minZoom) return;
            zoom -= zoomStep;
        }
        prepareCanvas();
    });

    canvas.addEventListener("mousedown", (e) => {
        dragging = true;
        mouseClicked = [e.clientX, e.clientY];
    });

    canvas.addEventListener("mousemove", (e) => {
        if(!dragging) return;
        mouseOffsetX = e.clientX - mouseClicked[0];
        mouseOffsetY = e.clientY - mouseClicked[1];
        console.log(mouseOffsetX, mouseOffsetY);
        prepareCanvas();
    });

    canvas.addEventListener("mouseup", () => {
        if(!dragging) return;
        dragging = false;
    })
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
    console.log(mouseOffsetX, mouseOffsetY);
    ctx.restore();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.resetTransform();
    ctx.scale(zoom, zoom);
    ctx.translate(mouseOffsetX, mouseOffsetY);

    let xPos = 0 + (offsetX * pixelSize);
    let yPos = 0 + (offsetY * pixelSize);

    for (let i = 0; i < height * width; i++) {
        if (xPos >= width * pixelSize + offsetX * pixelSize) {
            xPos = 0 + (offsetX * pixelSize);
            yPos += pixelSize;
        }

        ctx.beginPath();
        ctx.rect(xPos, yPos, pixelSize, pixelSize);
        ctx.stroke();
        xPos += pixelSize;
    }
}