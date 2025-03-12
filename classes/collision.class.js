class CollisionManager {
    constructor(world) {
        this.world = world;
        this.collisionInterval = null;
    }

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

    handleEnemyCollisions() {
        if (!this.world.level || !this.world.level.enemies) return;
        let isJumpingOnEnemy = false;
        this.world.level.enemies.forEach((enemy) => {
            if (this.world.character.speedY < 0 && this.world.character.isCollidingFromTop(enemy) && !enemy.isDead) {
                enemy.die();
                this.world.character.speedY = 15;
                this.world.character.lastJumpOnEnemy = new Date().getTime();
                isJumpingOnEnemy = true;
            }
        });
        let jumpSafePeriod = 500;
        let safeFromJumpingOnEnemy =
            this.world.character.lastJumpOnEnemy &&
            new Date().getTime() - this.world.character.lastJumpOnEnemy < jumpSafePeriod;

        if (!isJumpingOnEnemy && !safeFromJumpingOnEnemy && !this.world.isJumpInvulnerable()) {
            this.world.level.enemies.forEach((enemy) => {
                if (this.world.character.isColliding(enemy) && !enemy.isDead) {
                    this.world.character.hit();
                    this.world.updateHealthStatusBar();
                    return;
                }
            });
        }
    }

    handleCoinCollisions() {
        if (!this.world.level || !this.world.level.coins) return;
        this.world.level.coins.forEach((coin, index) => {
            if (this.world.character.isColliding(coin)) {
                coin.playCollectSound();
                this.world.level.coins.splice(index, 1);
                this.world.coinsCollected++;
                this.world.updateCoinStatusBar();
            }
        });
    }

    handleBottleCollisions() {
        if (!this.world.level || !this.world.level.salsaBottles) return;
        this.world.level.salsaBottles.forEach((bottle, index) => {
            if (this.world.character.isColliding(bottle) &&
                (!this.world.character.isAboveGround() || this.world.character.speedY > 0)) {
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

    handleThrowableBottleCollisions() {
        if (!this.world.activeThrowableBottles || !this.world.level || !this.world.level.enemies) return;
        
        this.world.activeThrowableBottles.forEach((bottle) => {
            this.world.level.enemies.forEach((enemy) => {
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

    clearCollisionInterval() {
        if (this.collisionInterval) {
            clearInterval(this.collisionInterval);
            this.collisionInterval = null;
        }
    }
}