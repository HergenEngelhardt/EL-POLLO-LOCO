class Clouds extends MovableObject{


    constructor() {
        super().loadImage('/assets/img/5_background/layers/4_clouds/1.png');

        this.x = -100 + Math.random() * 800;
        this.animate();
        this.y = 0;
        this.width = 500;
        this.height = 250;

    }   


    animate() {
        this.moveLeft();
        setInterval(() => {
            this.x -= 0.25;
            if (this.x < -500) {
                this.x = 800;
            }
        }, 1000 / 60)
    }

}