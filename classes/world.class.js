/**
 * Represents the game world containing all game elements and logic
 * @class
 */
class World {
    character = new Character();
    level;
    canvas;
    ctx;
    keyboard;
    camera_x = -0;
    statusbarHealth = new Statusbar('health');
    statusbarCoin = new Statusbar('coin');
    statusbarBottle = new Statusbar('bottle');
    coinsCollected = 0;
    bottlesCollected = 0;
    throwableBottles = [];
    startScreen = new StartScreen();
    gameOverScreen = new GameOverScreen();
    gameStarted = false;
    gameOver = false;

    /**
     * Creates a new World instance
     * @param {HTMLCanvasElement} canvas - Canvas element for rendering
     * @param {Object} keyboard - Keyboard input handler
     */
    constructor(canvas, keyboard) {
        this.keyboard = keyboard;
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.gameOverScreen = new GameOverScreen();
        this.gameOverScreen.setWorld(this);
        this.soundManager = new WorldSoundManager(this);
        this.collisionManager = new CollisionManager(this);
        this.renderManager = new RenderManager(this, this.ctx);
        this.intervallManager = new IntervallManager(this);
        this.inputHandler = new WorldInputHandler(this);
        this.draw();
        this.setWorld();
        this.inputHandler.addMouseEvents();  
        this.initCollisionDetection();
        this.totalInitialBottles = 5;
        this.gameWon = false;
        this.winScreen = new GameWinScreen();
        this.winScreen.setWorld(this);
    }

    /**
     * Sets this world reference for all entities
     */
    setWorld() {
        this.character.world = this;
        if (this.level && this.level.enemies) {
            this.level.enemies.forEach(enemy => {
                enemy.world = this;
            });
        }
        if (this.intervallManager) {
            this.intervallManager.updateReferences(this);
        }
    }

    /**
     * Sets up collision detection interval
     */
    initCollisionDetection() {
        this.collisionManager.startCollisionDetection();
    }

    /**
     * Checks if bottles are available to throw
     * @returns {boolean} True if bottles are available
     */
    hasAvailableBottles() {
        return this.throwableBottles.length > 0;
    }

    /**
     * Gets a bottle from the collection and prepares it for throwing
     * @returns {Object|null} The bottle object or null if none available
     */
    getBottleForThrowing() {
        if (!this.hasAvailableBottles()) {
            return null;
        }
        return this.throwableBottles.pop();
    }

    /**
     * Adds a bottle to the active throwable bottles array
     * @param {Object} bottle - The bottle being thrown
     */
    trackActiveBottle(bottle) {
        if (!this.activeThrowableBottles) {
            this.activeThrowableBottles = [];
        }
        this.activeThrowableBottles.push(bottle);
    }

    /**
     * Decrements bottle count and updates the UI
     */
    decrementBottleCount() {
        this.bottlesCollected--;
        this.updateBottleStatusBar();
    }

    /**
     * Resets the throw cooldown after a throw
     */
    resetThrowCooldown() {
        setTimeout(() => {
            this.throwInProgress = false;
        }, 300);
    }

    /**
     * Throws a bottle if available
     */
    throwBottle() {
        let bottle = this.getBottleForThrowing();

        if (bottle) {
            bottle.throw(this.character.x, this.character.y, this);
            this.trackActiveBottle(bottle);
            this.decrementBottleCount();
            this.resetThrowCooldown();
        }
    }

    /**
     * Updates the health status bar based on character energy
     */
    updateHealthStatusBar() {
        this.statusbarHealth.setPercentage(this.character.energy);
    }

    /**
     * Updates the coin status bar based on collected coins
     */
    updateCoinStatusBar() {
        let coinPercentage = (this.coinsCollected / 5) * 100;
        this.statusbarCoin.setCoinPercentage(Math.min(coinPercentage, 100));
    }

    /**
     * Updates the bottle status bar based on collected bottles
     */
    updateBottleStatusBar() {
        let maxBottles = 5;
        let bottlePercentage = (this.bottlesCollected / maxBottles) * 100;
        this.statusbarBottle.setBottlePercentage(bottlePercentage);
    }

