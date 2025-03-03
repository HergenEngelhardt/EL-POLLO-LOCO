class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 1;
    energy = 100;
    lastHit = 0;
    offsetY = 0; 
    offsetX = 0; 
    offsetWidth = 0;
    offsetHeight = 0;


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
        this.speedY = 15;
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

    isColliding (mo) {
        return (this.x + this.offsetX + this.width - this.offsetWidth) >= mo.x + mo.offsetX && 
        (this.x + this.offsetX) <= (mo.x + mo.offsetX + mo.width - mo.offsetWidth) && 
        (this.y + this.offsetY + this.height - this.offsetHeight) >= mo.y + mo.offsetY &&
        (this.y + this.offsetY) <= (mo.y + mo.offsetY + mo.height - mo.offsetHeight);
    }
    
    isCollidingFromTop(mo) {
        return (this.x + this.offsetX + this.width - this.offsetWidth) > (mo.x + mo.offsetX) &&
               (this.x + this.offsetX) < (mo.x + mo.offsetX + mo.width - mo.offsetWidth) &&
               (this.y + this.offsetY + this.height - this.offsetHeight) < (mo.y + mo.offsetY + (mo.height - mo.offsetHeight) / 2) &&
               (this.y + this.offsetY + this.height - this.offsetHeight) > (mo.y + mo.offsetY) &&
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