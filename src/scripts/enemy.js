export default class Enemy{
    constructor(canvas, x, y, width, height, scaleWidth, scaleHeight, frameX, frameY, speed, moving, score, health, obstacles, froze){
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
        this.froze = froze;
    }

    between(x, min, max) {
        return x >= min && x <= max;
    }

    moveEnemy(player, deltaTime = 1 / 60){
        const targetX = player.x + (player.scaleWidth / 2);
        const targetY = player.y + (player.scaleHeight / 2);
        const selfX = this.x + (this.scaleWidth / 2);
        const selfY = this.y + (this.scaleHeight / 2);
        const deltaX = targetX - selfX;
        const deltaY = targetY - selfY;
        const distance = Math.hypot(deltaX, deltaY);

        if (distance < 1) {
            this.moving = false;
            return;
        }

        const stepX = (deltaX / distance) * this.speed * deltaTime;
        const stepY = (deltaY / distance) * this.speed * deltaTime;
        const movedX = this.moveAxis("x", stepX);
        const movedY = this.moveAxis("y", stepY);

        if (!movedX && Math.abs(stepX) > 0.1) {
            this.moveAxis("y", Math.sign(deltaY || 1) * this.speed * deltaTime);
        }
        if (!movedY && Math.abs(stepY) > 0.1) {
            this.moveAxis("x", Math.sign(deltaX || 1) * this.speed * deltaTime);
        }

        this.frameY = Math.abs(deltaY) > Math.abs(deltaX)
            ? (deltaY > 0 ? 0 : 3)
            : (deltaX > 0 ? 3 : 2);
        this.moving = true;
    }

    moveAxis(axis, amount){
        if (amount === 0) return false;

        const previous = this[axis];
        this[axis] += amount;
        this.x = Math.max(0, Math.min(this.x, this.canvas.width - this.scaleWidth));
        this.y = Math.max(0, Math.min(this.y, this.canvas.height - this.scaleHeight));

        if(this.isColliding(this.collides, this, ...this.obstacles)) {
            this[axis] = previous;
            return false;
        }

        return previous !== this[axis];
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
