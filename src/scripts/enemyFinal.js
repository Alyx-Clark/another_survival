export default class Enemy{
    constructor(x, y, width, height, scaleWidth, scaleHeight, frameX, frameY, speed, moving, health){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.scaleWidth = scaleWidth;
        this.scaleHeight = scaleHeight;
        this.frameX = frameX;
        this.frameY = frameY;
        this.speed = speed;
        this.moving = moving;
        this.health = health;
    }
}