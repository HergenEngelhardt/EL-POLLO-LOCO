class Character extends MovableObject {
    y = 200;
    width = 150;
    height = 250;
    speed = 4;
    IMAGES_WALKING = [ 
        '/assets/img/2_character_pepe/2_walk/W-21.png',
        '/assets/img/2_character_pepe/2_walk/W-22.png',
        '/assets/img/2_character_pepe/2_walk/W-23.png',
        '/assets/img/2_character_pepe/2_walk/W-24.png',
        '/assets/img/2_character_pepe/2_walk/W-25.png',
        '/assets/img/2_character_pepe/2_walk/W-26.png'
    ];

    IMAGES_JUMPING = [
        '/assets/img/2_character_pepe/3_jump/J-31.png',
        '/assets/img/2_character_pepe/3_jump/J-32.png',
        '/assets/img/2_character_pepe/3_jump/J-33.png',
        '/assets/img/2_character_pepe/3_jump/J-34.png',
        '/assets/img/2_character_pepe/3_jump/J-35.png',
        '/assets/img/2_character_pepe/3_jump/J-36.png',
        '/assets/img/2_character_pepe/3_jump/J-37.png',
        '/assets/img/2_character_pepe/3_jump/J-38.png',
        '/assets/img/2_character_pepe/3_jump/J-39.png'
    ];

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.applyGravity()
        this.currentImage = 0;
        this.world = {};

        this.animate();
    }

    animate() {

        if(this.isAboveGround()){
            this.animateImgaes(this.IMAGES_JUMPING);
        } else{

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
    }}

    jump() {

    }

    throwBottle() {

    }
}