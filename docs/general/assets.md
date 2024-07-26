### Assets

To make the game what it is, you need a lot of assets. They express and represent the game in visual and audio form.

#### Tilesets
Tilesets, also known as sprites, are map parts that can be used to build new levels and are arranged evenly in a file. So instead of having 16 different files for 16 different map parts, for example, you use one file instead, in which you populate 4x4 tiles and then cut out the corresponding pieces (with x and y coordinates) in the game. 

All sprite files for building new maps are stored in `/assets/sprites`. There you can also find a `@2x` version with a higher resolution.

To make a sprite file available in the editor, it must be registered. This is done in `js\frontend\level-editor\sprites.js`. There is an array list at the beginning of the file in which all sprite files can be listed.

Here is an example:
```json
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
```


The **ID** indicates the name of the card file. It is **important** that this field EXACTLY matches the name of the stored file so that the file can be recognized.

The **tiles** field indicates how many map parts are expected. Normally you can enter this with the height multiplied by the width, but it can happen that the last field remains empty and therefore there is an odd number of fields, which is why this value is considered an extra safeguard.

The **pixelPerTile** property specifies the size (both length and width) of a tile in pixels.

The **width** and **height** indicate how many columns and rows the spritesheet contains.

Optionally, **titles** can also be specified. These are displayed when hovering over the map parts in the editor. 
The pieces are named in order from left to right. Each piece must be named (or otherwise filled with an empty string “”), as the titles would otherwise move. 