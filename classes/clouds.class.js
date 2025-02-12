class Clouds extends MovableObject{


    constructor() {
        super().loadImage('/assets/img/5_background/layers/4_clouds/1.png');

        this.x = -100 + Math.random() * 800;
        this.y = 0;
        this.width = 500;
        this.height = 250;

    }   


}