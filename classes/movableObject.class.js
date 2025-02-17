class MovableObject {
    x = 40;
    y = 250;
    img;
    height = 150;
    width = 100;
    imageCache = {};
    currentImage = 0;
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

    loadImage(path) {
        this.img = new Image();
        this.img.src =  path;
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    }

    drawFrame(ctx) {

        if(this instanceof Character || this instanceof Chicken || this instanceof ChickenBoss || this instanceof SalsaBottle || this instanceof Coin){
        ctx.beginPath();
        ctx.lineWidth = "3";
        ctx.strokeStyle = "red";
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
    }}

    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    animateImages(images) {
            let i = this.currentImage % images.length;
            let path = images[i];
            this.img = this.imageCache[path];
            this.currentImage++;

    }

    jump() {
            this.speedY = 20;
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
        this.energy -= 10;
        if(this.energy < 0){
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit;
        //timePasse = timePassed / 1000; für Sekunden
        return timePassed < 5;
    }

    isDead() {
        return this.energy == 0;
    }
}