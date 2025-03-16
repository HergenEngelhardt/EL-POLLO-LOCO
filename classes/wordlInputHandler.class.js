/**
 * Handles input events for the game world
 * @class
 */
class WorldInputHandler {
    /**
     * Creates a new WorldInputHandler
     * @param {World} world - Reference to the main world
     */
    constructor(world) {
        this.world = world;
        this.canvas = world.canvas;
    }

    /**
     * Adds mouse event listeners for game controls
     */
    addMouseEvents() {
        this.canvas.addEventListener('click', (event) => {
            this.world.handlePointerEvent(event);
        });
        this.canvas.addEventListener('touchstart', (event) => {
            event.preventDefault();
            if (event.touches.length > 0) {
                let touch = event.touches[0];
                this.world.handlePointerEvent({
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });
            }
        });
    }
}