class Player{
    constructor(){
        //this will be where the player is located at all times(the center of the screen)(x,y)
        this.x = canvas.width/2;
        this.y = canvas.height/2;
        //playersize, just a random number right now
        this.size = 1;
        this.health = 1;
        //keep track of the direction the player is facing
        this.lookDirection = 1;
    }
}