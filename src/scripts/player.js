// import Player from './player.js';


const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
// canvas.width = 1200;
// canvas.height = 600;
// ctx.scale(4,4);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.scrollTop = 0;
document.body.style.overflow = 'hidden';


// // maybe can use for title screen music
// const music = document.createElement('audio');
// music.src = "./sounds/Dungeon-Crawler"
// music.play();


//this is the size of the canvas when I got the dimensions
const scaleX = 1503;
const scaleY = 947;

const currentX = canvas.width/scaleX;
const currentY = canvas.height/scaleY;

//keep track of keys pressed on keyboard using event listeners
const keys = [];

// this will store all data about character
const player = {
    //players position
    x: canvas.width/2,
    y: canvas.height/2,
    //based on sprite player size
    width: 42.5,
    height: 68.5,
    scaleWidth: 42.5 * currentX,
    scaleHeight: 68.5 * currentY,
    //position of frame cut out from sprite sheet to show only 1 frame
    frameX: 0,
    frameY: 3,
    //pixels movement speed
    speed: canvas.width/170,
    //keep track of moving or not. standing walking animation
    moving: false,
    score: 0
}

const music = document.createElement('audio');
music.src = "./sounds/Haunted_Swamp.wav";

const audioImg = new Image();
audioImg.src = "./images/soundButton.png"

const muteImg = new Image();
muteImg.src = "./images/muteButton.png"

const walkSound = document.createElement("audio");
walkSound.src = "./sounds/walking.wav";
walkSound.playbackRate = 12;


const audioButton = {
    x:2,
    y:2,
    endx: 2 + (canvas.width/50),
    endy: 2 + (canvas.height/30)
}

window.addEventListener('click', function(e){
    if((e.x > audioButton.x && e.x < audioButton.endx) && (e.y > audioButton.y && e.y < audioButton.endy)){
        if(music.paused){
            music.play();
            music.loop = true;
        }else{
            music.pause();
        }
    }
})


//player spirte image
const playerSprite = new Image();
playerSprite.src = "./images/player_sprite_resize.png";

// const enemySprite = new Image();
// enemySprite.src = ""

//background of game image
const background = new Image();
background.src = "./images/zombiecity.png";

//takes img passed to it and cuts out section of sprite that we want to use
//source x y width and height to only show one frame
function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH){
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}


//callback function with built in event object e
//keep track of keys pressed on keyboard by adding and removing values from keys arrays
window.addEventListener("keydown", function(e){
    keys[e.key] = true;
    console.log(e.key);
    // console.log(player.x);
});

window.addEventListener("keyup", function(e){
    delete keys[e.key];
    player.moving = false;
});

function moveSprite(){
    if(player.frameX<3 && player.moving){
        player.frameX++;
    }else{
        player.frameX = 0;
    }
}

function movePlayer(){
    if(keys["w"] && player.y>0 && !keys["a"] && !keys["s"] && !keys["d"]){
        player.moving = true; //had to put these in here to prevent animation of sprite on random key presses
        player.frameY = 1;
        player.y -= player.speed;
        // scalePlayer.y -= player.speed;
        if(isColliding(collides, player, ...obstacles)) player.y += player.speed;
    }else{
        player.moving = false;
    }
    if(keys["a"] && player.x>2 && !keys["w"] && !keys["s"] && !keys["d"]){
        player.moving = true;
        player.frameY = 2;
        player.x -= player.speed;
        // scalePlayer.x -= player.speed; 
        if(isColliding(collides, player, ...obstacles)) player.x += player.speed
    }
    if(keys["s"] && player.y<canvas.height-player.height && !keys["a"] && !keys["w"] && !keys["d"]){
        player.moving = true;
        player.frameY = 0;
        player.y += player.speed;
        // scalePlayer.y += player.speed;
        if(isColliding(collides, player, ...obstacles)) player.y -= player.speed
    }
    if(keys["d"] && player.x<canvas.width-player.width && !keys["a"] && !keys["s"] && !keys["w"]){
        player.moving = true;
        player.frameY = 3;
        player.x += player.speed;
        // scalePlayer.x += player.speed;
        if(isColliding(collides, player, ...obstacles)) player.x -= player.speed
    }
}

//animation loop using the built in canvas method draw image for our background and sprite
//parent function requestanimationframe runs animate in a loop
// function animate(){
    //clear canvas between each animation frame
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    // //draws our background and where to start drawing from
    // ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    //                                                                                 //change these to change size of sprite
    // drawSprite(playerSprite, player.width * player.frameX, player.height * player.frameY, player.width, player.height, player.x, player.y, player.width, player.height);
    //                         //what to crop and where to start cropping from in sprite sheet
    // movePlayer();
    // moveSprite();
    // requestAnimationFrame(animate);
// }

// animate();

function startAnimating(fps){
    fpsInterval = 1000/fps;
    then = Date.now();
    startTime = then;
    animate();
}

function animate(){
    requestAnimationFrame(animate);
    now = Date.now();
    elapsed = now - then;
    if(elapsed > fpsInterval){
        then = now - (elapsed % fpsInterval);
        //clear canvas between each animation frame
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //draws our background and where to start drawing from
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                                                                                        //change these to change size of sprite
        drawSprite(playerSprite, player.width * player.frameX, player.height * player.frameY, player.width, player.height, player.x, player.y, canvas.width/45, canvas.height/15);
                                //what to crop and where to start cropping from in sprite sheet
        if(!music.paused){
            ctx.drawImage(audioImg, 2, 2, canvas.width/50, canvas.height/30);
        }else{
            ctx.drawImage(muteImg, 2, 2, canvas.width/50, canvas.height/30);
        }
        if(player.moving) walkSound.play();
        movePlayer();
        moveSprite();
    }
}

startAnimating(15);

//teleport player to help with testing
window.addEventListener('click', function(event){
    console.log(event.x, event.y);
    player.x = event.x;
    player.y = event.y;
    // scalePlayer.x = event.x;
    // scalePlayer.y = event.y;
    console.log(canvas.width, canvas.height);
})

class building {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
    }
}


function collides(a, b){
    if (a.x < b.x + b.width &&
        a.x + a.scaleWidth > b.x &&
        a.y < b.y + b.height &&
        a.y + a.scaleHeight > b.y){
            return true;
        }else{
            return false;
        }
}





// const scalePlayer = {
//     x: player.x,
//     y: player.y,
//     width: 42.5 * currentX,
//     height: 68.5 * currentY
// }

const obstacles = [];
const house1 = new building(190*currentX, 30*currentY, 150*currentX, 110*currentY);
obstacles.push(house1);
const house2 = new building(395*currentX, 30*currentY, 145*currentX, 110*currentY);
obstacles.push(house2);
const house3 = new building(605*currentX, 30*currentY, 150*currentX, 110*currentY);
obstacles.push(house3);
const house4 = new building(190*currentX, 680*currentY, 150*currentX, 110*currentY);
obstacles.push(house4);
const house5 = new building(540*currentX, 680*currentY, 150*currentX, 110*currentY);
obstacles.push(house5);
const house6 = new building(940*currentX, 680*currentY, 150*currentX, 110*currentY);
obstacles.push(house6);

function isColliding(callback, player, ...obstacles){
    let boo = false;
    obstacles.forEach(building =>{
        if(callback(player, building)) boo = true; 
    })
    return boo;
}



