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
        this.winAudio = null;
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
            if (SoundManager.enabled) {
                SoundManager.play('winning', 0.2);
            }
            this.soundPlayed = true;
        }
    }

    /**
    * Stops the win sound if it's playing.
    */
    stopWinSound() {
        SoundManager.stop('winning');
    }

    /**
     * Draws the win screen on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    draw(ctx) {
        if (!ctx || !this.world) return;

        if (this.world.gameWon) {
            if (!this.screenDisplayed) {
                this.stopAllGameSounds();
                this.screenDisplayed = true;

                if (ctx && ctx.canvas) {
                    this.showWinScreen(ctx.canvas);
                }
            }

            ctx.drawImage(this.img, (ctx.canvas.width - this.width) / 2, (ctx.canvas.height - this.height) / 2, this.width, this.height);
            this.playWinSound();
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
        this.stopWinSound();
        this.stopAllGameSounds();

        if (this.world) {
            if (this.world.intervallManager) {
                this.world.intervallManager.clearAllGameIntervals();
            }
            this.resetAnimationCounters(this.world);
            this.resetGameAndWorldState(this.world);
        }

        let world = this.world || window.world;
        if (world) {
            this.startGameAndCollisionDetection(world);
        } else {
            this.handleMissingWorld();
        }
    }

    /**
     * Resets all game and world state when restarting.
     * @param {World} world - The game world object
     */
    resetGameAndWorldState(world) {
        if (world.intervallManager) {
            world.intervallManager.clearAllGameIntervals();
        }

        if (world.collisionInterval) {
            clearInterval(world.collisionInterval);
            world.collisionInterval = null;
        }

        if (world.collisionManager) {
            if (world.collisionManager.collisionInterval) {
                clearInterval(world.collisionManager.collisionInterval);
                world.collisionManager.collisionInterval = null;
            }
            world.collisionManager = new CollisionManager(world);
        }
        if (world.level && world.level.enemies) {
            world.level.enemies.forEach(enemy => {
                if (enemy instanceof ChickenBoss) {
                    if (enemy.alertSound) {
                        enemy.alertSound.pause();
                        enemy.alertSound.currentTime = 0;
                    }
                    if (enemy.animation) {
                        if (typeof enemy.animation.stopAllAnimations === 'function') {
                            enemy.animation.stopAllAnimations();
                        }
                    }
                }
            });
        }

        this.resetGameState(world);
        world.gameOver = false;
        world.gameWon = false;
        this.resetCharacterState(world);
        this.resetWorldState(world);
        this.reinitializeLevel(world);
    }

    /**
    * Resets animation counters to prevent speed-up on restart
    * @param {World} world - The game world object
    */
    resetAnimationCounters(world) {
        if (world.character) {
            world.character.currentImage = 0;
            world.character.jumpAnimationFrame = 0;
        }

        if (world.level && world.level.enemies) {
            world.level.enemies.forEach(enemy => {
                enemy.currentImage = 0;
                if (enemy instanceof ChickenBoss && enemy.animation) {
                    enemy.animation.deathAnimationIndex = 0;
                    enemy.animation.alertFrameCount = 0;
                }
            });
        }
    }

    /**
     * Starts the game and collision detection.
     * @param {World} world - The game world object
     */
    startGameAndCollisionDetection(world) {
        world.startGame();
        if (world.intervallManager) {
            world.intervallManager.updateReferences(world);
        }
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
        this.stopWinSound();
        location.reload();
    }

    /**
     * Stops all game sounds when the win screen is displayed.
     * This includes:
     * - All sounds managed by the SoundManager
     * - Character-specific running sound
     * - Specific game sounds (snoring and chickenboss)
     */
    stopAllGameSounds() {
        if (this.world && typeof this.world.stopAllSounds === 'function') {
            this.world.stopAllSounds();
            return;
        }
        SoundManager.stopAll();
        if (this.world && this.world.character) {
            if (this.world.character.runningSound) {
                this.world.character.runningSound.pause();
                this.world.character.runningSound.currentTime = 0;
            }
        }
        SoundManager.stop('chickenboss');
        SoundManager.stop('winning');
        SoundManager.stop('losing');
        SoundManager.stop('bossAlert');
        SoundManager.stop('snoring');
        SoundManager.stop('backgroundMusic');
        document.querySelectorAll('audio').forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
        ensureAllSoundsStopped();
    }

}