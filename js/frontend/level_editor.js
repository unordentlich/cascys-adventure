const height = 32;
const width = 32;
const pixelSize = 200;
const previewScale = 8;
let canvas;
let ctx;

let offsetX = 0;
let offsetY = 0;

let dragging = false;
let clicked = false;
let mouseClicked = [];
let lastClicked = [0, 0];
let mouseOffsetX = 50;
let mouseOffsetY = 50;

let zoom = 0.5;
let zoomStep = 0.2;
let maxZoom = 4.5;
let minZoom = 0.5;

let elements = [];

let images = new Map();

window.addEventListener("resize", () => {
    canvas.width = canvas.parentElement.getBoundingClientRect().width;
    canvas.height = canvas.parentElement.getBoundingClientRect().height;

    prepareCanvas();
});

document.addEventListener("DOMContentLoaded", () => {
    preloadImages();

    setTimeout(() => {
        canvas = document.getElementById("map");
        ctx = canvas.getContext("2d");

        canvas.width = canvas.parentElement.getBoundingClientRect().width;
        canvas.height = canvas.parentElement.getBoundingClientRect().height;

        prepareCanvas();

        canvas.addEventListener("wheel", (e) => {
            if (e.wheelDelta) {
                if (e.wheelDelta > 0) {
                    if (zoom >= maxZoom) return;
                    zoom += zoomStep;
                } else {
                    if (zoom <= minZoom) return;
                    zoom -= zoomStep;
                }
                prepareCanvas();
                return;
            }

            if (e.deltaY > 0) {
                if (zoom >= maxZoom) return;
                zoom += zoomStep;
            } else {
                if (zoom <= minZoom) return;
                zoom -= zoomStep;
            }
            prepareCanvas();
        });

        canvas.addEventListener("mousedown", (e) => {
            dragging = true;
            clicked = true;
            mouseClicked = [e.clientX, e.clientY];
        });

        canvas.addEventListener("mousemove", (e) => {
            if (!dragging) return;
            clicked = false;
            mouseOffsetX = lastClicked[0] + (e.clientX - mouseClicked[0]) * (zoom <= minZoom ? 2 : 1);
            mouseOffsetY = lastClicked[1] + (e.clientY - mouseClicked[1]) * (zoom <= minZoom ? 2 : 1);
            console.log(mouseOffsetX, mouseOffsetY);
            prepareCanvas();
        });

        canvas.addEventListener('mouseup', (event) => {
            if(clicked) {
                clicked = false;
                selectChunk(event);
            }
        })

        const mouseUpOut = () => {
            if (!dragging) return;
            dragging = false;
            lastClicked = [mouseOffsetX, mouseOffsetY];
        };
        canvas.addEventListener("mouseup", mouseUpOut);
        canvas.addEventListener("mouseout", mouseUpOut);

    }, 200);

    document.getElementById("center-btn").addEventListener("click", () => {
        resetCanvasView();
    });
    document.getElementById("btn-exit").addEventListener("click", () => {
        const confirmation = confirm('You are about to leave the Level Editor! Are you sure about it?');
        if (!confirmation) return;
        window.electronAPI.switchPage('views/main_menu.html');
    });
});

const movementKeys = ['w', 'a', 's', 'd', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];
document.addEventListener('keydown', (e) => {
    console.log(e.key);

    if (!movementKeys.includes(e.key)) return;
    if (e.key === 'w' || e.key === 'ArrowUp') {
        offsetY += 1;
    } else if (e.key === 's' || e.key === 'ArrowDown') {
        offsetY -= 1;
    } else if (e.key === 'd' || e.key === 'ArrowRight') {
        offsetX -= 1;
    } else if (e.key === 'a' || e.key === 'ArrowLeft') {
        offsetX += 1;
    }
    console.log(offsetX, offsetY);

    prepareCanvas();
});

function prepareCanvas() {
    ctx.restore();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.resetTransform();
    ctx.scale(zoom, zoom);
    ctx.translate(mouseOffsetX, mouseOffsetY);
    elements = [];

    let xPos = 0 + (offsetX * pixelSize);
    let yPos = 0 + (offsetY * pixelSize);

    var sprite = selectSprite("map_basic", 0, 2);
    for (let i = 0; i < height * width; i++) {
        if (xPos >= width * pixelSize + offsetX * pixelSize) {
            xPos = 0 + (offsetX * pixelSize);
            yPos += pixelSize;
        }

        ctx.beginPath();

        ctx.drawImage(sprite.image, sprite.sx, sprite.sy, sprite.swidth, sprite.sheight, xPos, yPos, pixelSize, pixelSize);
        ctx.strokeRect(xPos, yPos, pixelSize, pixelSize);

        ctx.font = "30px Arial";
        ctx.fillText(i, xPos + pixelSize / 2, yPos + pixelSize / 2);

        ctx.stroke();

        elements.push({
            top: yPos,
            left: xPos,
            id: i,
            height: pixelSize,
            width: pixelSize
        });
        xPos += pixelSize;
    }
}

function selectChunk(event) {
    const realPosition = toRelativeCanvasPosition(event.clientX, event.clientY);
    elements.forEach(function (element) {
        if (realPosition[1] > element.top && realPosition[1] < element.top + element.height
            && realPosition[0] > element.left && realPosition[0] < element.left + element.width) {
            alert(`Element ${element.id} at ${element.left}, ${element.top}`);
        }
    });
}

function toRelativeCanvasPosition(x, y) {
    const rect = canvas.getBoundingClientRect();
    const transform = ctx.getTransform();
    const canvasX = (x - rect.left - transform.e) / transform.a;
    const canvasY = (y - rect.top - transform.f) / transform.d;
    return [canvasX, canvasY];
}

function resetCanvasView() {
    mouseOffsetX = 50;
    mouseOffsetY = 50;
    lastClicked = [0, 0];

    prepareCanvas();
}

function selectSprite(id, x, y) {
    const pixelPerSlot = 256;

    return {
        image: images.get(id),
        swidth: pixelPerSlot,
        sheight: pixelPerSlot,
        sx: x * pixelPerSlot,
        sy: y * pixelPerSlot,
    }
}

function preloadImages() {
    const maps = ["map_basic"]
    maps.forEach(map => {
        window.electronAPI.requestAsset(`/assets/sprites/${map}.png`).then((base64Image) => {
            if (!base64Image) alert("Image not found!");
            console.log(base64Image);

            var image = new Image();
            image.src = base64Image;
            images.set(map, image);
        }).catch(err => console.error(err));
    })

}