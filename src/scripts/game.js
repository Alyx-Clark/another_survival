// import Player from "./player";
// import Enemy from "./enemy";

// const canvas, ctx;

// function prepareCanvas(){
//     canvas = document.getElementById("canvas1");
//     ctx = canvas.getContext("2d");
//     document.body.style.padding = 0;
//     document.body.style.margin = 0;
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
// }

// export default class Game {
//     constructor(){
//         this.loop = loop;
//         this.fps = 15;
//     }

//     startAnimating(){
//         fpsInterval = 1000/fps;
//         then = Date.now();
//         startTime = then;
//         animate();
//     }

//     animate(){
//         requestAnimationFrame(animate);
//         now = Date.now();
//         elapsed = now - then;
//         if(elapsed > fpsInterval){
//             then = now - (elapsed % fpsInterval);
//             //clear canvas between each animation frame
//             ctx.clearRect(0, 0, canvas.width, canvas.height);
//             //draws our background and where to start drawing from
//             ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
//                                                                                             //change these to change size of sprite
//             drawSprite(playerSprite, player.width * player.frameX, player.height * player.frameY, player.width, player.height, player.x, player.y, player.width, player.height);
//                                     //what to crop and where to start cropping from in sprite sheet
//             if(!music.paused){
//                 ctx.drawImage(audioImg, 2, 2, canvas.width/50, canvas.height/30);
//             }else{
//                 ctx.drawImage(muteImg, 2, 2, canvas.width/50, canvas.height/30);
//             }
//             if(player.moving) walkSound.play();
//             movePlayer();
//             moveSprite();
//         }
//     }

// }


// window.onload = function(){
//     console.log("gameloop");
//     prepareCanvas();
//     startAnimating(15);
// }