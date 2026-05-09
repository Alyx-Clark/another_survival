import Player from "./player";
import Enemy from "./enemy";
import Obstacle from "./obstacle.js";
import Button from "./button.js";

const BASE_WIDTH = 1503;
const BASE_HEIGHT = 947;

const BASE_OBSTACLES = [
    [190, 30, 150, 110],
    [395, 30, 145, 110],
    [605, 30, 150, 110],
    [190, 680, 150, 110],
    [540, 680, 160, 110],
    [945, 685, 150, 100],
    [190, 435, 80, 90],
    [385, 435, 110, 90],
    [280, 375, 170, 100],
    [665, 435, 60, 90],
    [840, 435, 130, 90],
    [720, 375, 190, 90],
    [1330, 710, 302, 80],
    [1100, 70, 250, 125],
    [1, 430, 110, 30],
    [1465, 370, 10, 1],
    [30, 1, 120, 90],
    [1395, 110, 120, 90],
    [1287, 285, 120, 70],
    [972, 437, 120, 70],
    [1380, 560, 120, 70],
    [1060, 620, 120, 70],
    [370, 725, 135, 80],
    [1035, 235, 50, 1],
    [840, 820, 10, 1],
    [1100, 785, 30, 1],
    [128, 495, 30, 1],
    [509, 435, 140, 1],
];

export default class Game {
    constructor(){
        this.canvas = document.getElementById("canvas1");
        this.ctx = this.canvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = false;
        document.body.scrollTop = 0;
        document.body.style.overflow = "auto";
        document.documentElement.style.overflow = "auto";

        this.baseWidth = BASE_WIDTH;
        this.baseHeight = BASE_HEIGHT;
        this.keys = {};
        this.touchInput = {};
        this.enemies = [];
        this.obstacles = [];
        this.currentLevelIndex = 0;
        this.levelStartedAt = 0;
        this.gameStarted = false;
        this.paused = false;
        this.counter = 0;
        this.lastFrame = 0;
        this.spriteTimer = 0;
        this.damageCooldown = null;
        this.assetBasePath = window.location.pathname.startsWith("/another-survival") ? "/another-survival" : ".";

        this.audioButton = new Button(12, 12, 56, 56);
        this.music = document.createElement("audio");
        this.audioImg = new Image();
        this.muteImg = new Image();
        this.heart = new Image();
        this.walkSound = document.createElement("audio");
        this.damage = document.createElement("audio");
        this.playerSprite = new Image();
        this.enemySprite = new Image();
        this.background = new Image();
        this.gameOverImg = new Image();
        this.winImg = new Image();

        this.loadInitialComponents();
        this.levels = this.createLevels();
        this.resizeCanvas();
        this.loadLevel(0, true);
        this.registerEvents();
        this.animate();
        this.title();
    }

    loadInitialComponents(){
        this.background.src = this.assetPath("images/zombiecity.png");
        this.enemySprite.src = this.assetPath("images/ghost.png");
        this.playerSprite.src = this.assetPath("images/player_sprite_resize.png");
        this.walkSound.src = this.assetPath("sounds/walking.wav");
        this.walkSound.loop = true;
        this.walkSound.playbackRate = 1.35;
        this.muteImg.src = this.assetPath("images/muteButton.png");
        this.music.src = this.assetPath("sounds/Haunted_Swamp.wav");
        this.audioImg.src = this.assetPath("images/soundButton.png");
        this.gameOverImg.src = this.assetPath("images/game-over.png");
        this.damage.src = this.assetPath("sounds/hit.wav");
        this.heart.src = this.assetPath("images/heart.png");
        this.winImg.src = this.assetPath("images/win.png");
    }

    createLevels(){
        return [
            {
                name: "Haunted Arrival",
                start: { x: 100, y: 170 },
                exit: { x: 0, y: 800, width: 70, height: 130 },
                ghosts: [
                    { x: 760, y: 580, speed: 0.92, delay: 2500 },
                    { x: 500, y: 300, speed: 0.86, delay: 3500 },
                    { x: 10, y: 840, speed: 0.82, delay: 11000 },
                ],
            },
            {
                name: "Cross Streets",
                start: { x: 90, y: 820 },
                exit: { x: 1430, y: 45, width: 70, height: 125 },
                ghosts: [
                    { x: 740, y: 150, speed: 0.88, delay: 1400 },
                    { x: 900, y: 610, speed: 0.84, delay: 2600 },
                    { x: 1260, y: 830, speed: 0.78, delay: 8000 },
                ],
            },
            {
                name: "Last Lantern",
                start: { x: 1390, y: 70 },
                exit: { x: 0, y: 455, width: 65, height: 120 },
                ghosts: [
                    { x: 760, y: 580, speed: 0.9, delay: 800 },
                    { x: 520, y: 160, speed: 0.84, delay: 2100 },
                    { x: 1180, y: 735, speed: 0.8, delay: 4300 },
                    { x: 130, y: 835, speed: 0.74, delay: 10000 },
                ],
            },
        ];
    }

