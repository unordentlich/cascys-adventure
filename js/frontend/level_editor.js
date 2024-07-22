const height = 16;
const width = 16;
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
let selectedElement;

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
            if (clicked) {
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

    var sprite = selectSprite("map_basic", 0, 0);
    for (let i = 0; i < height * width; i++) {
        if (xPos >= width * pixelSize + offsetX * pixelSize) {
            xPos = 0 + (offsetX * pixelSize);
            yPos += pixelSize;
        }

        ctx.beginPath();

        let rotation = (i % 5 === 0 ? 90 : 0);

        ctx.drawImage((rotation !== 0 ? rotateImage("map_basic", sprite.image, rotation) : sprite.image), sprite.sx, sprite.sy, sprite.swidth, sprite.sheight, xPos, yPos, pixelSize, pixelSize);
        ctx.strokeRect(xPos, yPos, pixelSize, pixelSize);

        if(selectedElement === i) {
            ctx.lineWidth = 5.5;
            ctx.fillStyle = "white"
            ctx.strokeStyle="white";
            ctx.strokeRect(xPos + 3, yPos + 3, pixelSize - 5.5, pixelSize - 5.5);
            ctx.lineWidth = 1;
            ctx.strokeStyle="black";
        }

        ctx.font = "30px Arial";
        ctx.fillText(i, xPos + pixelSize / 2, yPos + pixelSize / 2);

        ctx.stroke();
        ctx.fillStyle = "black";

        elements.push({
            top: yPos,
            left: xPos,
            id: i,
            height: pixelSize,
            width: pixelSize,
            rotation: rotation
        });
        xPos += pixelSize;
    }
}

function selectChunk(event) {
    const realPosition = toRelativeCanvasPosition(event.clientX, event.clientY);
    elements.forEach(function (element) {
        if (realPosition[1] > element.top && realPosition[1] < element.top + element.height
            && realPosition[0] > element.left && realPosition[0] < element.left + element.width) {
            selectedElement = element.id;

            prepareCanvas();
            innerChunkPropertiesInFields(element);
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

function innerChunkPropertiesInFields(chunk) {
    const idInp = document.getElementById('inp-chunk-id'),
        rotationInp = document.getElementById('inp-chunk-rotation'),
        xInp = document.getElementById('inp-chunk-x'),
        yInp = document.getElementById('inp-chunk-y'),
        heightInp = document.getElementById('inp-chunk-height'),
        widthInp = document.getElementById('inp-chunk-width');

    rotationInp.value = chunk.rotation + "°";
    idInp.value = chunk.id;
    xInp.value = chunk.left;
    yInp.value = chunk.top;
    heightInp.value = chunk.height;
    widthInp.value = chunk.width;
}

function rotateImage(map, img, degrees){
    // pre cache rotated images (LAGGS!!!)
    if(degrees !== 90 && degrees !== 180 && degrees !== 270 && degrees !== 360) return;
    if(images.has(map + "#R")) return images.get(map + "#R");

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    if(degrees === 90 || degrees === 180) {
        canvas.height = img.width;
    canvas.width = img.height;
    }

    context.clearRect(0,0,canvas.width,canvas.height);
    context.save();
    context.translate(canvas.width/1.5,canvas.height/2);
    context.rotate(degrees*Math.PI/180);
    context.drawImage(img,-img.width/2,-img.width/2);
    
    var returnImg = new Image();
    returnImg.src = canvas.toDataURL();
    images.set(map + '#R', returnImg);
    return returnImg;
}