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
    
    /**
     * Overrides the draw method to prevent rendering in portrait mode on mobile
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    draw(ctx) {
        if (this.shouldRender()) {
            super.draw(ctx);
        }
    }
    
    /**
     * Determines if the background should render based on device orientation
     * @returns {boolean} True if rendering should proceed, false otherwise
     */
    shouldRender() {
        if (this.isInPortraitMode()) {
            return false;
        }
        return true;
    }
    
    /**
     * Checks if device is in portrait mode on mobile
     * @returns {boolean} True if in portrait mode on mobile
     */
    isInPortraitMode() {
        try {
            let orientationMessage = document.getElementById('orientation-message');
            if (orientationMessage && !orientationMessage.classList.contains('d-none')) {
                return true;
            }
            
            if (typeof isMobileDevice === 'function' && isMobileDevice() && window.innerHeight > window.innerWidth) {
                return true;
            }
        } catch (error) {
            console.error('Error checking portrait mode:', error);
        }
        
        return false;
    }
}