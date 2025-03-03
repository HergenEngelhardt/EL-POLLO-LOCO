class World {
    character = new Character();
    level;
    canvas;
    ctx;
    keyboard;
    camera_x = -0;
    statusbarHealth = new Statusbar('health');
    statusbarCoin = new Statusbar('coin');
    statusbarBottle = new Statusbar('bottle');
    coinsCollected = 0;
    bottlesCollected = 0;
    throwableBottles = [];
    startScreen = new StartScreen();
    gameOverScreen = new GameOverScreen();
    gameStarted = false;
    gameOver = false;

    constructor(canvas, keyboard) {
        this.keyboard = keyboard;
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.draw();
        this.setWorld();
        this.addKeyboardEvents();
        this.addMouseEvents();
        this.checkCollisions();
        this.totalInitialBottles = 5;
    }

    setWorld() {
        this.character.world = this;
        if (this.level && this.level.enemies) {
            this.level.enemies.forEach(enemy => {
                enemy.world = this;
            });
        }
    }

    checkCollisions() {
        setInterval(() => {
            if (!this.level) return;
            if (this.character.energy <= 0) {
                this.gameOver = true;
                this.gameOverScreen.showWinLoseScreen('lose');
                return;
            }
            
            this.level.enemies = this.level.enemies.filter(enemy => !enemy.toDelete);
            this.handleEnemyCollisions();
            this.handleCoinCollisions();
            this.handleBottleCollisions();
            this.handleThrowableBottleCollisions();
            
            this.checkWinCondition();
        }, 100); 
    }
    
    handleEnemyCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.speedY < 0 && this.character.isCollidingFromTop(enemy) && !enemy.isDead) {
                enemy.die();
                this.character.speedY = 15; 
                this.character.lastJumpOnEnemy = new Date().getTime();
            } else if (this.character.isColliding(enemy) && !enemy.isDead && !this.isJumpInvulnerable()) {
                this.character.hit();
                this.updateHealthStatusBar();
            }
        });
    }
    
    handleCoinCollisions() {
        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.level.coins.splice(index, 1);
                this.coinsCollected++;
                this.updateCoinStatusBar();
            }
        });
    }
    
    handleBottleCollisions() {
        this.level.salsaBottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                this.level.salsaBottles.splice(index, 1);
                this.bottlesCollected++;
                let newBottle = new SalsaBottle();
                newBottle.world = this;
                this.throwableBottles.push(newBottle);
                this.updateBottleStatusBar();
            }
        });
    }
    
    handleThrowableBottleCollisions() {
        this.throwableBottles.forEach((bottle, index) => {
            if (!bottle.hasBeenThrown) return;
            
            this.level.enemies.forEach((enemy) => {
                if (bottle.isColliding(enemy)) {
                    bottle.splash();
                    if (enemy instanceof ChickenBoss) {
                        enemy.hit();
                        console.log('Bottle hit boss!');
                    } else {
                        enemy.toDelete = true;
                    }
                }
            });
            
            if (bottle.y > 350) {
                bottle.splash();
            }
        });
    }

    throwBottle() {
        if (this.throwableBottles.length > 0) {
            let bottle = this.throwableBottles.pop();
            bottle.throw(this.character.x, this.character.y);
            bottle.world = this;
            this.bottlesCollected--;
            this.updateBottleStatusBar();
        }
    }

    updateHealthStatusBar() {
        this.statusbarHealth.setPercentage(this.character.energy);
    }

    updateCoinStatusBar() {
        let coinPercentage = (this.coinsCollected / this.level.coins.length) * 100;
        this.statusbarCoin.setCoinPercentage(coinPercentage);
    }

    updateBottleStatusBar() {
        let bottlePercentage = (this.bottlesCollected / this.totalInitialBottles) * 100;
        this.statusbarBottle.setBottlePercentage(bottlePercentage);
    }

    setBottlePercentage(percentage) {
        this.percentage = percentage;
        let path = this.STATUSBAR_BOTTLE[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    addMouseEvents() {
        this.canvas.addEventListener('click', (event) => {
            let rect = this.canvas.getBoundingClientRect();
            let x = event.clientX - rect.left;
            let y = event.clientY - rect.top;
            if (this.startScreen.isPlayButtonClicked(x, y)) {
                this.startGame();
            }
        });
    }

    startGame() {
        this.gameStarted = true;
        this.gameOver = false;
        initLevel1(); 
        this.level = level1; 
        this.setWorld(); 
        this.totalCoins = this.level.coins.length;
        this.totalBottles = this.level.salsaBottles.length;
        this.character.startAnimations();   
    }

    drawGameOverScreen() {
        this.gameOverScreen.draw(this.ctx);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (!this.gameStarted) {
            this.startScreen.draw(this.ctx);
        } else {
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

            if (this.character.energy <= 0) {
                this.drawGameOverScreen();
            }
        }

        if (this.gameOver) {
            this.drawGameOverScreen();
        } else {
            let self = this;
            requestAnimationFrame(function () {
                self.draw();
            });
        }
    }

    addObjectsToMap(objects) {
        objects.forEach(obj => {
            this.addToMap(obj)
        })
    }

    addToMap(mo) {
        if (mo.img) {
            if (mo instanceof ChickenBoss && mo.showHealthBar) {
                this.addToMap(mo.healthBar);
            }
            if (mo.otherDirection) {
                this.flipImage(mo);
            }
            mo.draw(this.ctx);
            mo.drawFrame(this.ctx);
            mo.drawOffsetFrame(this.ctx);

            if (mo.otherDirection) {
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

    isJumpInvulnerable() {
        let timeSinceJump = new Date().getTime() - (this.character.lastJumpOnEnemy || 0);
        return timeSinceJump < 1000;
    }

    checkWinCondition() {
        if (this.level && this.level.enemies.length === 0) {
            this.gameOver = true;
            this.gameOverScreen.showWinLoseScreen('win');
        }
    }
}