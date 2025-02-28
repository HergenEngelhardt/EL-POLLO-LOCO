class ChickenSmall extends MovableObject{
    y = 355;
    height = 80;
    width = 50;
    IMAGES_WALKING = [ 
        'assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        '/assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    IMAGES_DEAD = [
        'assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ]

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.x = 250 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.5;
        this.loadImages(this.IMAGES_WALKING);
        this.animate();
    }

    animate() {
        setInterval(() => {

            this.moveLeft();
        
        }, 1000 / 60)


        setInterval(() => {
            this.animateImages(this.IMAGES_WALKING);
        }, 200);


    }

    }