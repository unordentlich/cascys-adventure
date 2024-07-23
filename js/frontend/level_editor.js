let project = {
    height: 16,
    width: 16,
    pixelSize: 200,
    chunks: []
}
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

let selectedChunk;
let selectedTileImage;

let images = new Map();

window.addEventListener("resize", () => {
    canvas.width = canvas.parentElement.getBoundingClientRect().width;
    canvas.height = canvas.parentElement.getBoundingClientRect().height;

    prepareCanvas();
});

document.addEventListener("DOMContentLoaded", () => {
    preloadImages();
    prepareSpriteTiles().then(() => {
        setTimeout(() => {
            var availableTiles = document.getElementById('available-tiles');
            for (let i = 0; i < sprites.length; i++) {
                let sprite = sprites[i];
                for (let j = 0; j < sprite.tileset.length; j++) {
                    let tile = sprite.tileset[j];
                    tile.img.addEventListener('click', () => {
                        selectTileImage({
                            img: tile.img,
                            map: sprite.id,
                            x: tile.x,
                            y: tile.y
                        });
                    })
                    availableTiles.appendChild(tile.img);
                }
            }
        }, 200);

    });

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

    document.getElementById('btn-save-project').addEventListener('click', () => {
        window.electronAPI.requestPath().then((path) => {
            saveDraftToFile(path);
        });
    });

    document.getElementById('btn-load-project').addEventListener('click', () => {
        loadDraftFromFile();
    });
});

const movementKeys = ['w', 'a', 's', 'd', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];
document.addEventListener('keydown', (e) => {
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

    prepareCanvas();
});

function loadProject(pJson) {
    project = JSON.parse(pJson);

    prepareCanvas();
}

function prepareCanvas() {
    ctx.restore();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.resetTransform();
    ctx.scale(zoom, zoom);
    ctx.translate(mouseOffsetX, mouseOffsetY);
    if (project.chunks.length === 0) return;
    if (project.chunks.length !== project.height * project.width) {
        alert('Warning! Map file is corrupted. Expected chunk amount: ' + project.height * project.width + ' -> Actual amount: ' + project.chunks.length);
    }

    let xPos = 0 + (offsetX * project.pixelSize);
    let yPos = 0 + (offsetY * project.pixelSize);

    for (let i = 0; i < project.height * project.width; i++) {
        const chunk = project.chunks[i];
        if (xPos >= project.width * project.pixelSize + offsetX * project.pixelSize) {
            xPos = 0 + (offsetX * project.pixelSize);
            yPos += project.pixelSize;
        }

        ctx.beginPath();

        var sprite = selectSprite(chunk.tile.map, chunk.tile.x, chunk.tile.y);
        ctx.drawImage(getImage(sprite, chunk.rotation), xPos, yPos, project.pixelSize, project.pixelSize);
        ctx.strokeRect(xPos, yPos, project.pixelSize, project.pixelSize);

        if (selectedChunk === i) {
            ctx.lineWidth = 5.5;
            ctx.fillStyle = "white"
            ctx.strokeStyle = "white";
            ctx.strokeRect(xPos + 3, yPos + 3, project.pixelSize - 5.5, project.pixelSize - 5.5);
            ctx.lineWidth = 1;
            ctx.strokeStyle = "black";
        }

        ctx.font = "30px Arial";
        ctx.fillText(i, xPos + project.pixelSize / 2 - 10, yPos + project.pixelSize / 2);

        ctx.stroke();
        ctx.fillStyle = "black";

        xPos += project.pixelSize;
    }
}

function selectChunk(event) {
    const realPosition = toRelativeCanvasPosition(event.clientX, event.clientY);
    project.chunks.forEach(function (element) {
        if (realPosition[1] > element.top && realPosition[1] < element.top + element.height
            && realPosition[0] > element.left && realPosition[0] < element.left + element.width) {
            selectedChunk = element.id;

            prepareCanvas();
            innerChunkPropertiesInFields(element);

            if (selectedTileImage) {
                changeChunkTile();
            }
        }
    });
}

function changeChunkTile() {
    if (!selectedChunk || !selectedTileImage) return;

    let chunk = project.chunks.filter(c => c.id === selectedChunk)[0];
    chunk.tile = {
        map: selectedTileImage.map,
        x: selectedTileImage.x,
        y: selectedTileImage.y
    };

    prepareCanvas();
    innerChunkPropertiesInFields(chunk);
}

function selectTileImage(metadata) {
    if (selectedTileImage) {
        selectedTileImage.img.classList.remove('selected');
        if (selectedTileImage.img === metadata.img) {
            selectedTileImage = null;
            return;
        }
    }
    selectedTileImage = metadata;
    metadata.img.classList.add('selected');
}

function rotateCurrentChunk(rotation) {
    if (!selectedChunk) return;

    let currentRotation = project.chunks.filter(c => c.id === selectedChunk)[0].rotation;
    if (currentRotation === 360 && rotation === 90) {
        project.chunks.filter(c => c.id === selectedChunk)[0].rotation = 90;
    } else if (currentRotation === 0 && rotation === -90) {
        project.chunks.filter(c => c.id === selectedChunk)[0].rotation = 270;
    } else {
        project.chunks.filter(c => c.id === selectedChunk)[0].rotation += rotation;
    }
    prepareCanvas();
    innerChunkPropertiesInFields(project.chunks.filter(c => c.id === selectedChunk)[0]);
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
        map: id,
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
        tileInp = document.getElementById('inp-chunk-tile'),
        tileInpImg = document.getElementById('tile-preview'),
        widthInp = document.getElementById('inp-chunk-width');

    rotationInp.value = chunk.rotation + "°";
    idInp.value = chunk.id;
    xInp.value = chunk.left;
    yInp.value = chunk.top;
    heightInp.value = chunk.height;
    widthInp.value = chunk.width;
    tileInp.value = `${chunk.tile.map} [${chunk.tile.x}:${chunk.tile.y}]`;
    tileInpImg.src = sprites.filter(s => s.id === chunk.tile.map)[0].tileset.filter(t => t.x === chunk.tile.x && t.y === chunk.tile.y)[0].img.src;
}

function getImage(sprite, degrees) {
    if (degrees !== 0 && degrees !== 90 && degrees !== 180 && degrees !== 270 && degrees !== 360) return;
    if (images.has(sprite.map + "#" + sprite.sx + "#" + sprite.sy + (degrees >= 90 && degrees <= 270 ? "#" + degrees : ''))) return images.get(sprite.map + "#" + sprite.sx + "#" + sprite.sy + (degrees >= 90 && degrees <= 270 ? "#" + degrees : ''));

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');

    if (degrees === 90 || degrees === 270) {
        canvas.height = sprite.swidth;
        canvas.width = sprite.sheight;
    } else {
        canvas.height = sprite.sheight;
        canvas.width = sprite.swidth;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();

    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate(degrees * Math.PI / 180);
    context.drawImage(sprite.image, sprite.sx, sprite.sy, sprite.swidth, sprite.sheight, -sprite.swidth / 2, -sprite.sheight / 2, sprite.swidth, sprite.sheight);

    context.restore();


    var returnImg = new Image();
    returnImg.src = canvas.toDataURL();
    images.set(sprite.map + "#" + sprite.sx + "#" + sprite.sy + (degrees >= 90 && degrees <= 270 ? "#" + degrees : ''), returnImg);
    return returnImg;
}