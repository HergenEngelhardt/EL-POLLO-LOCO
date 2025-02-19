class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = - 0;
    statusbarHealth = new Statusbar('health');
    statusbarCoin = new Statusbar('coin');
    coinsCollected = 0;
    totalCoins = level1.coins.length;


    constructor(canvas, keyboard) {
        this.keyboard = keyboard;
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.draw();
        this.setWorld();
        this.checkCollisions();
    }

    setWorld() {
        this.character.world = this;
    }

    checkCollisions() {
        setInterval(() => {
            this.level.enemies.forEach(enemy => {
                if(this.character.isColliding(enemy)){
                    this.character.hit();
                    this.updateHealthStatusBar();
                    console.log(this.character.energy);
                }
            });

            this.level.coins.forEach((coin, index) => {
                if(this.character.isColliding(coin)){
                    this.level.coins.splice(index, 1); 
                    this.coinsCollected++;
                    this.updateCoinStatusBar();
                }
            });
        }, 1000);
    }

    updateHealthStatusBar() {
        this.statusbarHealth.setPercentage(this.character.energy);
    }

    updateCoinStatusBar() {
        let coinPercentage = (this.coinsCollected / this.totalCoins) * 100;
        this.statusbarCoin.setCoinPercentage(coinPercentage);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.translate(this.camera_x, 0);
        
        this.addObjectsToMap(this.level.background || []);
        this.addObjectsToMap(this.level.clouds || []);
        this.addObjectsToMap(this.level.enemies || []);
        this.addObjectsToMap(this.level.coins || []);
        this.addObjectsToMap(this.level.salsaBottles || []);
        this.addToMap(this.character);

        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.statusbarHealth);
        this.addToMap(this.statusbarCoin);

        let self = this;
        requestAnimationFrame(function() {
            self.draw();
        });
    }

    addObjectsToMap(objects) {
        objects.forEach(obj => {
            this.addToMap(obj)
        })
    }

    addToMap(mo) {
        if(mo.otherDirection){
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);

        if(mo.otherDirection){
            this.flipImageBack(mo);
        }
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1; 
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1; 
        this.ctx.restore();
    }
}