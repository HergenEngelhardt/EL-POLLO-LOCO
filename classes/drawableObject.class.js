class DrawableObject {
    x = 40;
    y = 250;
    height = 150;
    width = 100;
    img;
    imageCache = {};
    currentImage = 0;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    draw(ctx) {
        if (this.img) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }

    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof ChickenSmall || this instanceof ChickenBoss || this instanceof SalsaBottle || this instanceof Coin) {
            ctx.beginPath();
            ctx.lineWidth = "3";
            ctx.strokeStyle = "red";
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }
    }

    drawOffsetFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof ChickenSmall || this instanceof ChickenBoss || this instanceof SalsaBottle || this instanceof Coin) {
            if (this.offsetX !== undefined || this.offsetY !== undefined || this.offsetWidth !== undefined || this.offsetHeight !== undefined) {
                ctx.beginPath();
                ctx.lineWidth = "3";
                ctx.strokeStyle = "blue";
                ctx.rect(
                    this.x + (this.offsetX || 0), 
                    this.y + (this.offsetY || 0), 
                    this.width - (this.offsetWidth || 0), 
                    this.height - (this.offsetHeight || 0)
                );
                ctx.stroke();
            }
        }
    }
}