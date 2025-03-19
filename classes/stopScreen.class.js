/**
 * Represents the game over screen that appears when the player loses.
 * @extends DrawableObject
 */
class GameOverScreen extends DrawableObject {
    /**
     * Creates a new GameOverScreen instance.
     */
    constructor() {
        super();
        this.loadImage('./assets/img/9_intro_outro_screens/game_over/oh no you lost!.png');
        this.width = 720;
        this.height = 480;
        this.soundPlayed = false;
        this.screenDisplayed = false;
        this.buttonsCreated = false;
        this.world = null;
    }

    /**
     * Sets the world reference for this game over screen.
     * @param {World} world - The game world object
     */
    setWorld(world) {
        this.world = world;
    }

    /**
     * Plays the game over sound effect once.
     */
    playGameOverSound() {
        if (!this.soundPlayed) {
            if (SoundManager.enabled) {
                SoundManager.play('losing', 0.2);
            }
            this.soundPlayed = true;
        }
    }

    /**
     * Draws the game over screen on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    draw(ctx) {
        if (!this.canDraw(ctx)) return;

        if (this.world.gameOver) {
            this.initializeGameOverScreenIfNeeded(ctx);
            this.renderGameOverScreen(ctx);
            this.playGameOverSound();
        }
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
     * Initializes the game over screen if it hasn't been displayed yet
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    initializeGameOverScreenIfNeeded(ctx) {
        if (!this.screenDisplayed) {
            this.stopAllSounds();
            this.screenDisplayed = true;

            if (ctx && ctx.canvas) {
                this.showWinLoseScreen('lose', ctx.canvas);
            }
        }
    }

    /**
     * Renders the game over image on the canvas
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    renderGameOverScreen(ctx) {
        const x = (ctx.canvas.width - this.width) / 2;
        const y = (ctx.canvas.height - this.height) / 2;
        ctx.drawImage(this.img, x, y, this.width, this.height);
    }

    /**
     * Shows the win/lose screen with restart and menu buttons.
     * @param {string} result - The result of the game ('win' or 'lose')
     * @param {HTMLCanvasElement} canvas - The game canvas element
     */
    showWinLoseScreen(result, canvas) {
        if (this.buttonsCreated) {
            return;
        }
        canvas = this.getValidCanvas(canvas);
        if (!canvas) {
            console.error('No valid canvas element found');
            return;
        }
        this.removeExistingButtonContainer();
        this.createButtonsContainer(canvas, result);
        this.setupEventListeners(result);
        this.buttonsCreated = true;
    }

    /**
     * Gets a valid canvas element
     * @param {HTMLCanvasElement} canvas - The provided canvas element
     * @returns {HTMLCanvasElement|null} - A valid canvas element or null
     */
    getValidCanvas(canvas) {
        if (canvas && canvas instanceof HTMLCanvasElement && document.body.contains(canvas)) {
            return canvas;
        }

        return document.getElementById('canvas') ||
            document.getElementById('gameCanvas') ||
            document.querySelector('canvas');
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
        try {
            if (!this.validateCanvas(canvas)) return;

            let position = this.calculateButtonPosition(canvas);
            let buttonsHTML = this.generateButtonsHTML(position.top, position.left);
            this.insertButtonsIntoDOM(buttonsHTML);
        } catch (error) {
            console.error('Error creating buttons container:', error);
        }
    }

    /**
     * Validates that the canvas element is usable
     * @param {HTMLCanvasElement} canvas - The game canvas element
     * @returns {boolean} - Whether the canvas is valid
     */
    validateCanvas(canvas) {
        return canvas && document.body;
    }

    /**
     * Calculates the position for the buttons container
     * @param {HTMLCanvasElement} canvas - The game canvas element
     * @returns {Object} - The top and left position
     */
    calculateButtonPosition(canvas) {
        let canvasRect = canvas.getBoundingClientRect();
        let top = canvasRect.top + canvasRect.height * 0.65;
        let left = canvasRect.left + canvasRect.width / 2;
        return { top, left };
    }

    /**
     * Generates the HTML for the buttons container
     * @param {number} top - The top position
     * @param {number} left - The left position
     * @returns {string} - The HTML for the buttons container
     */
    generateButtonsHTML(top, left) {
        return `
        <div id="win-loose-buttons-container" style="position: absolute; top: ${top}px; left: ${left}px; transform: translateX(-50%); text-align: center; z-index: 1000;">
            <button class="btn" id="restart-game-btn">Restart Game</button>
            <span> </span>
            <button class="btn" id="back-to-menu-btn">Back to Menu</button>
        </div>
    `;
    }

    /**
     * Inserts the buttons HTML into the DOM
     * @param {string} buttonsHTML - The HTML for the buttons container
     */
    insertButtonsIntoDOM(buttonsHTML) {
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
        this.cleanupBeforeRestart();
        this.restartGameWithWorld();
    }

    /**
     * Performs cleanup operations before restarting the game
     */
    cleanupBeforeRestart() {
        this.removeButtonContainer();
        this.stopAllSounds();
    }

    /**
     * Restarts the game using the available world reference
     */
    restartGameWithWorld() {
        let world = this.getWorldReference();
        if (world) {
            this.performGameRestart(world);
        } else {
            this.handleMissingWorld();
        }
    }

    /**
     * Gets the world reference from either this.world or window.world
     * @returns {World|null} - The world reference or null if not found
     */
    getWorldReference() {
        return this.world || window.world;
    }

