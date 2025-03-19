/**
 * Base class for game ending screens (win/lose)
 * @extends DrawableObject
 */
class GameEndScreen extends DrawableObject {
    /**
     * Creates a new GameEndScreen instance.
     * @param {string} imagePath - Path to the screen image
     * @param {string} soundKey - Key for the sound to play
     */
    constructor(imagePath, soundKey) {
        super();
        this.loadImage(imagePath);
        this.width = 720;
        this.height = 480;
        this.soundPlayed = false;
        this.screenDisplayed = false;
        this.buttonsCreated = false;
        this.world = null;
        this.soundKey = soundKey;
        this.uiManager = new GameEndScreenUI(this);
        this.soundManager = new GameEndScreenSoundManager(this);
        this.restartManager = new GameEndScreenRestartManager(this);
    }

    /**
     * Sets the world reference for this screen.
     * @param {World} world - The game world object
     */
    setWorld(world) {
        this.world = world;
    }

    /**
     * Checks if drawing is possible
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * @returns {boolean} Whether drawing can proceed
     */
    canDraw(ctx) {
        return ctx && this.world;
    }

    /**
     * Override in child class to determine when to show the screen
     * @returns {boolean} Whether the screen should be shown
     */
    shouldShowScreen() {
        throw new Error('Child class must implement shouldShowScreen()');
    }

    /**
     * Draws the end screen on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    draw(ctx) {
        if (!this.canDraw(ctx)) return;

        if (this.shouldShowScreen()) {
            this.initializeScreenIfNeeded(ctx);
            this.renderEndScreen(ctx);
            this.playEndSound();
        }
    }

    /**
     * Initializes the screen if it hasn't been displayed yet
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    initializeScreenIfNeeded(ctx) {
        if (!this.screenDisplayed) {
            this.soundManager.stopAllSounds();
            ensureAllIntervalsAndSoundsStopped();
            this.screenDisplayed = true;

            if (ctx && ctx.canvas) {
                this.uiManager.showEndScreen(ctx.canvas);
            }
        }
    }

    /**
     * Renders the end screen image on the canvas
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    renderEndScreen(ctx) {
        let x = (ctx.canvas.width - this.width) / 2;
        let y = (ctx.canvas.height - this.height) / 2;
        ctx.drawImage(this.img, x, y, this.width, this.height);
    }

    /**
     * Plays the appropriate end sound effect once.
     */
    playEndSound() {
        if (!this.soundPlayed) {
            if (SoundManager.enabled) {
                SoundManager.play(this.soundKey, 0.2);
            }
            this.soundPlayed = true;
        }
    }

    /**
     * Handles the restart game button click.
     */
    handleRestartGame() {
        this.uiManager.removeButtonContainer();
        ensureAllIntervalsAndSoundsStopped();
        this.restartManager.restartGame();
    }

    /**
     * Handles the back to menu button click.
     */
    handleBackToMenu() {
        this.uiManager.removeButtonContainer();
        ensureAllIntervalsAndSoundsStopped();
        location.reload();
    }
}