    assetPath(path){
        if (this.assetBasePath === ".") return `./${path}`;
        return `${this.assetBasePath}/${path}`;
    }

    registerEvents(){
        const movementKeys = new Set(["w", "a", "s", "d", "W", "A", "S", "D", "ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight"]);

        window.addEventListener("keydown", (e) => {
            if (movementKeys.has(e.key)) e.preventDefault();
            this.keys[e.key] = true;
        });

        window.addEventListener("keyup", (e) => {
            if (movementKeys.has(e.key)) e.preventDefault();
            delete this.keys[e.key];
        });

        window.addEventListener("resize", () => {
            this.resizeCanvas();
        });

        window.addEventListener("click", (e) => {
            if((e.x > this.audioButton.x && e.x < this.audioButton.endx) && (e.y > this.audioButton.y && e.y < this.audioButton.endy)){
                if(this.music.paused){
                    this.music.play();
                    this.music.loop = true;
                }else{
                    this.music.pause();
                    this.walkSound.pause();
                    this.walkSound.currentTime = 0;
                }
            }
        });

        document.querySelectorAll("[data-touch-key]").forEach((button) => {
            const key = button.dataset.touchKey;
            const press = (e) => {
                e.preventDefault();
                this.touchInput[key] = true;
                button.classList.add("is-pressed");
            };
            const release = (e) => {
                e.preventDefault();
                delete this.touchInput[key];
                button.classList.remove("is-pressed");
            };

            button.addEventListener("pointerdown", press);
            button.addEventListener("pointerup", release);
            button.addEventListener("pointercancel", release);
            button.addEventListener("pointerleave", release);
        });
    }

    title(){
        this.canvas.style.display = "none";
        document.getElementById("button12").style.display = "none";
        document.getElementById("death-center").style.display = "none";
        document.getElementById("survive-center").style.display = "none";
        document.getElementById("touch-controls").style.display = "none";

        const playButton = document.getElementById("button1");
        playButton.addEventListener("click", () => {
            document.getElementById("title").style.display = "none";
            document.getElementById("title2").style.display = "none";
            document.getElementById("button12").style.display = "flex";
            document.getElementById("touch-controls").style.display = "";
            document.body.classList.add("is-playing");
            document.body.style.overflow = "hidden";
            document.documentElement.style.overflow = "hidden";
            this.canvas.style.display = "block";
            this.gameStarted = true;
            this.levelStartedAt = performance.now();
            this.lastFrame = performance.now();
        });

        document.getElementById("button12").addEventListener("click", () => {
            location.reload();
        });
    }

    resizeCanvas(){
        const previousScaleX = this.currentX || 1;
        const previousScaleY = this.currentY || 1;
        const playerBase = this.player1 ? this.toBasePoint(this.player1.x, this.player1.y, previousScaleX, previousScaleY) : null;
        const enemyBases = this.enemies.map((enemy) => this.toBasePoint(enemy.x, enemy.y, previousScaleX, previousScaleY));

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx.imageSmoothingEnabled = false;
        this.currentX = this.canvas.width / this.baseWidth;
        this.currentY = this.canvas.height / this.baseHeight;
        this.playerWidth = this.clamp(this.canvas.width * 0.03, 28, 48);
        this.playerHeight = this.playerWidth * 1.61;
        this.enemyWidth = this.clamp(this.canvas.width * 0.032, 30, 52);
        this.enemyHeight = this.enemyWidth * 1.25;
        this.playerSpeed = this.clamp(this.canvas.width / 8, 130, 210);
        this.enemyBaseSpeed = this.clamp(this.canvas.width / 10.5, 78, 122);
        this.audioButton = new Button(12, 12, 58, 58);

        const level = this.levels ? this.levels[this.currentLevelIndex] : null;
        if (level) {
            this.obstacles = this.createObstacles();
            this.exit = this.scaleRect(level.exit);
        }

        if (this.player1 && playerBase) {
            this.player1.scaleWidth = this.playerWidth;
            this.player1.scaleHeight = this.playerHeight;
            this.player1.speed = this.playerSpeed;
            this.player1.obstacles = this.obstacles;
            this.player1.x = this.clamp(this.screenX(playerBase.x), 0, this.canvas.width - this.player1.scaleWidth);
            this.player1.y = this.clamp(this.screenY(playerBase.y), 0, this.canvas.height - this.player1.scaleHeight);
        }

        this.enemies.forEach((enemy, index) => {
            const enemyBase = enemyBases[index];
            if (!enemyBase) return;

            enemy.scaleWidth = this.enemyWidth;
            enemy.scaleHeight = this.enemyHeight;
            enemy.obstacles = this.obstacles;
            enemy.speed = this.enemyBaseSpeed * (enemy.speedFactor || 1);
            enemy.x = this.clamp(this.screenX(enemyBase.x), 0, this.canvas.width - enemy.scaleWidth);
            enemy.y = this.clamp(this.screenY(enemyBase.y), 0, this.canvas.height - enemy.scaleHeight);
        });
    }

