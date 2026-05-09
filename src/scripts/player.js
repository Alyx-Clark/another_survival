export default class Player{
    constructor(canvas, x, y, width, height, scaleWidth, scaleHeight, frameX, frameY, speed, moving, score, health, obstacles, alive, blinking){
        this.obstacles = obstacles;
        this.canvas = canvas
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
        this.score = score;
        this.health = health;
        this.alive = alive;
        this.blinking = blinking;
    }

    movePlayer(keys, deltaTime = 1 / 60, touchInput = {}){
        const up = keys["w"] || keys["W"] || keys["ArrowUp"] || touchInput.up;
        const left = keys["a"] || keys["A"] || keys["ArrowLeft"] || touchInput.left;
        const down = keys["s"] || keys["S"] || keys["ArrowDown"] || touchInput.down;
        const right = keys["d"] || keys["D"] || keys["ArrowRight"] || touchInput.right;
        let inputX = 0;
        let inputY = 0;

        if (left) inputX -= 1;
        if (right) inputX += 1;
        if (up) inputY -= 1;
        if (down) inputY += 1;

        if (inputX === 0 && inputY === 0) {
            this.moving = false;
            return;
        }

        const length = Math.hypot(inputX, inputY);
        const velocityX = (inputX / length) * this.speed * deltaTime;
        const velocityY = (inputY / length) * this.speed * deltaTime;

        this.moving = true;
        if (Math.abs(inputX) > Math.abs(inputY)) {
            this.frameY = inputX < 0 ? 2 : 3;
        } else {
            this.frameY = inputY < 0 ? 1 : 0;
        }

        this.moveAxis("x", velocityX);
        this.moveAxis("y", velocityY);
    }

    moveAxis(axis, amount){
        if (amount === 0) return;

        this[axis] += amount;
        this.x = Math.max(0, Math.min(this.x, this.canvas.width - this.scaleWidth));
        this.y = Math.max(0, Math.min(this.y, this.canvas.height - this.scaleHeight));

        if(this.isColliding(this.collides, this, ...this.obstacles)) {
            this[axis] -= amount;
        }
    }

    isColliding(callback, player, ...obstacles){
        let boo = false;
        obstacles.forEach(building =>{
            if(callback(player, building)) boo = true; 
        })
        return boo;
    }

    collides(a, b){
        if (a.x < b.x + b.width &&
            a.x + a.scaleWidth > b.x &&
            a.y < b.y + b.height &&
            a.y + a.scaleHeight > b.y){
                return true;
            }else{
                return false;
            }
        }
    
    moveSprite(){
        if(this.frameX<3 && this.moving){
            this.frameX++;
        }else{
            this.frameX = 0;
        }
    }
}
