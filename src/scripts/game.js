import Player from "./playerFinal";
import Enemy from "./enemyFinal";
import Obstacle from "./obstacles.js";
import Button from "./button.js";

// // maybe can use for title screen music
// const music = document.createElement('audio');
// music.src = "./sounds/Dungeon-Crawler"
// music.play();


export default class Game {
    constructor(){
        this.canvas = document.getElementById("canvas1");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        document.body.scrollTop = 0;
        document.body.style.overflow = 'hidden';
        this.scaleX = 1503;
        this.scaleY = 947;
        this.currentX = this.canvas.width/this.scaleX;
        this.currentY = this.canvas.height/this.scaleY;
        this.keys = [];
        this.enemy1 = new Enemy();
        this.audioButton = new Button(2, 2, 2+(this.canvas.width/50), 2+(this.canvas.heigth/30));
        this.music = document.createElement('audio');
        this.audioImg = new Image();
        this.muteImg = new Image();
        this.walkSound = document.createElement("audio");
        this.playerSprite = new Image();
        this.enemySprite = new Image();
        this.background = new Image();
        this.loadInitialComponents();
        this.player1 = new Player(this.canvas, 760*this.currentX, 580*this.currentY, 42.5, 68.5, 42.5*this.currentX, 
            68.5*this.currentY, 0, 3, this.canvas.width/170, false, 0, 3, this.obstacles);
        this.registerEvents();
        this.animate();
    }

    loadInitialComponents(){
        this.background.src = "./images/zombiecity.png";
        this.enemySprite.src = "./images/Ghoul.png";
        this.playerSprite.src = "./images/player_sprite_resize.png";
        this.walkSound.src = "./sounds/walking.wav";
        this.walkSound.playbackRate = 12;
        this.muteImg.src = "./images/muteButton.png"
        this.music.src = "./sounds/Haunted_Swamp.wav";
        this.audioImg.src = "./images/soundButton.png" 
        this.obstacles = [];
        const house1 = new Obstacle(190*this.currentX, 30*this.currentY, 150*this.currentX, 110*this.currentY);
        const house2 = new Obstacle(395*this.currentX, 30*this.currentY, 145*this.currentX, 110*this.currentY);
        const house3 = new Obstacle(605*this.currentX, 30*this.currentY, 150*this.currentX, 110*this.currentY);
        const house4 = new Obstacle(190*this.currentX, 680*this.currentY, 150*this.currentX, 110*this.currentY);
        const house5 = new Obstacle(540*this.currentX, 680*this.currentY, 160*this.currentX, 110*this.currentY);
        const house6 = new Obstacle(945*this.currentX, 685*this.currentY, 150*this.currentX, 100*this.currentY);

        const store1left = new Obstacle(190*this.currentX, 435*this.currentY, 80*this.currentX, 90*this.currentY);
        const store1right = new Obstacle(385*this.currentX, 435*this.currentY, 110*this.currentX, 90*this.currentY);
        const store1middle = new Obstacle(280*this.currentX, 375*this.currentY, 170*this.currentX, 100*this.currentY);

        const store2left = new Obstacle(665*this.currentX, 435*this.currentY, 60*this.currentX, 90*this.currentY);
        const store2right = new Obstacle(840*this.currentX, 435*this.currentY, 130*this.currentX, 90*this.currentY);
        const store2middle = new Obstacle(720*this.currentX, 375*this.currentY, 190*this.currentX, 90*this.currentY);

        const store3 = new Obstacle(1330*this.currentX, 710*this.currentY, 302*this.currentX, 80*this.currentY);
        const largeStore = new Obstacle(1100*this.currentX, 70*this.currentY, 250*this.currentX, 125*this.currentY);

        const gravestone1 = new Obstacle(1*this.currentX, 430*this.currentY, 110*this.currentX, 30*this.currentY);
        const gravestone2 = new Obstacle(1465*this.currentX, 370*this.currentY, 10*this.currentX, 1*this.currentY);

        const tree1 = new Obstacle(30*this.currentX, 1*this.currentY, 120*this.currentX, 90*this.currentY);
        const tree2 = new Obstacle(1395*this.currentX, 110*this.currentY, 120*this.currentX, 90*this.currentY);
        const tree3 = new Obstacle(1287*this.currentX, 285*this.currentY, 120*this.currentX, 70*this.currentY);
        const tree4 = new Obstacle(972*this.currentX, 437*this.currentY, 120*this.currentX, 70*this.currentY);
        const tree5 = new Obstacle(1380*this.currentX, 560*this.currentY, 120*this.currentX, 70*this.currentY);
        const tree6 = new Obstacle(1060*this.currentX, 620*this.currentY, 120*this.currentX, 70*this.currentY);
        const tree7 = new Obstacle(370*this.currentX, 725*this.currentY, 135*this.currentX, 80*this.currentY);

        const sign = new Obstacle(1035*this.currentX, 235*this.currentY, 50*this.currentX, 1*this.currentY);
        const littleSign = new Obstacle(840*this.currentX, 820*this.currentY, 10*this.currentX, 1*this.currentY);
        const boxes = new Obstacle(1100*this.currentX, 785*this.currentY, 30*this.currentX, 1*this.currentY);
        this.obstacles.push(house1);
        this.obstacles.push(house2);
        this.obstacles.push(house3);
        this.obstacles.push(house4);
        this.obstacles.push(house5);
        this.obstacles.push(house6);
        this.obstacles.push(store1left);
        this.obstacles.push(store1right);
        this.obstacles.push(store1middle);
        this.obstacles.push(store2left);
        this.obstacles.push(store2right);
        this.obstacles.push(store2middle);
        this.obstacles.push(store3);
        this.obstacles.push(largeStore);
        this.obstacles.push(gravestone1);
        this.obstacles.push(gravestone2);
        this.obstacles.push(tree1);
        this.obstacles.push(tree2);
        this.obstacles.push(tree3);
        this.obstacles.push(tree4);
        this.obstacles.push(tree5);
        this.obstacles.push(tree6);
        this.obstacles.push(tree7);
        this.obstacles.push(sign);
        this.obstacles.push(littleSign);
        this.obstacles.push(boxes);
    }

