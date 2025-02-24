class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = - 0;
    statusbarHealth = new Statusbar('health');
    statusbarCoin = new Statusbar('coin');
    statusbarBottle = new Statusbar('bottle');
    coinsCollected = 0;
    totalCoins = level1.coins.length;
    bottlesCollected = 0;
    totalBottles = level1.salsaBottles.length;
    throwableBottles = [];

    constructor(canvas, keyboard) {
        this.keyboard = keyboard;
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.draw();
        this.setWorld();
        this.checkCollisions();
        this.addKeyboardEvents();
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
    
            this.level.salsaBottles.forEach((bottle, index) => {
                if(this.character.isColliding(bottle)){
                    this.level.salsaBottles.splice(index, 1); 
                    this.bottlesCollected++;
                    let newBottle = new SalsaBottle();
                    newBottle.world = this;
                    this.throwableBottles.push(newBottle);
                    this.updateBottleStatusBar();
                }
            });
    
            this.throwableBottles.forEach((bottle, index) => {
                this.level.enemies.forEach((enemy, enemyIndex) => {
                    if (bottle.isColliding(enemy)) {
                        bottle.splash();
                        this.level.enemies.splice(enemyIndex, 1); 
                    }
                });
                if (bottle.y > 350) { 
                    bottle.splash();
                }
            });
        }, 200);
    }

    throwBottle() {
        if (this.throwableBottles.length > 0) {
            let bottle = this.throwableBottles.pop();
            bottle.throw(this.character.x, this.character.y);
            bottle.world = this; 
            this.level.salsaBottles.push(bottle);
            this.bottlesCollected--;
            this.updateBottleStatusBar();
        }
    }

    updateHealthStatusBar() {
        this.statusbarHealth.setPercentage(this.character.energy);
    }

    updateCoinStatusBar() {
        let coinPercentage = (this.coinsCollected / this.totalCoins) * 100;
        this.statusbarCoin.setCoinPercentage(coinPercentage);
    }

    updateBottleStatusBar() {
        let bottlePercentage = (this.bottlesCollected / this.totalBottles) * 100;
        if (this.bottlesCollected === 0) {
            bottlePercentage = 0;
        }
        this.statusbarBottle.setBottlePercentage(bottlePercentage);
    }

    setBottlePercentage(percentage) {
        this.percentage = percentage;
        let path = this.STATUSBAR_BOTTLE[this.resolveImageIndex()];
        this.img = this.imageCache[path];    
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
        this.addToMap(this.statusbarBottle);

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
        if (mo.img) { 
            if(mo.otherDirection){
                this.flipImage(mo);
            }
            mo.draw(this.ctx);
            mo.drawFrame(this.ctx);
    
            if(mo.otherDirection){
                this.flipImageBack(mo);
            }
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

    addKeyboardEvents() {
        window.addEventListener('keydown', (event) => {
            if (event.code === 'ControlLeft') {
                this.character.throwBottle();
            }
        });
    }
}