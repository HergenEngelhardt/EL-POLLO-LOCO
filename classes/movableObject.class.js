class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 1;
    energy = 100;
    lastHit = 0;


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
    }

    moveRight() {
        this.x += this.speed;

    }

    moveLeft() {

        this.x -= this.speed;
    }

    isColliding (mo) {
        // return  (this.x + this.width) >= mo.x && this.x <= (mo.x + mo.width) && 
        //         (this.y + this.offsetY + this.height) >= mo.y &&
        //         (this.y + this.offsetY) <= (mo.y + mo.height);

        return this.x + this.width > mo.x &&
               this.y + this.height > mo.y &&
               this.x < mo.x &&
               this.y < mo.y + mo.height;
    }

    hit() {
        this.energy -= 20;
        if(this.energy < 0){
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit;
        return timePassed < 1;
    }

    isDead() {
        return this.energy == 0;
    }
}