class MovableObject {
    x =40;
    y = 270;
    img;
    height = 150;
    width = 100;

    loadImage(path) {
        this.img = new Image();
        this.img.src =  path;
    }

    moveRight() {
        console.group('moving right')
    }

    moveLeft() {

    }
}