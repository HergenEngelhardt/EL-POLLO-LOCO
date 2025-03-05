class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 1;
    energy = 100;
    lastHit = 0;
    offset = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    };


    applyGravity() {
        setInterval(() => {
            if(this.isAboveGround() || this.speedY > 0){
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 15);
    }

    isAboveGround() {
        return this.y < 180;
    }

    animateImages(images) {
            let i = this.currentImage % images.length;
            let path = images[i];
            this.img = this.imageCache[path];
            this.currentImage++;

    }

    jump() {
        this.speedY = 18;
        this.playJumpSound();
    }

    playJumpSound() {
        let audio = new Audio('./audio/jump.wav');
        audio.play().catch(error => {
            console.error('Error playing audio:', error);
        });
    }

    moveRight() {
        this.x += this.speed;

    }

    moveLeft() {

        this.x -= this.speed;
    }

    isColliding(mo) {
        return (this.x + this.offset.left + this.width - this.offset.right) >= (mo.x + mo.offset.left) && 
               (this.x + this.offset.left) <= (mo.x + mo.offset.left + mo.width - mo.offset.right) && 
               (this.y + this.offset.top + this.height - this.offset.bottom) >= (mo.y + mo.offset.top) &&
               (this.y + this.offset.top) <= (mo.y + mo.offset.top + mo.height - mo.offset.bottom);
    }
    
    isCollidingFromTop(mo) {
        return (this.x + this.offset.left + this.width - this.offset.right) > (mo.x + mo.offset.left) &&
               (this.x + this.offset.left) < (mo.x + mo.offset.left + mo.width - mo.offset.right) &&
               (this.y + this.offset.top + this.height - this.offset.bottom) < (mo.y + mo.offset.top + (mo.height - mo.offset.bottom) / 2) &&
               (this.y + this.offset.top + this.height - this.offset.bottom) > (mo.y + mo.offset.top) &&
               this.speedY < 0;
    }

    hit() {
        this.energy -= 20;
        this.playHitSound();
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    playHitSound() {
        let audio = new Audio('./audio/hit.wav');
        audio.play().catch(error => {
            console.error('Error playing audio:', error);
        });
    }

    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit;
        return timePassed < 1;
    }

    isDead() {
        return this.energy == 0;
    }
}