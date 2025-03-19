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
     * Performs the game restart
     * @param {World} world - The game world object
     */
    performGameRestart(world) {
        this.forceStopAllBossSounds();
        this.prepareForRestart(world);
        this.scheduleGameStart(world);
    }

    /**
     * Stellt sicher, dass alle Boss-Sounds komplett gestoppt werden
     */
    forceStopAllBossSounds() {
        this.stopBossSounds();
        this.rebuildBossSounds();
        this.stopDomAudio();
    }

    /**
     * Stops boss-related sounds
     */
    stopBossSounds() {
        SoundManager.stop('chickenboss');
        SoundManager.stop('bossAlert');
    }

    /**
     * Rebuilds boss sound objects
     */
    rebuildBossSounds() {
        if (SoundManager.sounds && SoundManager.sounds['chickenboss']) {
            SoundManager.sounds['chickenboss'] = new Audio('./audio/chickenboss.mp3');
        }
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
        this.clearGameIntervals(world);
        this.resetAnimationCounters(world);
        this.stopAllAnimations(world);
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
     * Stops all ongoing animations
     * @param {World} world - The game world object
     */
    stopAllAnimations(world) {
        this.stopCharacterAnimations(world);
        this.stopEnemyAnimations(world);
    }

    /**
     * Stops all character animations
     * @param {World} world - The game world object
     */
    stopCharacterAnimations(world) {
        if (!world.character) return;
        
        this.clearCharacterInterval(world.character, 'animationInterval');
        this.clearCharacterInterval(world.character, 'imageAnimationInterval');
        this.clearJumpAnimationInterval(world.character);
    }

    /**
     * Clears a specific interval on the character
     * @param {Character} character - The character object
     * @param {string} intervalName - Name of the interval property
     */
    clearCharacterInterval(character, intervalName) {
        if (!character[intervalName]) return;
        
        clearInterval(character[intervalName]);
        character[intervalName] = null;
    }

    /**
     * Clears the jump animation interval
     * @param {Character} character - The character object
     */
    clearJumpAnimationInterval(character) {
        if (!character.stateManager || !character.stateManager.jumpAnimationInterval) return;
        
        clearInterval(character.stateManager.jumpAnimationInterval);
        character.stateManager.jumpAnimationInterval = null;
    }

    /**
     * Stops all enemy animations
     * @param {World} world - The game world object
     */
    stopEnemyAnimations(world) {
        if (!world.level || !world.level.enemies) return;
        
        world.level.enemies.forEach(enemy => {
            this.clearEnemyIntervals(enemy);
        });
    }

    /**
     * Clears all intervals on an enemy
     * @param {MovableObject} enemy - The enemy object
     */
    clearEnemyIntervals(enemy) {
        this.clearIntervalIfExists(enemy, 'animationInterval');
        this.clearIntervalIfExists(enemy, 'moveInterval');
        this.clearIntervalIfExists(enemy, 'animateInterval');
    }

    /**
     * Clears an interval if it exists on an object
     * @param {Object} obj - The object with the interval
     * @param {string} intervalName - Name of the interval property
     */
    clearIntervalIfExists(obj, intervalName) {
        if (!obj[intervalName]) return;
        
        clearInterval(obj[intervalName]);
        obj[intervalName] = null;
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
        if (!character.stateManager) return;
        
        this.resetAnimationFlags(character);
        this.clearAnimationInterval(character);
    }

    /**
     * Resets animation state flags
     * @param {Character} character - The character object
     */
    resetAnimationFlags(character) {
        character.stateManager.jumpAnimationActive = false;
        character.stateManager.jumpAnimationFrame = 0;
        character.stateManager.jumpAnimationComplete = false;
    }

    /**
     * Clears the jump animation interval
     * @param {Character} character - The character object
     */
    clearAnimationInterval(character) {
        if (!character.stateManager.jumpAnimationInterval) return;
        
        clearInterval(character.stateManager.jumpAnimationInterval);
        character.stateManager.jumpAnimationInterval = null;
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
        this.initializeEnemies(world);
    }

    /**
     * Initializes enemies after level reset
     * @param {World} world - The game world object
     */
    initializeEnemies(world) {
        if (!world.level || !world.level.enemies) return;
        
        world.level.enemies.forEach(enemy => {
            this.initializeSingleEnemy(enemy, world);
        });
    }

    /**
     * Initializes a single enemy
     * @param {MovableObject} enemy - The enemy object
     * @param {World} world - The game world
     */
    initializeSingleEnemy(enemy, world) {
        this.setEnemyWorldReference(enemy, world);
        
        if (enemy instanceof Chicken || enemy instanceof ChickenSmall) {
            this.resetChickenEnemy(enemy);
        } else if (enemy instanceof ChickenBoss) {
            this.resetChickenBoss(enemy);
        }
    }

    /**
     * Sets the world reference for an enemy
     * @param {MovableObject} enemy - The enemy object
     * @param {World} world - The game world
     */
    setEnemyWorldReference(enemy, world) {
        if (typeof enemy.setWorld === 'function') {
            enemy.setWorld(world);
        }
    }

    /**
     * Resets properties of a chicken enemy
     * @param {Chicken|ChickenSmall} enemy - The chicken enemy
     */
    resetChickenEnemy(enemy) {
        enemy.isDead = false;
        enemy.toDelete = false;
        this.resetChickenOffset(enemy);
    }

    /**
     * Resets properties of the ChickenBoss
     * @param {ChickenBoss} boss - The ChickenBoss enemy
     */
    resetChickenBoss(boss) {
        boss.reset();
    }

    /**
     * Resets the offset for collision detection of a chicken enemy
     * @param {Chicken|ChickenSmall} enemy - The chicken enemy
     */
    resetChickenOffset(enemy) {
        enemy.offset = {
            top: enemy instanceof ChickenSmall ? 5 : 10,
            bottom: 10,
            left: 5,
            right: 5
        };
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
        
        world.character.clearAnimationIntervals();
        this.scheduleCharacterAnimations(world.character);
    }

    /**
     * Schedules character animations to start
     * @param {Character} character - The character object
     */
    scheduleCharacterAnimations(character) {
        setTimeout(() => {
            character.startAnimations();
        }, 150);
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