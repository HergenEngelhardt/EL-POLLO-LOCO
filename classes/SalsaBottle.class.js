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
        this.speedY = 10; 
        this.speedX = 50; 
        this.applyGravity();
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.animateImages(this.IMAGES_ROTATE);
        }, 100);
    }

    splash() {
        this.loadImages(this.IMAGES_SPLASH);
        this.animateImages(this.IMAGES_SPLASH);
    }
}