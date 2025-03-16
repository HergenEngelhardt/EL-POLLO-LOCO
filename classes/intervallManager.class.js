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
        this.character = world.character;
        this.level = world.level;
        this.collisionManager = world.collisionManager;
        this.activeThrowableBottles = world.activeThrowableBottles;
    }

    /**
     * Updates references when world state changes
     * @param {World} world - Reference to the world object
     */
    updateReferences(world) {
        this.character = world.character;
        this.level = world.level;
        this.activeThrowableBottles = world.activeThrowableBottles;
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
                this.clearBasicEnemyIntervals(enemy);

                if (enemy instanceof ChickenBoss) {
                    this.clearBossEnemyIntervals(enemy);
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