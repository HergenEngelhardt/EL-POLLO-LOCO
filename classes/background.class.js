/**
 * Represents a background element in the game.
 * @extends MovableObject
 */
class Background extends MovableObject {
    width = 720;
    height = 480;
    
    /**
     * Creates a new background element.
     * @param {string} imagePath - Path to the background image
     * @param {number} x - X-coordinate position
     * @param {number} [yPosition] - Optional Y-coordinate position (defaults to bottom of canvas)
     */
    constructor(imagePath, x, yPosition) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = yPosition !== undefined ? yPosition : 480 - this.height;
    }
}