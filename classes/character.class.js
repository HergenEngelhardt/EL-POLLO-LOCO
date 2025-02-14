class Character extends MovableObject {
    y = 200;
    width = 150;
    height = 250;
    speed = 4;
    IMAGES_WALKING = [ 
        'assets/img/2_character_pepe/2_walk/W-21.png',
        'assets/img/2_character_pepe/2_walk/W-22.png',
        'assets/img/2_character_pepe/2_walk/W-23.png',
        'assets/img/2_character_pepe/2_walk/W-24.png',
        'assets/img/2_character_pepe/2_walk/W-25.png',
        'assets/img/2_character_pepe/2_walk/W-26.png'
    ];

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.currentImage = 0;
        this.world = {};

        this.animate();
    }

    animate() {
        setInterval(() => {
            if(this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x){
                this.x += this.speed;
                this.otherDirection = false;
            }
            
            if(this.world.keyboard.LEFT && this.x > 0){
                this.x -= this.speed;
                this.otherDirection = true;
            }
            this.world.camera_x = -this.x;
        }, 1000/175);


        setInterval(() => {
            if(this.world.keyboard.RIGHT || this.world.keyboard.LEFT){
                this.animateImgaes(this.IMAGES_WALKING);
            }
        }, 150);
    }

    jump() {

    }

    throwBottle() {

    }
}