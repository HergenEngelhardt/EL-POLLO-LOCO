class MovableObject {
    x =40;
    y = 270;
    img;
    height = 150;
    width = 100;
    imageCache = {};
    currentImage = 0;
    speed = 0.15;

    loadImage(path) {
        this.img = new Image();
        this.img.src =  path;
    }

    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    moveRight() {
        console.group('moving right')
    }

    moveLeft() {
        setInterval(() => {
            this.x -= this.speed;
            if (this.x < -500) {
                this.x = 800;
            }
        }, 1000 / 60)
    }
}