class SalsaBottle extends MovableObject {
    IMAGES_ROTATE = [
        'assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ]

    IMAGES_SPLASH = [
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
    ]

    constructor() {
        super().loadImage('/assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.x = 250 + Math.random() * 1000;
        this.y = 350;
        this.height = 100;
        this.width = 80;
    }

    throw(x, y) {
        this.loadImages(this.IMAGES_ROTATE);
        this.x = x;
        this.y = y;
        this.height = 100;
        this.width = 80;
        this.speedY = 15; 
        this.speedX = 15; 
        this.applyGravity();
        this.animate();
        this.move();
    }

    move() {
        this.moveInterval = setInterval(() => {
            this.x += this.speedX;
            this.y -= this.speedY;
            this.speedY -= 1; 
            if (this.y > 350) { 
                this.splash();
                clearInterval(this.moveInterval); 
            }
        }, 1000 / 60);
    }

    animate() {
        this.animationInterval = setInterval(() => {
            this.animateImages(this.IMAGES_ROTATE);
        }, 100);
    }

    splash() {
        this.loadImages(this.IMAGES_SPLASH);
        this.currentImage = 0;
        this.animateSplash();
    }
    
    animateSplash() {
        let splashInterval = setInterval(() => {
            this.currentImage++;
            if (this.currentImage >= this.IMAGES_SPLASH.length) {
                clearInterval(splashInterval);
                this.removeBottle();
            } else {
                this.img = this.imageCache[this.IMAGES_SPLASH[this.currentImage]];
            }
        }, 100);
    }
    
    removeBottle() {
        const index = this.world.throwableBottles.indexOf(this);
        if (index > -1) {
            this.world.throwableBottles.splice(index, 1);
        }
        this.img = null; 
        this.x = -1000; 
        this.y = -1000; 
    }
}