    /**
     * Performs the actual game restart with the given world object
     * @param {World} world - The game world object
     */
    performGameRestart(world) {
        this.clearGameIntervals(world);
        this.resetAnimationCounters(world);
        this.prepareGameRestart(world);
        this.startNewGame(world);
    }

    /**
     * Clears all game intervals if an interval manager exists
     * @param {World} world - The game world object 
     */
    clearGameIntervals(world) {
        if (world.intervallManager) {
            world.intervallManager.clearAllGameIntervals();
        }
    }

    /**
     * Stops all game sounds
     */
    stopAllSounds() {
        if (this.canUseWorldSoundStopper()) {
            this.useWorldSoundStopper();
        } else {
            this.useFallbackSoundStopper();
        }
        ensureAllSoundsStopped();
    }

    /**
     * Checks if the world has its own sound stopping method
     * @returns {boolean} Whether the world can stop sounds
     */
    canUseWorldSoundStopper() {
        return this.world && typeof this.world.stopAllSounds === 'function';
    }

    /**
     * Uses the world's own sound stopping method
     */
    useWorldSoundStopper() {
        this.world.stopAllSounds();
    }

    /**
     * Uses fallback methods to stop all sounds
     */
    useFallbackSoundStopper() {
        SoundManager.stopAll();
        this.stopCharacterSound();
        this.stopNamedSounds();
        this.stopAllHtmlAudioElements();
    }

    /**
     * Stops the character's running sound
     */
    stopCharacterSound() {
        if (this.world && this.world.character && this.world.character.runningSound) {
            this.world.character.runningSound.pause();
            this.world.character.runningSound.currentTime = 0;
        }
    }

    /**
     * Stops specific named sounds using the SoundManager
     */
    stopNamedSounds() {
        SoundManager.stop('chickenboss');
        SoundManager.stop('winning');
        SoundManager.stop('losing');
        SoundManager.stop('bossAlert');
        SoundManager.stop('snoring');
        SoundManager.stop('backgroundMusic');
    }

    /**
     * Stops all HTML audio elements on the page
     */
    stopAllHtmlAudioElements() {
        document.querySelectorAll('audio').forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
    }

    /**
     * Prepares the game for restart by resetting all necessary states
     * @param {World} world - The game world object
     */
    prepareGameRestart(world) {
        this.stopAllSounds();
        this.clearAllIntervals(world);
        this.resetCollisionSystem(world);
        this.resetGameStates(world);
        this.reinitializeLevel(world);
    }

    /**
     * Clears all intervals that need to be reset for a game restart
     * @param {World} world - The game world object
     */
    clearAllIntervals(world) {
        if (world.intervallManager) {
            world.intervallManager.clearAllGameIntervals();
        }
        if (world.collisionInterval) {
            clearInterval(world.collisionInterval);
            world.collisionInterval = null;
        }
    }

    /**
     * Resets the collision detection system
     * @param {World} world - The game world object
     */
    resetCollisionSystem(world) {
        if (world.collisionManager) {
            if (world.collisionManager.collisionInterval) {
                clearInterval(world.collisionManager.collisionInterval);
                world.collisionManager.collisionInterval = null;
            }
            world.collisionManager = new CollisionManager(world);
        }
    }

    /**
     * Resets all game state variables
     * @param {World} world - The game world object
     */
    resetGameStates(world) {
        this.resetGameState(world);
        world.gameOver = false;
        world.gameWon = false;
        this.resetCharacterState(world);
        this.resetWorldState(world);
    }

    /**
     * Starts the new game and initializes collision detection
     * @param {World} world - The game world object
     */
    startNewGame(world) {
        world.startGame();
        if (world.intervallManager) {
            world.intervallManager.updateReferences(world);
        }
        this.initializeCollisionDetection(world);
    }

    /**
     * Initializes the collision detection system
     * @param {World} world - The game world object
     */
    initializeCollisionDetection(world) {
        if (world.collisionManager) {
            world.collisionManager.startCollisionDetection();
        } else if (typeof world.startCollisionDetection === 'function') {
            world.startCollisionDetection();
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
    * Resets animation counters to prevent speed-up on restart
    * @param {World} world - The game world object
    */
    resetAnimationCounters(world) {
        this.resetCharacterAnimations(world);
        this.resetEnemyAnimations(world);
    }

    /**
    * Resets character animation counters
    * @param {World} world - The game world object
    */
    resetCharacterAnimations(world) {
        if (world.character) {
            world.character.currentImage = 0;
            world.character.jumpAnimationFrame = 0;
        }
    }

    /**
    * Resets all enemy animation counters
    * @param {World} world - The game world object
    */
    resetEnemyAnimations(world) {
        if (world.level && world.level.enemies) {
            world.level.enemies.forEach(enemy => {
                this.resetEnemyAnimation(enemy);
            });
        }
    }

    /**
    * Resets animation counters for a specific enemy
    * @param {Enemy} enemy - The enemy object to reset
    */
    resetEnemyAnimation(enemy) {
        enemy.currentImage = 0;

        if (enemy instanceof ChickenBoss) {
            this.resetBossAnimations(enemy);
        }
    }

    /**
    * Resets ChickenBoss specific animation counters
    * @param {ChickenBoss} boss - The boss enemy
    */
    resetBossAnimations(boss) {
        if (boss.animation) {
            boss.animation.deathAnimationIndex = 0;
            boss.animation.alertFrameCount = 0;
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
     * Resets the world state
     * @param {World} world - The game world object
     */
    resetWorldState(world) {
        world.camera_x = 0;
        world.coinsCollected = 0;
        world.bottlesCollected = 0;
        world.throwableBottles = [];
        world.activeThrowableBottles = [];
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