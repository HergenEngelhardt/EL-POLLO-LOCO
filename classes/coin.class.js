class Coin extends MovableObject {
    constructor() {
        super().loadImage('/assets/img/8_coin/coin_1.png');
        this.x = 150 + Math.random() * 1175;
        this.y = 290 - Math.random() *  200;
        this.height = 100;
        this.width = 100;
    }
}