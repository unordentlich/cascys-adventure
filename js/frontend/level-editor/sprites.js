const sprites = [
    {
        id: "map_basic",
        tiles: 5,
        pixelPerTile: 256,
        width: 2,
        heigth: 3,
        titles: [
            "Straight Path",
            "Straight Grass Border",
            "Water (Sea)",
            "Grass",
            "Straight Water Border"
        ]
    }
];

async function prepareSpriteTiles() {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < sprites.length; i++) {
            let current = sprites[i];
            window.electronAPI.requestAsset(`/assets/sprites/${current.id}.png`).then((base64Image) => {
                if (!base64Image) alert(`Image ${current.id} not found!`);

                var image = new Image();
                image.src = base64Image;

                current.img = image;
                splitTiles(current);
            }).catch(err => console.error(err));
        }

        resolve(sprites);
    })
}

function splitTiles(sprite) {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');

    canvas.width = sprite.pixelPerTile;
    canvas.height = sprite.pixelPerTile;

    let sx = 0
    let sy = 0;
    for (let i = 0; i < sprite.tiles; i++) {

        if (sx >= sprite.width) {
            sx = 0;
            sy += 1;
        }

        ctx.restore();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();

        ctx.drawImage(sprite.img, sx*sprite.pixelPerTile, sy*sprite.pixelPerTile, sprite.pixelPerTile, sprite.pixelPerTile, 0, 0, sprite.pixelPerTile, sprite.pixelPerTile);

        var exportImage = new Image();
        exportImage.src = canvas.toDataURL();

        if (!sprite.tileset) sprite.tileset = [];
        sprite.tileset.push({
            img: exportImage,
            title: sprite.titles[i],
            x: sx,
            y: sy
        });

        sx++;
    }
}