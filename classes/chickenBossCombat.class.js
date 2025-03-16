class ChickenBossCombat {
    constructor(boss) {
        this.boss = boss;
        this.attackCooldown = 0;
        this.lastHit = 0;
    }

    hit() {
        this.boss.energy -= 25;
        this.lastHit = new Date().getTime();
        if (this.boss.world && !this.boss.world.gameWon && !this.boss.world.gameOver) {
            this.playHitSound();
        }
        if (this.boss.energy < 0) {
            this.boss.energy = 0;
        }
        this.boss.healthBar.setPercentage(this.boss.energy);
    }

    playHitSound() {
        SoundManager.play('punch');
    }

    isDead() {
        return this.boss.energy <= 0;
    }

    isHurt() {
        const timeSinceHit = new Date().getTime() - this.lastHit;
        return timeSinceHit < 500;
    }

    checkCharacterCollision() {
        if (this.boss.isColliding(this.boss.world.character) && !this.boss.world.character.isHurt()) {
            this.boss.world.character.hit();
            this.boss.world.updateHealthStatusBar();
        }
    }

    handleAttackingBehavior(distanceToCharacter, characterIsLeft) {
        this.boss.animation.animateImages(this.boss.IMAGES_ATTACK);
        this.boss.movement.updateMovementDirection(characterIsLeft);
        this.boss.movement.applyMovement();
        if (this.boss.movement.canJump && Math.random() < 1.2) {
            this.boss.movement.jump();
        }
        this.checkAttackCollision(distanceToCharacter);
    }

    checkAttackCollision(distanceToCharacter) {
        if (distanceToCharacter < 80 && !this.boss.world.character.isHurt()) {
            this.boss.world.character.hit();
            this.boss.world.updateHealthStatusBar();
        }
    }

    updateHealthBarPosition() {
        this.boss.healthBar.x = this.boss.x + 20;
        this.boss.healthBar.y = this.boss.y - 30;
    }
}