    loadLevel(levelIndex, keepHealth = false){
        const level = this.levels[levelIndex];
        const currentHealth = this.player1 && keepHealth ? this.player1.health : 3;
        this.currentLevelIndex = levelIndex;
        this.levelStartedAt = performance.now();
        this.obstacles = this.createObstacles();
        this.exit = this.scaleRect(level.exit);

        this.player1 = new Player(
            this.canvas,
            this.screenX(level.start.x),
            this.screenY(level.start.y),
            42.5,
            68.5,
            this.playerWidth,
            this.playerHeight,
            0,
            3,
            this.playerSpeed,
            false,
            0,
            currentHealth,
            this.obstacles,
            true,
            false
        );

        this.enemies = level.ghosts.map((ghost) => {
            const enemy = new Enemy(
                this.canvas,
                this.screenX(ghost.x),
                this.screenY(ghost.y),
                64,
                64,
                this.enemyWidth,
                this.enemyHeight,
                0,
                3,
                this.enemyBaseSpeed * ghost.speed,
                false,
                0,
                3,
                this.obstacles,
                true
            );
            enemy.speedFactor = ghost.speed;
            enemy.spawnDelay = ghost.delay;
            return enemy;
        });

        this.showLevelBanner(level);
    }

    createObstacles(){
        return BASE_OBSTACLES.map(([x, y, width, height]) => {
            return new Obstacle(this.screenX(x), this.screenY(y), this.screenX(width), this.screenY(height));
        });
    }

    showLevelBanner(level){
        this.levelBanner = {
            text: `Level ${this.currentLevelIndex + 1}: ${level.name}`,
            until: performance.now() + 2200,
        };
    }

    toBasePoint(x, y, scaleX = this.currentX, scaleY = this.currentY){
        return { x: x / scaleX, y: y / scaleY };
    }

    screenX(value){
        return value * this.currentX;
    }

    screenY(value){
        return value * this.currentY;
    }

    scaleRect(rect){
        return {
            x: this.screenX(rect.x),
            y: this.screenY(rect.y),
            width: this.screenX(rect.width),
            height: this.screenY(rect.height),
        };
    }

    clamp(value, min, max){
        return Math.max(min, Math.min(value, max));
    }

    rectsOverlap(a, b){
        return (
            a.x < b.x + b.width &&
            a.x + a.scaleWidth > b.x &&
            a.y < b.y + b.height &&
            a.y + a.scaleHeight > b.y
        );
    }

    loseHealth(){
        const hit = this.enemies.some((enemy) => {
            return this.rectsOverlap(this.player1, {
                x: enemy.x,
                y: enemy.y,
                width: enemy.scaleWidth,
                height: enemy.scaleHeight,
            });
        });

        if (!hit || this.player1.blinking) return;

        if(!this.music.paused) this.damage.play();
        this.player1.health--;
        this.player1.blinking = true;
        window.clearTimeout(this.damageCooldown);
        this.damageCooldown = window.setTimeout(() => {
            this.player1.blinking = false;
        }, 1500);

        if(this.player1.health === 0){
            this.player1.alive = false;
            document.getElementById("death-center").style.display = "flex";
            document.getElementById("button2").addEventListener("click", () => {
                location.reload();
            }, { once: true });
            this.paused = true;
            this.stopWalking();
        }
    }

    winGame(){
        if(!this.rectsOverlap(this.player1, this.exit)) return;

        if (this.currentLevelIndex < this.levels.length - 1) {
            this.loadLevel(this.currentLevelIndex + 1, true);
            return;
        }

        document.getElementById("survive-center").style.display = "flex";
        document.getElementById("button3").addEventListener("click", () => {
            location.reload();
        }, { once: true });
        this.paused = true;
        this.stopWalking();
    }

    drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH){
        this.ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
    }

    drawExit(){
        this.ctx.save();
        this.ctx.fillStyle = "rgba(224, 217, 145, 0.28)";
        this.ctx.strokeStyle = "rgba(255, 244, 175, 0.92)";
        this.ctx.lineWidth = 3;
        this.ctx.fillRect(this.exit.x, this.exit.y, this.exit.width, this.exit.height);
        this.ctx.strokeRect(this.exit.x, this.exit.y, this.exit.width, this.exit.height);
        if (this.exit.width > 44) {
            this.ctx.fillStyle = "#fff0a6";
            this.ctx.font = "700 14px Arial, sans-serif";
            this.ctx.textAlign = "center";
            this.ctx.fillText("EXIT", this.exit.x + this.exit.width / 2, this.exit.y + Math.max(18, this.exit.height / 2));
        }
        this.ctx.restore();
    }

    drawHud(now){
        const iconSize = 34;
        for (let i = 0; i < this.player1.health; i++) {
            this.ctx.drawImage(this.heart, 14, 72 + (i * 40), iconSize, iconSize);
        }

        this.ctx.drawImage(this.music.paused ? this.muteImg : this.audioImg, 12, 12, 42, 42);

        this.ctx.save();
        this.ctx.fillStyle = "rgba(10, 12, 8, 0.56)";
        this.ctx.fillRect(this.canvas.width - 154, 14, 140, 38);
        this.ctx.fillStyle = "#f6e7a9";
        this.ctx.font = "700 16px Arial, sans-serif";
        this.ctx.textAlign = "center";
        this.ctx.fillText(`Level ${this.currentLevelIndex + 1}/${this.levels.length}`, this.canvas.width - 84, 39);

        if (this.levelBanner && now < this.levelBanner.until) {
            this.ctx.fillStyle = "rgba(10, 12, 8, 0.68)";
            this.ctx.fillRect(this.canvas.width / 2 - 170, 24, 340, 48);
            this.ctx.fillStyle = "#f7e6a4";
            this.ctx.font = "700 20px Arial, sans-serif";
            this.ctx.fillText(this.levelBanner.text, this.canvas.width / 2, 55);
        }
        this.ctx.restore();
    }

    updateAudio(){
        if(this.player1.moving && !this.music.paused){
            this.walkSound.play();
        } else {
            this.stopWalking();
        }
    }

    stopWalking(){
        this.walkSound.pause();
        this.walkSound.currentTime = 0;
    }

    animate(timestamp = 0){
        requestAnimationFrame(this.animate.bind(this));
        const deltaTime = Math.min(((timestamp - this.lastFrame) / 1000) || (1 / 60), 0.05);
        this.lastFrame = timestamp;

        if(!this.gameStarted || this.paused) return;

        const elapsed = timestamp - this.levelStartedAt;
        this.spriteTimer += deltaTime;
        const shouldAdvanceSprite = this.spriteTimer > 0.12;
        if (shouldAdvanceSprite) this.spriteTimer = 0;

        this.player1.movePlayer(this.keys, deltaTime, this.touchInput);
        if (shouldAdvanceSprite) this.player1.moveSprite();

        this.enemies.forEach((enemy) => {
            enemy.froze = elapsed < enemy.spawnDelay;
            if (!enemy.froze) {
                enemy.moveEnemy(this.player1, deltaTime);
                if (shouldAdvanceSprite) enemy.moveSprite();
            }
        });

        this.loseHealth();
        this.winGame();
        this.updateAudio();

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.background, 0, 0, this.canvas.width, this.canvas.height);
        this.drawExit();

        if (!this.player1.blinking || Math.floor(timestamp / 120) % 2 === 0) {
            this.drawSprite(
                this.playerSprite,
                this.player1.width * this.player1.frameX,
                this.player1.height * this.player1.frameY,
                this.player1.width,
                this.player1.height,
                this.player1.x,
                this.player1.y,
                this.player1.scaleWidth,
                this.player1.scaleHeight
            );
        }

        this.enemies.forEach((enemy) => {
            this.ctx.globalAlpha = enemy.froze ? 0.48 : 1;
            this.drawSprite(
                this.enemySprite,
                enemy.width * enemy.frameX,
                enemy.height * enemy.frameY,
                enemy.width,
                enemy.height,
                enemy.x,
                enemy.y,
                enemy.scaleWidth,
                enemy.scaleHeight
            );
            this.ctx.globalAlpha = 1;
        });

        this.drawHud(timestamp);
    }
}
