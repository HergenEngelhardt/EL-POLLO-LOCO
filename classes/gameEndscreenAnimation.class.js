/**
 * Manages animation-related operations during game restart
 */
class RestartAnimationManager {
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
     * Reinitializes the character animations after game restart
     * @param {Character} character - The character object
     */
    reinitializeCharacterAnimations(character) {
        character.clearAnimationIntervals();
        this.scheduleCharacterAnimations(character);
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
}