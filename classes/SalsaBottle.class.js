class SalsaBottle extends MovableObject {
    constructor() {
        super().loadImage('/assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.x = 250 + Math.random() * 1000;
        this.y = 350;
        this.height = 100;
        this.width = 80;
    }


}