    /**
     * Sets the bottle percentage for status bar display
     * @param {number} percentage - Percentage value to display
     */
    setBottlePercentage(percentage) {
        this.percentage = percentage;
        let path = this.STATUSBAR_BOTTLE[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Converts client coordinates to canvas coordinates
     * 
     * @param {number} clientX - Client X coordinate
     * @param {number} clientY - Client Y coordinate
     * @returns {Object} Object with x and y canvas coordinates
     */
    convertToCanvasCoordinates(clientX, clientY) {
        let rect = this.canvas.getBoundingClientRect();
        let scaleX = this.canvas.width / rect.width;
        let scaleY = this.canvas.height / rect.height;

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    }

    /**
     * Handles menu actions when the game hasn't started yet
     * 
     * @param {number} x - Canvas X coordinate
     * @param {number} y - Canvas Y coordinate
     */
    handleStartScreenActions(x, y) {
        if (this.startScreen.isPlayButtonClicked(x, y)) {
            this.startGame();
        } else if (this.startScreen.isGuitarButtonClicked(x, y)) {
            this.toggleBackgroundMusic();
        }
    }

    /**
     * Toggles the background music on/off
     * Delegates to the soundManager to handle the toggle functionality
     */
    toggleBackgroundMusic() {
        this.soundManager.toggleBackgroundMusic();
    }

    /**
     * Processes pointer events (mouse clicks or touch) on the canvas
     * 
     * @param {Event} event - The mouse or touch event containing clientX and clientY coordinates
     */
    handlePointerEvent(event) {
        let canvasCoords = this.convertToCanvasCoordinates(event.clientX, event.clientY);

        if (!this.gameStarted) {
            this.handleStartScreenActions(canvasCoords.x, canvasCoords.y);
        }
    }

    /**
     * Sets game state flags for a new game
     */
    initializeGameState() {
        this.gameStarted = true;
        this.gameOver = false;
    }

    /**
     * Updates UI elements for game mode
     */
    updateGameUI() {
        document.getElementById('soundBtn').classList.remove('d-none');
        document.getElementById('menuBtn').classList.remove('d-none');
        document.getElementById('mobileMenuBtn').classList.add('d-none');
        document.querySelector('.button-container').classList.add('d-none');
    }

    /**
     * Initializes the game level and related properties
     */
    initializeLevel() {
        initLevel1();
        this.level = level1;
        this.setWorld();
        this.totalCoins = this.level.coins.length;
        this.totalBottles = this.level.salsaBottles.length;
    }

    /**
     * Starts all game systems and animations
     */
    startGameSystems() {
        this.collisionManager.startCollisionDetection();
        setTimeout(() => {
            this.character.startAnimations();
        }, 150);
    }

    /**
     * Starts the game and initializes level
     */
    startGame() {
        this.initializeGameState();
        this.updateGameUI();
        this.initializeLevel();
        this.startGameSystems();
    }

    /**
     * Draws the game over screen
     */
    drawGameOverScreen() {
        this.gameOverScreen.draw(this.ctx);
    }

    /**
     * Main draw function, renders all game elements
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (!this.gameStarted) {
            this.startScreen.draw(this.ctx);
        } else {
            this.cleanupDeadEnemies();
            this.renderManager.drawGameElements();
            this.checkKeyboardStates();
        }
        this.checkGameStateAndContinue();
    }

    /**
     * Checks game state and continues animation loop if needed
     */
    checkGameStateAndContinue() {
        if (this.gameOver) {
            this.soundManager.stopAllBackgroundSounds();
            this.drawGameOverScreen();
        } else if (this.gameWon) {
            this.soundManager.stopAllBackgroundSounds();
            this.winScreen.draw(this.ctx);
        } else {
            let self = this;
            requestAnimationFrame(function () {
                self.draw();
            });
        }
    }

    /**
     * Stops all background music and sound effects in the game
     * Delegates to the soundManager to handle all audio stopping logic
     */
    stopAllBackgroundSounds() {
        this.soundManager.stopAllBackgroundSounds();
    }

    /**
     * Checks and processes keyboard input states for game actions
     */
    checkKeyboardStates() {
        if (this.keyboard.THROW && !this.throwCooldown && this.bottlesCollected > 0) {
            this.throwBottle();
            this.throwCooldown = true;
            setTimeout(() => {
                this.throwCooldown = false;
            }, 300);
        }
    }

    /**
     * Checks if character is invulnerable after jumping on enemy
     * @returns {boolean} True if character is currently invulnerable
     */
    isJumpInvulnerable() {
        let timeSinceJump = new Date().getTime() - (this.character.lastJumpOnEnemy || 0);
        return timeSinceJump < 1000;
    }

    /**
     * Checks win condition for the level
     */
    checkWinCondition() {
        if (this.level && this.level.enemies.length === 0) {
            this.gameOver = true;
            this.gameWon = true;
            this.intervallManager.clearAllGameIntervals();
            this.gameOverScreen.showWinLoseScreen('win');
        }

    }

    /**
    * Removes enemies marked for deletion from the game
    */
    cleanupDeadEnemies() {
        if (this.level && this.level.enemies) {
            this.level.enemies = this.level.enemies.filter(enemy => !enemy.toDelete);
            this.checkWinCondition();
        }
    }
}