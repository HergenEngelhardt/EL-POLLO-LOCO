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
        this.animationManager = new RestartAnimationManager();
        this.enemyManager = new RestartEnemyManager();
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
     * Performs the game restart
     * @param {World} world - The game world object
     */
    performGameRestart(world) {
        this.enemyManager.forceStopAllBossSounds();
        this.prepareForRestart(world);
        this.scheduleGameStart(world);
    }

    /**
     * Stops all DOM audio elements
     */
    stopDomAudio() {
        document.querySelectorAll('audio').forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
    }

    /**
     * Prepares the game for restart
     * @param {World} world - The game world object
     */
    prepareForRestart(world) {
        this.parentScreen.soundManager.stopAllSounds();
        this.animationManager.clearGameIntervals(world);
        this.animationManager.resetAnimationCounters(world);
        this.animationManager.stopAllAnimations(world);
        this.prepareGameRestart(world);
    }

    /**
     * Schedules the game to start after a short delay
     * @param {World} world - The game world object
     */
    scheduleGameStart(world) {
        setTimeout(() => {
            this.startNewGame(world);
        }, 200);
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
        this.animationManager.clearGameIntervals(world);
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
        if (!world.collisionManager) return;
        
        this.clearCollisionInterval(world);
        this.createNewCollisionManager(world);
    }

    /**
     * Clears the collision detection interval
     * @param {World} world - The game world object
     */
    clearCollisionInterval(world) {
        if (!world.collisionManager.collisionInterval) return;
        
        clearInterval(world.collisionManager.collisionInterval);
        world.collisionManager.collisionInterval = null;
    }

    /**
     * Creates a new collision manager
     * @param {World} world - The game world object
     */
    createNewCollisionManager(world) {
        world.collisionManager = new CollisionManager(world);
        world.collisionManager.world = world;
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
        this.resetGameFlags(world);
        this.resetScreenFlags();
        this.clearCharacterAnimation(world);
    }

    /**
     * Resets game state flags
     * @param {World} world - The game world object
     */
    resetGameFlags(world) {
        world.gameOver = false;
        world.gameWon = false;
        world.gameStarted = true;
    }

    /**
     * Resets screen state flags
     */
    resetScreenFlags() {
        this.parentScreen.screenDisplayed = false;
        this.parentScreen.buttonsCreated = false;
        this.parentScreen.soundPlayed = false;
    }

    /**
     * Clears character animation interval
     * @param {World} world - The game world object
     */
    clearCharacterAnimation(world) {
        if (world.character && world.character.animationInterval) {
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
        this.animationManager.resetCharacterAnimationState(world.character);
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
        character.y = 190;
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
        if (character.gravityInterval) {
            clearInterval(character.gravityInterval);
            character.gravityInterval = null;
        }
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
        if (!this.initLevel1Exists()) return;
        
        initLevel1();
        this.setWorldLevel(world);
        this.updateGameUI(world);
    }

    /**
     * Checks if the initLevel1 function exists
     * @returns {boolean} Whether the function exists
     */
    initLevel1Exists() {
        return typeof initLevel1 === 'function';
    }

    /**
     * Sets the level in the world
     * @param {World} world - The game world object
     */
    setWorldLevel(world) {
        if (typeof level1 === 'undefined') return;
        
        world.level = level1;
        world.setWorld();
        this.enemyManager.initializeEnemies(world);
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
        this.updateWorldIntervalManager(world);
        this.initializeCollisionDetection(world);
        this.reinitializeCharacter(world);
        this.resetBottleThrowingMechanism(world);
    }

    /**
     * Updates the world's interval manager
     * @param {World} world - The game world object
     */
    updateWorldIntervalManager(world) {
        if (world.intervallManager) {
            world.intervallManager.updateReferences(world);
        }
    }

    /**
     * Reinitializes the character after game restart
     * @param {World} world - The game world object
     */
    reinitializeCharacter(world) {
        if (!world.character) return;
        
        this.animationManager.reinitializeCharacterAnimations(world.character);
    }

    /**
     * Reset the bottle throwing mechanism to ensure it works after restart
     * @param {World} world - The game world object 
     */
    resetBottleThrowingMechanism(world) {
        this.clearBottleArrays(world);
        this.addInitialBottles(world);
        world.updateBottleStatusBar();
    }

    /**
     * Clears bottle-related arrays
     * @param {World} world - The game world object
     */
    clearBottleArrays(world) {
        world.throwableBottles = [];
        world.bottlesCollected = 0;
        world.activeThrowableBottles = [];
    }

    /**
     * Adds initial bottles to the world
     * @param {World} world - The game world object
     */
    addInitialBottles(world) {
        for (let i = 0; i < world.initialBottleCount || 0; i++) {
            let bottle = new SalsaBottle();
            bottle.world = world;
            world.throwableBottles.push(bottle);
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
        this.tryStartGameFunction();
    }

    /**
     * Tries to use the startGame function as fallback
     */
    tryStartGameFunction() {
        try {
            if (typeof startGame === 'function') {
                startGame();
                return;
            }
        } catch (e) {
            console.error("Fallback failed:", e);
        }
        
        this.reloadAsLastResort();
    }

    /**
     * Reloads the page as a last resort
     */
    reloadAsLastResort() {
        console.warn("Using reload as last resort");
        location.reload();
    }
}