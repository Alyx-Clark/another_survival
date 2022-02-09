export default class Enemy{
    constructor(canvas, x, y, width, height, scaleWidth, scaleHeight, frameX, frameY, speed, moving, score, health, obstacles){
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
    }

    between(x, min, max) {
        return x >= min && x <= max;
    }

    moveEnemy(playerx, playery){
        if(playery < this.y){
            this.moving = true; //had to put these in here to prevent animation of sprite on random key presses
            this.frameY = 3;
            this.y -= this.speed;
            // scalePlayer.y -= this.speed;
            // if(this.isColliding(this.collides, this, ...this.obstacles)) this.y += this.speed;
        }if(playerx < this.x){
            this.moving = true;
            // this.frameY = 2;
            this.x -= this.speed;
            // scalePlayer.x -= this.speed; 
            // if(this.isColliding(this.collides, this, ...this.obstacles)) this.x += this.speed;
        }if(playery > this.y){
            this.moving = true;
            this.frameY = 0;
            this.y += this.speed;
            // scalePlayer.y += this.speed;
            // if(this.isColliding(this.collides, this, ...this.obstacles)) this.y -= this.speed;
        }if(playerx > this.x){
            this.moving = true;
            // this.frameY = 3;
            this.x += this.speed;
            // scalePlayer.x += this.speed;
            // if(this.isColliding(this.collides, this, ...this.obstacles)) this.x -= this.speed;
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