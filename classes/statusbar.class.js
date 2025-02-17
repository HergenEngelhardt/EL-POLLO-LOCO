class Statusbar extends MovableObject{
    STATUSBAR_HEALTH = [ 
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png'
    ];

    STATUSBAR_COIN = [
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png',        
    ];
    percantage;
    type;

    constructor(type, x, y) {
        super();
        this.type = type;
        this.x = x;
        this.y = y;
        this.width = 200;
        this.height = 60;
        this.loadImages(this.setImageType());
        this.setPercentage(this.setStartPercentage());
    };

    setImageType() {
        if (this.type === "health") {
            return this.STATUSBAR_HEALTH;
        } else if (this.type === "coin") {
            return this.STATUSBAR_COIN;
        }
    };

    setStartPercentage() {
        if (this.type === "health") {
            return (this.percentage = 100);
        } else if (this.type === "coin") {
            return (this.percentage = 0);
        }
    };

    setPercentage(percentage) {
        this.percentage = percentage; 
        let path = this.setImageType()[this.resolveImageIndex()];
        if(this.imageCache[path]){
        this.img = this.imageCache[path];
        } else {
        console.error("Image not found in cache:", path);
        }
    };

    resolveImageIndex() {
        if (this.percentage == 100) {
            return 5;
        } else if (this.percentage > 80) {
            return 4;
        } else if (this.percentage > 60) {
            return 3;
        } else if (this.percentage > 40) {
            return 2;
        } else if (this.percentage > 20) {
            return 1;
        } else {
            return 0;
        }
    }
}