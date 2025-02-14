class Chicken extends MovableObject{
    y = 365;
    height = 80;
    width = 50;
    IMAGES_WALKING = [ 
        '/assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        '/assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        '/assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.x = 250 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.5;
        this.loadImages(this.IMAGES_WALKING);
        this.animate();
    }

    animate() {
        this.moveLeft();
        setInterval(() => {
            this.animateImgaes(this.IMAGES_WALKING);
        }, 200);


    }

    }