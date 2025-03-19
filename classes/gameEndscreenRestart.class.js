/**
 * Manages game restart functionality for game ending screens
 */
class GameEndScreenRestartManager {
    /**
     * Creates a new GameEndScreenRestartManager
     * @param {GameEndScreen} parentScreen - Reference to parent screen
     */
    constructor(parentScreen) {
        this.parentScreen = parentScreen;
    }

    /**
     * Main restart function that coordinates the restart process
     */
    restartGame() {
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
        return this.parentScreen.world || window.world;
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
     * Clears all game intervals if an interval manager exists
     * @param {World} world - The game world object 
     */
    clearGameIntervals(world) {
        if (world.intervallManager) {
            world.intervallManager.clearAllGameIntervals();
        }
    }

    /**
     * Prepares the game for restart by resetting all necessary states
     * @param {World} world - The game world object
     */
    prepareGameRestart(world) {
        this.parentScreen.soundManager.stopAllSounds();
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
     * Resets the game state.
     * @param {World} world - The game world object
     */
    resetGameState(world) {
        world.gameOver = false;
        world.gameWon = false;
        world.gameStarted = true;
        this.parentScreen.screenDisplayed = false;
        this.parentScreen.buttonsCreated = false;
        this.parentScreen.soundPlayed = false;

        if (world.character.animationInterval) {
            clearInterval(world.character.animationInterval);
        }
    }
    /**
     * Resets the character state.
     * @param {World} world - The game world object
     */
    resetCharacterState(world) {
        this.resetBasicCharacterProperties(world.character);
        this.resetJumpProperties(world.character);
        this.resetCharacterAnimationState(world.character);
        this.resetMovementProperties(world.character);
        this.reapplyCharacterPhysics(world.character);
    }

    /**
     * Resets basic character properties like health and position
     * @param {Character} character - The character object
     */
    resetBasicCharacterProperties(character) {
        character.energy = 100;
        character.deadAnimationPlayed = false;
        character.x = 100;
        character.y = 180;
        character.speedY = 0;
        character.otherDirection = false;
    }

    /**
     * Resets jump-related properties
     * @param {Character} character - The character object
     */
    resetJumpProperties(character) {
        character.isImmobilized = false;
        character.lastJumpOnEnemy = 0;
    }

    /**
     * Resets character animation state properties
     * @param {Character} character - The character object
     */
    resetCharacterAnimationState(character) {
        if (character.stateManager) {
            character.stateManager.jumpAnimationActive = false;
            character.stateManager.jumpAnimationFrame = 0;
            character.stateManager.jumpAnimationComplete = false;
            if (character.stateManager.jumpAnimationInterval) {
                clearInterval(character.stateManager.jumpAnimationInterval);
                character.stateManager.jumpAnimationInterval = null;
            }
        }
    }

    /**
     * Resets character movement properties
     * @param {Character} character - The character object
     */
    resetMovementProperties(character) {
        character.lastMoveTime = Date.now();
        character.lastBottleThrow = 0;
    }

    /**
     * Re-applies character physics
     * @param {Character} character - The character object
     */
    reapplyCharacterPhysics(character) {
        character.applyGravity();
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
     * Starts the new game and initializes collision detection
     * @param {World} world - The game world object
     */
    startNewGame(world) {
        world.startGame();
        if (world.intervallManager) {
            world.intervallManager.updateReferences(world);
        }
        this.initializeCollisionDetection(world);
        this.reinitializeCharacter(world);
    }

    /**
    * Reinitializes the character after game restart
    * @param {World} world - The game world object
    */
    reinitializeCharacter(world) {
        if (world.character) {
            world.character.clearAnimationIntervals();
            setTimeout(() => {
                world.character.startAnimations();
            }, 150);
        }
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
}