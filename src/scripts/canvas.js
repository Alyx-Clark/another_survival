const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


let score = 0;

ctx.font = "50px Georgia";
// c.fillRect(100, 100, 100, 100);
// c.fillRect(300, 300, 300, 300);
// c.fillRect(200, 200, 200, 200);
// console.log(canvas);

//keep track of keys pressed on keyboard using event listeners
const keys = [];

//this will store all data about character
const player = {
    //players position
    x: 410,
    y: 570,
    //based on sprite player size
    width: 42.5,
    height: 67.75,
    //position of frame cut out from sprite sheet to show only 1 frame
    frameX: 0,
    frameY: 0,
    //pixels movement speed
    speed: 2,
    //keep track of moving or not. standing walking animation
    moving: false
};

//player spirte image
const playerSprite = new Image();
playerSprite.src = "./images/player_sprite_resize.png";

//background of game image
const background = new Image();
background.src = "./images/zombiecity.png";

//takes img passed to it and cuts out section of sprite that we want to use
//source x y width and height to only show one frame
function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH){
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}
//animation loop using the built in canvas method draw image for our background and sprite
//parent function requestanimationframe runs animate in a loop
function animate(){
    //clear canvas between each animation frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //draws our background and where to start drawing from
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                                                                                    //change these to change size of sprite
    drawSprite(playerSprite, 0, 0, player.width, player.height, player.x, player.y, player.width, player.height);
    movePlayer();
    requestAnimationFrame(animate);
}

animate();

//callback function with built in event object e
//keep track of keys pressed on keyboard by adding and removing values from keys arrays
window.addEventListener("keydown", function(e){
    keys[e.key] = true;
    console.log(e.key);
    console.log(player.x);
});

window.addEventListener("keyup", function(e){
    delete keys[e.key];
});

function movePlayer(){
    if(keys["w"] && player.y>2){
        player.y -= player.speed;
    }
    if(keys["a"] && player.x>2){
        player.x -= player.speed;
    }
    if(keys["s"] && player.y<855){
        player.y += player.speed;
    }
    if(keys["d"] && player.x<1450){
        player.x += player.speed;
    }
}