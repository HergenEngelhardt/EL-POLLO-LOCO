class Clouds extends MovableObject{

    y = 0;
    width = 500;
    height = 250;
    constructor() {
        super().loadImage('/assets/img/5_background/layers/4_clouds/1.png');

        this.x = -100 + Math.random() * 800;

    }   


}