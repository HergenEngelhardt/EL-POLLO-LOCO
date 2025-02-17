class ChickenBoss extends MovableObject{
    y = 80;
    height = 400;
    width = 220;
    x = 1700;
    IMAGES_WALKING = [ 
        '/assets/img/4_enemie_boss_chicken/1_walk/G1.png',
        '/assets/img/4_enemie_boss_chicken/1_walk/G2.png',
        '/assets/img/4_enemie_boss_chicken/1_walk/G3.png',
        '/assets/img/4_enemie_boss_chicken/1_walk/G4.png',
    ];

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.speed = 0.15 + Math.random() * 0.5;
        this.loadImages(this.IMAGES_WALKING);
        this.animate();
    }

    animate() {
       
        setInterval(() => {
            this.moveLeft();
            this.animateImages(this.IMAGES_WALKING);
        }, 200);


    }

}