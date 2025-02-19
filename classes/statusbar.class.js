class Statusbar extends DrawableObject {
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

    STATUSBAR_BOTTLE = [
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png'
    ];

    percentage = 100;
    type = 'health';

    constructor(type = 'health') {
        super();
        this.type = type;
        if (type === 'health') {
            this.loadImages(this.STATUSBAR_HEALTH);
            this.setPercentage(100);
        } else if (type === 'coin') {
            this.loadImages(this.STATUSBAR_COIN);
            this.setCoinPercentage(0);
        } else if (type === 'bottle') {
            this.loadImages(this.STATUSBAR_BOTTLE);
            this.setBottlePercentage(0);
        }
        this.x = 40;
        this.y = type === 'health' ? 0 : (type === 'coin' ? 50 : 100); // Position health bar at y=0, coin bar at y=50, and bottle bar at y=100
        this.width = 200;
        this.height = 80;
    }
    
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.STATUSBAR_HEALTH[this.resolveHealthImageIndex()];
        this.img = this.imageCache[path];    
    }

    setCoinPercentage(percentage) {
        this.percentage = percentage;
        let path = this.STATUSBAR_COIN[this.resolveImageIndex()];
        this.img = this.imageCache[path];    
    }

    setBottlePercentage(percentage) {
        this.percentage = percentage;
        let path = this.STATUSBAR_BOTTLE[this.resolveImageIndex()];
        this.img = this.imageCache[path];    
    }

    resolveHealthImageIndex() {
        if(this.percentage == 100){
            return 5;
        } else if(this.percentage > 80){
            return 4;
        } else if(this.percentage > 60){
            return 3;
        } else if(this.percentage > 40){
            return 2;
        } else if(this.percentage > 20){
            return 1;
        } else {
            return 0;
        }
    }

    resolveImageIndex() {
        if(this.percentage == 0){
            return 0;
        } else if(this.percentage > 0 && this.percentage <= 20){
            return 1;
        } else if(this.percentage > 20 && this.percentage <= 40){
            return 2;
        } else if(this.percentage > 40 && this.percentage <= 60){
            return 3;
        } else if(this.percentage > 60 && this.percentage <= 80){
            return 4;
        } else {
            return 5;
        }
    }
}