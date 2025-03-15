/**
 * Base class for all drawable objects in the game.
 * Provides functionality to load, cache, and render images on a canvas.
 */
class DrawableObject {
    x = 40;
    y = 250;
    height = 150;
    width = 100;
    img;
    imageCache = {};
    currentImage = 0;

    /**
     * Loads a single image from the specified path
     * @param {string} path - File path to the image
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Loads multiple images into image cache
     * @param {string[]} arr - Array of image paths
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Draws the object on the canvas
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    draw(ctx) {
        if (this.img) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }

    // /**
    //  * Draws a red frame around certain game objects for debugging collision detection
    //  * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
    //  */
    // drawFrame(ctx) {
    //     if (this instanceof Character || this instanceof Chicken || this instanceof ChickenSmall || this instanceof ChickenBoss || this instanceof SalsaBottle || this instanceof Coin) {
    //         ctx.beginPath();
    //         ctx.lineWidth = "3";
    //         ctx.strokeStyle = "red";
    //         ctx.rect(this.x, this.y, this.width, this.height);
    //         ctx.stroke();
    //     }
    // }

    // /**
    //  * Draws a blue frame showing the object's collision boundaries with offsets
    //  * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
    //  */
    // drawOffsetFrame(ctx) {
    //     if (this.offset) {
    //         ctx.beginPath();
    //         ctx.lineWidth = "2";
    //         ctx.strokeStyle = "blue"; 
    //         ctx.rect(
    //             this.x + this.offset.left, 
    //             this.y + this.offset.top, 
    //             this.width - this.offset.left - this.offset.right,
    //             this.height - this.offset.top - this.offset.bottom
    //         );
    //         ctx.stroke();
    //     }
    // }
}