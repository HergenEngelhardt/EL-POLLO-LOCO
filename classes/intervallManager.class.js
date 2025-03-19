/**
 * Manages and clears all game intervals
 * @class
 */
class IntervallManager {
    /**
     * Creates an IntervallManager instance
     * @param {World} world - Reference to the world object
     */
    constructor(world) {
        this.world = world;
        this.character = world.character;
        this.level = world.level;
        this.collisionManager = world.collisionManager;
        this.activeThrowableBottles = world.activeThrowableBottles;
        this.intervalRegistry = [];
    }

    /**
    * Registers an interval for tracking
    * @param {number} intervalId - The interval ID to register
    * @returns {number} The same interval ID
    */
    registerInterval(intervalId) {
        this.intervalRegistry.push(intervalId);
        return intervalId;
    }

    /**
     * Clears all registered intervals
     */
    clearAllIntervals() {
        this.intervalRegistry.forEach(id => {
            clearInterval(id);
        });
        this.intervalRegistry = [];
    }

    /**
     * Updates references when world state changes
     * @param {World} world - Reference to the world object
     */
    updateReferences(world) {
        this.world = world;
        this.character = world.character;
        this.level = world.level;
        this.collisionManager = world.collisionManager;
        this.activeThrowableBottles = world.activeThrowableBottles;
    }


    /**
    * Clears all game-related intervals properly
    */
    clearAllGameIntervals() {
        this.clearCharacterIntervals();
        this.clearEnemyIntervals();
        this.clearBottleIntervals();
        this.clearCollisionIntervals();
        this.clearBackgroundIntervals();
        this.clearGravityIntervals();

        if (this.world) {
            if (this.world.drawInterval) {
                clearInterval(this.world.drawInterval);
                this.world.drawInterval = null;
            }
        }
        this.clearAllIntervals();
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
                this.clearBasicEnemyIntervals(enemy);

                if (enemy instanceof ChickenBoss) {
                    this.clearBossEnemyIntervals(enemy);
                }
            });
        }
    }

    /**
    * Clears collision-related intervals
    */
    clearCollisionIntervals() {
        if (this.collisionManager && this.collisionManager.collisionInterval) {
            clearInterval(this.collisionManager.collisionInterval);
            this.collisionManager.collisionInterval = null;
        }
    }

    /**
     * Clears gravity intervals on all movable objects
     */
    clearGravityIntervals() {
        this.clearCharacterGravityInterval();
        this.clearEnemyGravityIntervals();
        this.clearBottleGravityIntervals();
    }

    /**
     * Clears the character's gravity interval
     */
    clearCharacterGravityInterval() {
        if (this.character && this.character.gravityInterval) {
            clearInterval(this.character.gravityInterval);
            this.character.gravityInterval = null;
        }
    }

    /**
     * Clears gravity intervals for all enemies
     */
    clearEnemyGravityIntervals() {
        if (this.level && this.level.enemies) {
            this.level.enemies.forEach(enemy => {
                if (enemy.gravityInterval) {
                    clearInterval(enemy.gravityInterval);
                    enemy.gravityInterval = null;
                }
            });
        }
    }

    /**
     * Clears gravity intervals for all throwable bottles
     */
    clearBottleGravityIntervals() {
        if (this.activeThrowableBottles) {
            this.activeThrowableBottles.forEach(bottle => {
                if (bottle.gravityInterval) {
                    clearInterval(bottle.gravityInterval);
                    bottle.gravityInterval = null;
                }
            });
        }
    }
    /**
     * Clears background-related intervals
     */
    clearBackgroundIntervals() {
        if (this.level && this.level.clouds) {
            this.level.clouds.forEach(cloud => {
                if (cloud.animationInterval) {
                    clearInterval(cloud.animationInterval);
                    cloud.animationInterval = null;
                }
            });
        }
    }

    /**
     * Clears basic animation intervals for any enemy type
     * @param {MovableObject} enemy - The enemy object
     */
    clearBasicEnemyIntervals(enemy) {
        if (enemy.animationInterval) {
            clearInterval(enemy.animationInterval);
            enemy.animationInterval = null;
        }
        if (enemy.moveInterval) {
            clearInterval(enemy.moveInterval);
            enemy.moveInterval = null;
        }

        if (enemy.animateInterval) {
            clearInterval(enemy.animateInterval);
            enemy.animateInterval = null;
        }
    }

    /**
     * Clears ChickenBoss-specific intervals and sounds
     * @param {ChickenBoss} boss - The boss enemy object
     */
    clearBossEnemyIntervals(boss) {
        if (boss.attackInterval) {
            clearInterval(boss.attackInterval);
            boss.attackInterval = null;
        }

        if (boss.alertSound) {
            boss.alertSound.pause();
            boss.alertSound.currentTime = 0;
            boss.alertSound = null;
        }

        if (boss.movementSoundInterval) {
            clearInterval(boss.movementSoundInterval);
            boss.movementSoundInterval = null;
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