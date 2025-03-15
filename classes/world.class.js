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
        this.collisionManager = new CollisionManager(this);
        this.renderManager = new RenderManager(this, this.ctx);
        this.draw();
        this.setWorld();
        this.addKeyboardEvents();
        this.addMouseEvents();
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
    }

    /**
     * Sets up collision detection interval
     */
    initCollisionDetection() {
        this.collisionManager.startCollisionDetection();
    }

    /**
     * Throws a bottle if available
     */
    throwBottle() {
        if (this.throwableBottles.length > 0) {
            let bottle = this.throwableBottles.pop();
            bottle.throw(this.character.x, this.character.y, this);

            if (!this.activeThrowableBottles) {
                this.activeThrowableBottles = [];
            }
            this.activeThrowableBottles.push(bottle);

            this.bottlesCollected--;
            this.updateBottleStatusBar();
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
        let bottlePercentage = (this.bottlesCollected / this.totalInitialBottles) * 100;
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
     * Adds mouse event listeners for game controls
     */
    addMouseEvents() {
        this.canvas.addEventListener('click', (event) => {
            this.handlePointerEvent(event);
        });
        this.canvas.addEventListener('touchstart', (event) => {
            event.preventDefault();
            if (event.touches.length > 0) {
                let touch = event.touches[0];
                this.handlePointerEvent({
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });
            }
        });
    }

    /**
     * Processes pointer events (mouse clicks or touch) on the canvas
     * Converts client coordinates to canvas coordinates with proper scaling
     * Detects if the play button was clicked and starts the game accordingly
     * 
     * @param {Event} event - The mouse or touch event containing clientX and clientY coordinates
     */
    handlePointerEvent(event) {
        let rect = this.canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        let scaleX = this.canvas.width / rect.width;
        let scaleY = this.canvas.height / rect.height;
        x *= scaleX;
        y *= scaleY;

        if (!this.gameStarted) {
            if (this.startScreen.isPlayButtonClicked(x, y)) {
                this.startGame();
            } else if (this.startScreen.isGuitarButtonClicked(x, y)) {
                this.toggleBackgroundMusic();
            }
        }
    }

    /**
     * Starts the game and initializes level
     */
    startGame() {
        this.gameStarted = true;
        this.gameOver = false;
        document.getElementById('soundBtn').classList.remove('d-none');
        document.querySelector('.button-container').classList.add('d-none');
        initLevel1();
        this.level = level1;
        this.setWorld();
        this.totalCoins = this.level.coins.length;
        this.totalBottles = this.level.salsaBottles.length;
        this.collisionManager.startCollisionDetection();
        setTimeout(() => {
            this.character.startAnimations();
        }, 150);
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
            this.stopAllBackgroundSounds();
            this.drawGameOverScreen();
        } else if (this.gameWon) {
            this.stopAllBackgroundSounds();
            this.winScreen.draw(this.ctx);
        } else {
            let self = this;
            requestAnimationFrame(function () {
                self.draw();
            });
        }
    }

    /**
     * Checks and processes keyboard input states for game actions
     * Handles the bottle throwing action when the THROW key is activated
     * Calls either character's throwBottle method if available or falls back to world's implementation
     * Resets the keyboard state after processing
     */
    checkKeyboardStates() {
        if (this.keyboard.THROW) {
            if (typeof this.character.throwBottle === 'function') {
                this.character.throwBottle();
            } else {
                this.throwBottle();
            }
            this.keyboard.THROW = false;
        }
    }

    /**
     * Adds keyboard event listeners
     */
    addKeyboardEvents() {
        window.addEventListener('keydown', (event) => {
            if (event.code === 'ControlLeft') {
                this.character.throwBottle();
            }
        });
    }

    /**
    * Toggles background music on/off
    */
    toggleBackgroundMusic() {
        if (!SoundManager.sounds['backgroundMusic'] || SoundManager.sounds['backgroundMusic'].paused) {
            SoundManager.playBackgroundMusic();
        } else {
            SoundManager.stopBackgroundMusic();
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
            this.clearAllGameIntervals();
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


    /**
     * Stops all background sounds when game ends
     */
    stopAllBackgroundSounds() {
        if (this.character) {
            this.character.stopRunningSound();
            this.character.stopSnoringSound();
        }
        if (this.level && this.level.enemies) {
            this.level.enemies.forEach(enemy => {
                if (enemy instanceof ChickenBoss) {
                    enemy.playMovementSound = function () { };
                    if (enemy.alertSound) {
                        enemy.alertSound.pause();
                        enemy.alertSound.currentTime = 0;
                        enemy.alertSound = null;
                    }
                }
            });
        }
        SoundManager.stopBackgroundMusic();
        SoundManager.stopAll();
    }

    /**
     * Clears all game-related intervals properly
     */
    clearAllGameIntervals() {
        this.clearCharacterIntervals();
        this.clearEnemyIntervals();
        this.collisionManager.clearCollisionInterval();
        this.clearBottleIntervals();
    }

    /**
     * Clears character-specific animation intervals
     */
    clearCharacterIntervals() {
        if (this.character.animationInterval) {
            clearInterval(this.character.animationInterval);
            this.character.animationInterval = null;
        }

        if (this.character.imageAnimationInterval) {
            clearInterval(this.character.imageAnimationInterval);
            this.character.imageAnimationInterval = null;
        }
    }

    /**
     * Clears all enemy animation intervals
     */
    clearEnemyIntervals() {
        if (this.level && this.level.enemies) {
            this.level.enemies.forEach(enemy => {
                if (enemy.animationInterval) {
                    clearInterval(enemy.animationInterval);
                    enemy.animationInterval = null;
                }
            });
        }
    }

    /**
     * Clears all bottle-related intervals
     */
    clearBottleIntervals() {
        if (this.activeThrowableBottles) {
            this.activeThrowableBottles.forEach(bottle => {
                if (bottle.animationInterval) {
                    clearInterval(bottle.animationInterval);
                    bottle.animationInterval = null;
                }
                if (bottle.moveInterval) {
                    clearInterval(bottle.moveInterval);
                    bottle.moveInterval = null;
                }
            });
        }
    }

}