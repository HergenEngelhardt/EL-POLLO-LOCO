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
        this.draw();
        this.setWorld();
        this.addKeyboardEvents();
        this.addMouseEvents();
        this.checkCollisions();
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
    checkCollisions() {
        setInterval(() => {
            if (!this.level) return;
            if (this.character.energy <= 0) {
                this.gameOver = true;
                this.gameOverScreen.showWinLoseScreen('lose');
                return;
            }
            this.level.enemies = this.level.enemies.filter(enemy => !enemy.toDelete);
            this.handleEnemyCollisions();
            this.handleCoinCollisions();
            this.handleBottleCollisions();
            this.handleThrowableBottleCollisions();
            this.checkWinCondition();
        }, 100);
    }

    /**
     * Handles collisions between character and enemies
     */
    handleEnemyCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.speedY < 0 && this.character.isCollidingFromTop(enemy) && !enemy.isDead) {
                enemy.die();
                this.character.speedY = 15;
                this.character.lastJumpOnEnemy = new Date().getTime();
            } else if (this.character.isColliding(enemy) && !enemy.isDead && !this.isJumpInvulnerable()) {
                this.character.hit();
                this.updateHealthStatusBar();
            }
        });
    }

    /**
     * Handles collisions between character and coins
     */
    handleCoinCollisions() {
        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                coin.playCollectSound();
                this.level.coins.splice(index, 1);
                this.coinsCollected++;
                this.updateCoinStatusBar();
            }
        });
    }

    /**
     * Handles collisions between character and collectible bottles
     */
    handleBottleCollisions() {
        this.level.salsaBottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                this.level.salsaBottles.splice(index, 1);
                this.bottlesCollected++;
                let newBottle = new SalsaBottle();
                newBottle.world = this;
                this.throwableBottles.push(newBottle);
                this.updateBottleStatusBar();
            }
        });
    }

    /**
     * Handles collisions between thrown bottles and enemies
     */
    handleThrowableBottleCollisions() {
        if (!this.activeThrowableBottles) return;

        this.activeThrowableBottles.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {
                if (bottle.isColliding(enemy)) {
                    bottle.splash();
                    if (enemy instanceof ChickenBoss) {
                        enemy.hit();
                    } else {
                        enemy.toDelete = true;
                    }
                }
            });

            if (bottle.y > 350) {
                bottle.splash();
            }
        });
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
        let coinPercentage = (this.coinsCollected / this.level.coins.length) * 100;
        this.statusbarCoin.setCoinPercentage(coinPercentage);
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
            let rect = this.canvas.getBoundingClientRect();
            let x = event.clientX - rect.left;
            let y = event.clientY - rect.top;
            if (this.startScreen.isPlayButtonClicked(x, y)) {
                this.startGame();
            }
        });
    }

    /**
     * Starts the game and initializes level
     */
    startGame() {
        this.gameStarted = true;
        this.gameOver = false;
        initLevel1();
        this.level = level1;
        this.setWorld();
        this.totalCoins = this.level.coins.length;
        this.totalBottles = this.level.salsaBottles.length;
        this.character.startAnimations();
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
            this.drawGameElements();
        }
        this.checkGameStateAndContinue();
    }

    /**
    * Checks game state and continues animation loop if needed
    */
    checkGameStateAndContinue() {
        if (this.gameOver) {
            this.drawGameOverScreen();
        } else if (this.gameWon) {
            this.winScreen.draw(this.ctx);
        } else {
            let self = this;
            requestAnimationFrame(function () {
                self.draw();
            });
        }
    }

    /**
     * Draws all game world elements with camera offset
     */
    drawGameElements() {
        this.ctx.translate(this.camera_x, 0);
        this.drawWorldObjects();
        this.ctx.translate(-this.camera_x, 0);
        this.drawUIElements();

        if (this.character.energy <= 0) {
            this.drawGameOverScreen();
        }
    }

    /**
     * Draws background elements and game objects
     */
    drawWorldObjects() {
        this.addObjectsToMap(this.level.background || []);
        this.addObjectsToMap(this.level.clouds || []);
        this.addObjectsToMap(this.level.enemies || []);
        this.addObjectsToMap(this.level.coins || []);
        this.addObjectsToMap(this.level.salsaBottles || []);
        this.addObjectsToMap(this.activeThrowableBottles || []);
        this.addToMap(this.character);
    }

    /**
     * Draws UI elements like status bars
     */
    drawUIElements() {
        this.addToMap(this.statusbarHealth);
        this.addToMap(this.statusbarCoin);
        this.addToMap(this.statusbarBottle);
    }

    /**
     * Checks game state and continues animation loop if needed
     */
    checkGameStateAndContinue() {
        if (this.gameOver) {
            this.drawGameOverScreen();
        } else {
            let self = this;
            requestAnimationFrame(function () {
                self.draw();
            });
        }
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
            mo.drawFrame(this.ctx);
            mo.drawOffsetFrame(this.ctx);

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
            this.gameOverScreen.showWinLoseScreen('win');
        }
    }
}