class Coin extends MovableObject {
    constructor() {
        super().loadImage('/assets/img/8_coin/coin_1.png');
        this.x = 250 + Math.random() * 1000;
        this.y = 300 - Math.random() *  375;
        this.height = 180;
        this.width = 150;
    }
}