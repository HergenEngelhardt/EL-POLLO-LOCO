/**
 * Manages all rendering operations for the game
 * @class
 */
class RenderManager {
    /**
     * Creates a new RenderManager instance
     * @param {World} world - Reference to the game world
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     */
    constructor(world, ctx) {
        this.world = world;
        this.ctx = ctx;
    }

    /**
     * Draws all game world elements with camera offset
     */
    drawGameElements() {
        this.ctx.translate(this.world.camera_x, 0);
        this.drawWorldObjects();
        this.ctx.translate(-this.world.camera_x, 0);
        this.drawUIElements();
    }

    /**
    * Draws background elements and game objects
    */
    drawWorldObjects() {
        if (this.world.level) {
            this.addObjectsToMap(this.world.level.background || []);
            this.addObjectsToMap(this.world.level.clouds || []);
            this.addObjectsToMap(this.world.level.enemies || []);
            this.addObjectsToMap(this.world.level.coins || []);
            this.addObjectsToMap(this.world.level.salsaBottles || []);
        }
        this.addObjectsToMap(this.world.activeThrowableBottles || []);
        this.addToMap(this.world.character);
    }

    /**
     * Draws UI elements like status bars
     */
    drawUIElements() {
        this.addToMap(this.world.statusbarHealth);
        this.addToMap(this.world.statusbarCoin);
        this.addToMap(this.world.statusbarBottle);
    }

    /**
     * Adds an array of objects to the map for rendering
     * @param {Array<GameObject>} objects - Array of drawable objects
     */
    addObjectsToMap(objects) {
        objects.forEach(obj => {
            this.addToMap(obj)
        })
    }

    /**
     * Adds a single object to the map for rendering
     * @param {GameObject} mo - Drawable object to add
     */
    addToMap(mo) {
        if (mo.img) {
            if (mo instanceof ChickenBoss && mo.showHealthBar) {
                this.addToMap(mo.healthBar);
            }
            if (mo.otherDirection) {
                this.flipImage(mo);
            }
            mo.draw(this.ctx);
            // mo.drawFrame(this.ctx);
            // mo.drawOffsetFrame(this.ctx);

            if (mo.otherDirection) {
                this.flipImageBack(mo);
            }
        }
    }

    /**
     * Flips an image horizontally for rendering
     * @param {GameObject} mo - Object to flip
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restores original image orientation
     * @param {GameObject} mo - Object to restore
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}