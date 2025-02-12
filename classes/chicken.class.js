class Chicken extends MovableObject{
    y = 365;
    height = 80;
    width = 50;
    IMAGES_WALKING_CHICKEN = [ 
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    constructor() {
        super().loadImage('/assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.x = 250 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.5;
        this.loadImages(this.IMAGES_WALKING_CHICKEN);
        this.animate();
    }

    animate() {
        this.moveLeft();
        setInterval(() => {
            let i = this.currentImage % this.IMAGES_WALKING_CHICKEN.length;
            let path = this.IMAGES_WALKING_CHICKEN[i];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, 200);


    }

    }