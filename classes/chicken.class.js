class Chicken extends MovableObject{
    y = 335;
    height = 100;
    width = 80;
    isDead = false;

    IMAGES_WALKING = [ 
        '/assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        '/assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        '/assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    IMAGES_DEAD = [
        'assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ]

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.x = 250 + Math.random() * 800;
        this.speed = 0.15 + Math.random() * 0.5;
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.animate();
        this.offset = {
            top: 10,
            bottom: 0,
            left: 0,
            right: 0
        };
    }

    animate() {
        setInterval(() => {
            if (!this.isDead) {
                this.moveLeft();
            }
        }, 1000 / 60);

        setInterval(() => {
            if (this.isDead) {
                this.loadImage(this.IMAGES_DEAD[0]);
            } else {
                this.animateImages(this.IMAGES_WALKING);
            }
        }, 200);
    }

    die() {
        this.isDead = true;
        setTimeout(() => {
            this.toDelete = true;
        }, 1500);
    }

}