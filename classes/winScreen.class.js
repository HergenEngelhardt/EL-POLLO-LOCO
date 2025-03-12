/**
 * Represents the game win screen that appears when the player defeats the boss.
 * @extends DrawableObject
 */
class GameWinScreen extends DrawableObject {
    /**
     * Creates a new GameWinScreen instance.
     */
    constructor() {
        super();
        this.loadImage('./assets/img/9_intro_outro_screens/win/win_2.png');
        this.width = 720;
        this.height = 480;
        this.soundPlayed = false;
        this.screenDisplayed = false;
        this.buttonsCreated = false;
        this.world = null;
    }

    /**
     * Sets the world reference for this win screen.
     * @param {World} world - The game world object
     */
    setWorld(world) {
        this.world = world;
    }

    /**
     * Plays the win sound effect once.
     */
    playWinSound() {
        if (!this.soundPlayed) {
            let audio = new Audio('./audio/winning.wav');
            audio.play().catch(error => {
                console.error('Error playing audio:', error);
            });
            this.soundPlayed = true;
        }
    }

    /**
     * Draws the win screen on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    draw(ctx) {
        if (!ctx || !this.world) return;

        if (this.world.gameWon) {
            ctx.drawImage(this.img, (ctx.canvas.width - this.width) / 2, (ctx.canvas.height - this.height) / 2, this.width, this.height);
            this.playWinSound();

            if (!this.screenDisplayed) {
                if (ctx && ctx.canvas) {
                    this.showWinScreen(ctx.canvas);
                    this.screenDisplayed = true;
                }
            }
        }
    }

    /**
     * Shows the win screen with restart and menu buttons.
     * @param {HTMLCanvasElement} canvas - The game canvas element
     */
    showWinScreen(canvas) {
        if (!canvas || this.buttonsCreated) {
            canvas || console.error('Canvas is undefined in showWinScreen');
            return;
        }

        this.removeExistingButtonContainer();
        this.createButtonsContainer(canvas);
        this.setupEventListeners();
    }

    /**
     * Removes any existing button container from the DOM.
     */
    removeExistingButtonContainer() {
        let existingContainer = document.getElementById('win-loose-buttons-container');
        if (existingContainer) {
            existingContainer.remove();
        }
    }

    /**
     * Creates and adds the buttons container to the DOM.
     * @param {HTMLCanvasElement} canvas - The game canvas element
     */
    createButtonsContainer(canvas) {
        let canvasRect = canvas.getBoundingClientRect();

        let buttonsHTML = `
            <div id="win-loose-buttons-container" style="position: absolute; top: ${canvasRect.top + canvasRect.height * 0.65}px; left: ${canvasRect.left + canvasRect.width / 2}px; transform: translateX(-50%); text-align: center; z-index: 1000;">
                <button class="btn" id="restart-game-btn">Restart Game</button>
                <span> </span>
                <button class="btn" id="back-to-menu-btn">Back to Menu</button>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', buttonsHTML);
        this.buttonsCreated = true;
    }

    /**
     * Sets up event listeners for the restart and menu buttons.
     */
    setupEventListeners() {
        let self = this;
        document.getElementById('restart-game-btn').addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            self.handleRestartGame();
        });

        document.getElementById('back-to-menu-btn').addEventListener('click', () => {
            this.handleBackToMenu();
        });
    }

    /**
     * Handles the restart game button click.
     */
    handleRestartGame() {
        this.removeButtonContainer();
        if (this.world) {
            this.world.clearAllGameIntervals();
        }
        let world = this.world || window.world;
        if (world) {
            this.resetGameState(world);
            this.resetCharacterState(world);
            this.resetWorldState(world);
            this.reinitializeLevel(world);
            world.startGame();
            if (world.collisionManager) {
                world.collisionManager.startCollisionDetection();
            } else if (typeof world.startCollisionDetection === 'function') {
                world.startCollisionDetection();
            }
        } else {
            this.handleMissingWorld();
        }
    }

    /**
     * Removes the buttons container from the DOM.
     */
    removeButtonContainer() {
        let container = document.getElementById('win-loose-buttons-container');
        if (container) {
            container.remove();
        }
    }

    /**
     * Resets the game state.
     * @param {World} world - The game world object
     */
    resetGameState(world) {
        world.gameWon = false;
        world.gameOver = false;
        world.gameStarted = true;
        this.screenDisplayed = false;
        this.buttonsCreated = false;
        this.soundPlayed = false;

        if (world.character.animationInterval) {
            clearInterval(world.character.animationInterval);
        }
    }

    /**
     * Resets the character state.
     * @param {World} world - The game world object
     */
    resetCharacterState(world) {
        world.character.energy = 100;
        world.character.deadAnimationPlayed = false;
        world.character.x = 100;
        world.character.y = 180;
        world.character.speedY = 0;
        world.character.otherDirection = false;
    }

    /**
     * Resets the world state.
     * @param {World} world - The game world object
     */
    resetWorldState(world) {
        world.camera_x = 0;
        world.coinsCollected = 0;
        world.bottlesCollected = 0;
        world.throwableBottles = [];
        world.activeThrowableBottles = [];
        world.gameWon = false;
        if (world.collisionInterval) {
            clearInterval(world.collisionInterval);
            world.collisionInterval = null;
        }
    }

    /**
     * Reinitializes the game level.
     * @param {World} world - The game world object
     */
    reinitializeLevel(world) {
        if (typeof initLevel1 === 'function') {
            initLevel1();
            if (typeof level1 !== 'undefined') {
                world.level = level1;
                world.setWorld();
            }
        }

        this.updateGameUI(world);
    }

    /**
     * Updates the game UI elements.
     * @param {World} world - The game world object
     */
    updateGameUI(world) {
        world.updateHealthStatusBar();
        world.updateCoinStatusBar();
        world.updateBottleStatusBar();
        world.draw();
    }

    /**
     * Handles the case when the world object is not found.
     */
    handleMissingWorld() {
        console.error("World object not found! Attempting fallback...");
        try {
            if (typeof startGame === 'function') {
                startGame();
                return;
            }
        } catch (e) {
            console.error("Fallback failed:", e);
        }

        console.warn("Using reload as last resort");
        location.reload();
    }

    /**
     * Handles the back to menu button click.
     */
    handleBackToMenu() {
        let container = document.getElementById('win-loose-buttons-container');
        if (container) {
            container.remove();
        }
        location.reload();
    }
}