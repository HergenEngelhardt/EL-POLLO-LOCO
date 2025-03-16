class ChickenBossAnimation {
    constructor(boss) {
        this.boss = boss;
        this.deathAnimationIndex = 0;
        this.deathAnimationPlayed = false;
        this.alertFrameCount = 0;
    }

    animate() {
        this.boss.setupAnimationLoop();
    }

    handleAlertPhase(characterIsLeft) {
        this.boss.otherDirection = !characterIsLeft;
        this.animateImages(this.boss.IMAGES_ALERT);
        this.alertFrameCount++;

        if (this.alertFrameCount >= 12) {
            this.boss.alertPhase = false;
            this.boss.showHealthBar = true;
            if (this.boss.alertSound) {
                this.boss.alertSound.pause();
                this.boss.alertSound.currentTime = 0;
            }
        }
    }

    handleDeathState() {
        if (!this.deathAnimationPlayed) {
            this.playDeathAnimation();
        }
    }

    handleHurtState() {
        this.animateImages(this.boss.IMAGES_HURT);
    }

    playDeathAnimation() {
        let deathInterval = setInterval(() => {
            if (this.deathAnimationIndex >= this.boss.IMAGES_DEAD.length) {
                clearInterval(deathInterval);
                this.deathAnimationPlayed = true;
                this.boss.toDelete = true;

                if (this.boss.world) {
                    this.boss.world.gameWon = true;
                }

                return;
            }

            let path = this.boss.IMAGES_DEAD[this.deathAnimationIndex];
            this.boss.img = this.boss.imageCache[path];
            this.deathAnimationIndex++;
        }, 200);
    }

    animateImages(images) {
        let i = this.boss.currentImage % images.length;
        let path = images[i];
        this.boss.img = this.boss.imageCache[path];
        this.boss.currentImage++;
    }

    handleIdleState() {
        this.boss.img = this.boss.imageCache[this.boss.IMAGES_WALKING[0]];
    }
}