class ChickenBossMovement {
    constructor(boss) {
        this.boss = boss;
        this.movingDirection = -1;
        this.lastDirectionChange = 0;
        this.canJump = true;
        this.isJumping = false;
        this.jumpCooldown = 0;
        this.jumpSpeed = 25;
    }

    updateMovementDirection(characterIsLeft) {
        this.movingDirection = characterIsLeft ? -1 : 1;
        this.boss.otherDirection = !characterIsLeft;
    }

    applyMovement() {
        this.moveBasedOnDirection();
        this.playMovementSound();
        this.handleJumpingIfNeeded();
    }

    moveBasedOnDirection() {
        if (this.movingDirection > 0) {
            this.boss.x += this.boss.speed;
            this.boss.otherDirection = true;
        } else {
            this.boss.x -= this.boss.speed;
            this.boss.otherDirection = false;
        }
    }

    handleJumpingIfNeeded() {
        if (this.isJumping) {
            this.updateJumpPhysics();
        }

        this.updateJumpCooldown();
    }

    updateJumpPhysics() {
        this.boss.y -= this.jumpSpeed;
        this.jumpSpeed -= this.boss.acceleration;
        if (this.boss.y >= 80) {
            this.boss.y = 80;
            this.isJumping = false;
            this.jumpCooldown = 30;
        }
    }

    updateJumpCooldown() {
        if (this.jumpCooldown > 0) {
            this.jumpCooldown--;
            this.canJump = false;
        } else {
            this.canJump = true;
        }
    }

    tryToJump() {
        if (this.canJump && Math.random() < 0.03) {
            this.jump();
        }
    }

    jump() {
        if (!this.isJumping && this.canJump) {
            this.isJumping = true;
            this.jumpSpeed = 10;
            this.boss.acceleration = 1.8;
            this.boss.speed *= 1.2;
            setTimeout(() => {
                this.boss.speed = 15;
            }, 1000);
        }
    }

    playMovementSound() {
        let now = new Date().getTime();

        if (!this.boss.isDead() && (!this.lastMovementSoundTime || now - this.lastMovementSoundTime > 1000)) {
            SoundManager.play('chickenboss', 0.3);
            this.lastMovementSoundTime = now;
        }
    }
}