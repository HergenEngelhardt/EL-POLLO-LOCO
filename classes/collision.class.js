/**
 * Manages collision detection and handling between game entities
 */
class CollisionManager {
    constructor(world) {
        this.world = world;
        this.collisionInterval = null;
    }

    /**
    * Initiates collision detection interval that runs every 100ms
    * Handles various types of collisions when game is active
    */
    startCollisionDetection() {
        this.collisionInterval = setInterval(() => {
            if (!this.world.gameOver && !this.world.gameWon && !this.world.character.isDead()) {
                this.handleEnemyCollisions();
                this.handleCoinCollisions();
                this.handleBottleCollisions();
                this.handleThrowableBottleCollisions();
                this.world.checkWinCondition();
            }
        }, 100);
    }

    /**
     * Handles collisions between the character and enemies
     * Processes both jumping on enemies and taking damage from enemies
     */
    handleEnemyCollisions() {
        if (!this.world.level || !this.world.level.enemies) return;
        let isJumpingOnEnemy = this.handleJumpOnEnemies();
        this.handleEnemyDamageToCharacter(isJumpingOnEnemy);
    }

    /**
     * Handles the character jumping on enemies
     * @returns {boolean} True if character is currently jumping on any enemy
     */
    handleJumpOnEnemies() {
        let isJumpingOnEnemy = false;

        this.world.level.enemies.forEach((enemy) => {
            if (this.world.character.speedY < 0 && this.world.character.isCollidingFromTop(enemy) && !enemy.isDead) {
                enemy.die();
                SoundManager.play('chickenDeath');
                this.world.character.speedY = 8;
                this.world.character.lastJumpOnEnemy = new Date().getTime();
                this.world.character.jumpAnimationActive = true;
                this.world.character.jumpAnimationFrame = 0;
                this.world.character.jumpAnimationComplete = false;

                isJumpingOnEnemy = true;
            }
        });

        return isJumpingOnEnemy;
    }

    /**
     * Handles damage to character from enemy collisions
     * @param {boolean} isJumpingOnEnemy - Whether the character is currently jumping on any enemy
     */
    handleEnemyDamageToCharacter(isJumpingOnEnemy) {
        let jumpSafePeriod = 500;
        let safeFromJumpingOnEnemy =
            this.world.character.lastJumpOnEnemy &&
            new Date().getTime() - this.world.character.lastJumpOnEnemy < jumpSafePeriod;

        if (!isJumpingOnEnemy && !safeFromJumpingOnEnemy && !this.world.isJumpInvulnerable() && !this.world.character.isHurt()) {
            this.world.level.enemies.forEach((enemy) => {
                if (this.world.character.isColliding(enemy) && !enemy.isDead) {
                    this.world.character.hit();
                    this.world.updateHealthStatusBar();
                    return;
                }
            });
        }
    }

    /**
     * Handles collisions between the character and coins
     * Removes collected coins and updates the coin counter
     */
    handleCoinCollisions() {
        if (!this.world.level || !this.world.level.coins) return;
        this.world.level.coins.forEach((coin, index) => {
            if (this.world.character.isColliding(coin) && this.world.coinsCollected < 5) {
                coin.playCollectSound();
                this.world.level.coins.splice(index, 1);
                this.world.coinsCollected++;
                this.world.updateCoinStatusBar();
            }
        });
    }

    /**
     * Handles collisions between the character and collectable salsa bottles
     * Removes collected bottles and adds them to throwable bottles inventory
     */
    handleBottleCollisions() {
        if (!this.world.level || !this.world.level.salsaBottles) return;
        this.world.level.salsaBottles.forEach((bottle, index) => {
            if (this.world.character.isColliding(bottle) &&
                (!this.world.character.isAboveGround() || this.world.character.speedY > 0) && this.world.bottlesCollected < this.world.totalInitialBottles) {
                bottle.playCollectSound();
                this.world.level.salsaBottles.splice(index, 1);
                this.world.bottlesCollected++;
                let newBottle = new SalsaBottle();
                newBottle.world = this.world;
                this.world.throwableBottles.push(newBottle);
                this.world.updateBottleStatusBar();
            }
        });
    }

/**
 * Handles collisions between thrown bottles and enemies or ground
 */
handleThrowableBottleCollisions() {
    if (!this.world.activeThrowableBottles || !this.world.level || !this.world.level.enemies) return;

    for (let i = this.world.activeThrowableBottles.length - 1; i >= 0; i--) {
        let bottle = this.world.activeThrowableBottles[i];
        
        if (bottle.isSplashing) continue;
        if (this.checkBottleEnemyCollision(bottle, i)) continue;
        this.checkBottleGroundCollision(bottle, i);
    }
}

    /**
     * Checks if a bottle collides with any enemy
     * @param {object} bottle - The bottle to check
     * @param {number} bottleIndex - Index of the bottle in activeThrowableBottles array
     * @returns {boolean} - True if bottle hit an enemy
     */
    checkBottleEnemyCollision(bottle, bottleIndex) {
        for (let enemy of this.world.level.enemies) {
            if (bottle.isColliding(enemy)) {
                this.processBottleHit(bottle, enemy, bottleIndex);
                return true;
            }
        }
        return false;
    }

    /**
     * Processes the actions when a bottle hits an enemy
     * @param {object} bottle - The bottle that hit
     * @param {object} enemy - The enemy that was hit
     * @param {number} bottleIndex - Index of the bottle in activeThrowableBottles array
     */
    processBottleHit(bottle, enemy, bottleIndex) {
        if (bottle.isSplashing) return;
        bottle.isSplashing = true;
        
        // Let the enemy take damage
        if (enemy instanceof ChickenBoss) {
            enemy.hit();
        } else {
            enemy.hitByBottle();
        }
        bottle.splash();
    }

    /**
     * Checks if a bottle hits the ground
     * @param {object} bottle - The bottle to check
     * @param {number} bottleIndex - Index of the bottle in activeThrowableBottles array
     */
    checkBottleGroundCollision(bottle, bottleIndex) {
        if (bottle.y > 350 && !bottle.isSplashing) {
            bottle.isSplashing = true;
            bottle.splash();
        }
    }

    /**
     * Clears the collision detection interval
     * Called when game ends or needs to stop collision checks
     */
    clearCollisionInterval() {
        if (this.collisionInterval) {
            clearInterval(this.collisionInterval);
            this.collisionInterval = null;
        }
    }
}