class World {
    character = new Character();
    enemies = [
        new Chicken(),
        new Chicken(),
        new Chicken()
    ]
    cloud = [
        new Clouds()];
    background = [
        new Background('assets/img/5_background/layers/1_first_layer/1.png')];
    canvas;
    ctx;

    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.draw();

    }


draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.addToMap(this.character)

        this.addObjectsToMap(this.enemies);
        this.addObjectsToMap(this.cloud);   
        this.addObjectsToMap(this.background);

        //draw wird immer wieder aufgerufen
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
        this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height)
    }
}