    registerEvents(){
        window.addEventListener("keydown", (e) => {
            this.keys[e.key] = true;
            console.log(e.key);
        });
        
        window.addEventListener("keyup", (e) => {
            delete this.keys[e.key];
            this.player1.moving = false;
        });
        window.addEventListener('click', (event) => {
            console.log(event.x, event.y);
            this.player1.x = event.x;
            this.player1.y = event.y;
            // scalePlayer.x = event.x;
            // scalePlayer.y = event.y;
            console.log(this.canvas.width, this.canvas.height);
        })
        window.addEventListener('click', (e) => {
            if((e.x > this.audioButton.x && e.x < this.audioButton.endx) && (e.y > this.audioButton.y && e.y < this.audioButton.endy)){
                if(this.music.paused){
                    this.music.play();
                    this.music.loop = true;
                }else{
                    this.music.pause();
                }
            }
        })

    }

    drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH){
        this.ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
    }

    // startAnimating(fps){
    //     let fpsInterval = 1000/fps;
    //     let then = Date.now();
    //     let startTime = then;
    //     this.animate(then, fpsInterval);
    // }
    
    animate(){
        setTimeout(() => {
            requestAnimationFrame(this.animate.bind(this));
        }, 1000 / 15);
        // let now = Date.now();
        // let elapsed = now - then;
        // if(elapsed > fpsInterval){
            // then = now - (elapsed % fpsInterval);
            //clear canvas between each animation frame
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            //draws our background and where to start drawing from
            this.ctx.drawImage(this.background, 0, 0, this.canvas.width, this.canvas.height);
                                                                                            //change these to change size of sprite
            this.drawSprite(this.playerSprite, this.player1.width * this.player1.frameX, this.player1.height * this.player1.frameY, this.player1.width, 
                this.player1.height, this.player1.x, this.player1.y, this.canvas.width/45, this.canvas.height/15);
                                    //what to crop and where to start cropping from in sprite sheet
            if(!this.music.paused){
                this.ctx.drawImage(this.audioImg, 2, 2, this.canvas.width/50, this.canvas.height/30);
            }else{
                this.ctx.drawImage(this.muteImg, 2, 2, this.canvas.width/50, this.canvas.height/30);
            }
            if(this.player1.moving) this.walkSound.play();
            this.player1.movePlayer(this.keys);
            this.player1.moveSprite();
        // }
    }

}


