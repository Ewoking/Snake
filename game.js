let playButton = document.querySelector(".play-btn");
let replayButton = document.querySelector(".replay-btn");
let scoreDisplay = document.querySelector(".score").childNodes[1];
let scoreBoard = document.querySelector(".score-board");

let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

let tileSize = 40;
let snakeRadius = 7;
let colors = {
    background: "#f0975b", /*#e69b63 , #f0975b*/
    snakeColor: "#86f72f", /*#72eb15 #86f72f */
    sweetColor: "#2176ff"
}

const UP = 0;
const RIGHT = 1;
const DOWN = 2;
const LEFT = 3;

let score = 0;

//init CANVAS
if(window.matchMedia("(max-width: 800px)").matches){
    canvas.width = 480;
    canvas.height = 360;
    tileSize = 24;
    snakeRadius = 4;
}
ctx.fillStyle = colors.background;
ctx.fillRect(0,0,canvas.width,canvas.height);

let inputs = {
    up:false,
    down:false,
    left:false,
    right:false
}
let inputDirection = RIGHT;


//CLASSES -----------
class Tile {
    constructor(x=0,y=0){
        this.x = x;
        this.y = y;
    }

    position(){
        return {
            x: this.x*tileSize,
            y: this.y*tileSize
        }
    }
}

class Sweet{
    constructor(){
        this.tile = new Tile(0,0);
        this.setNewPosition();
    }

    setNewPosition(){
        this.tile.x = getRandomInteger(0,Math.floor(canvas.width/tileSize)-1);
        this.tile.y = getRandomInteger(0,Math.floor(canvas.height/tileSize)-1);
        // colors.sweetColor = `hsl(${getRandomInteger(0,360)}, 100%, 34%)`;
    }

    draw(){
        ctx.beginPath();
        ctx.fillStyle = colors.sweetColor;
        ctx.arc(this.tile.position().x + tileSize/2,this.tile.position().y + tileSize/2, tileSize/2, 0, 2*Math.PI);
        ctx.fill();
        ctx.closePath();
    }
}

let sweet = new Sweet();

class Snake{
    constructor(){
        this.positions = [
            new Tile(5,5),
            new Tile(4,5),
            new Tile(3,5),
            new Tile(2,5),
        ]
        this.length = this.positions.length;
        this.color = colors.snakeColor;
        this.direction = RIGHT;
    }

    draw(){

        for(let i=0; i< this.positions.length; i++){
            ctx.fillStyle = this.color;
            //ctx.fillRect(this.positions[i].position().x,this.positions[i].position().y, tileSize, tileSize);
            ctx.beginPath();
            ctx.moveTo(this.positions[i].position().x + snakeRadius, this.positions[i].position().y);

            ctx.arcTo(this.positions[i].position().x + tileSize, this.positions[i].position().y, this.positions[i].position().x + tileSize, this.positions[i].position().y + tileSize - snakeRadius, snakeRadius);

            ctx.arcTo(this.positions[i].position().x + tileSize, this.positions[i].position().y + tileSize, this.positions[i].position().x + snakeRadius, this.positions[i].position().y + tileSize, snakeRadius);

            ctx.arcTo(this.positions[i].position().x, this.positions[i].position().y + tileSize, this.positions[i].position().x, this.positions[i].position().y + snakeRadius, snakeRadius);

            ctx.arcTo(this.positions[i].position().x, this.positions[i].position().y, this.positions[i].position().x + snakeRadius, this.positions[i].position().y, snakeRadius);

            ctx.fill();
            ctx.closePath();
        }


        ctx.beginPath();
        ctx.fillStyle = 'white'
        ctx.arc(this.positions[0].position().x + tileSize/2, this.positions[0].position().y + tileSize/2, tileSize/5, 0, 2*Math.PI);
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.fillStyle = 'black'
        ctx.arc(this.positions[0].position().x + tileSize/2, this.positions[0].position().y + tileSize/2, tileSize/8, 0, 2*Math.PI);
        ctx.fill();
        ctx.closePath();
    }

    move(){
        let copy = JSON.parse(JSON.stringify(this.positions[0]));

        switch(this.direction){
            case UP:
                copy.y--;
                this.positions.unshift(new Tile(copy.x, copy.y))
                break;
            case DOWN:
                copy.y++;
                this.positions.unshift(new Tile(copy.x, copy.y))
                break;
            case LEFT:
                copy.x--;
                this.positions.unshift(new Tile(copy.x, copy.y))
                break;
            case RIGHT:
                copy.x++;
                this.positions.unshift(new Tile(copy.x, copy.y))
                break;
        }
        if(!this.isEating(sweet.tile.x, sweet.tile.y)){
            this.positions.pop();
        }else{
            do{
                sweet.setNewPosition();
            }while(this.isOnSnake(sweet.tile.x,sweet.tile.y))
            score += 10;
            scoreDisplay.textContent = "SCORE : " + score;
        }
        
    }

    isEating(x,y){
        return (this.positions[0].x == x && this.positions[0].y == y)
    }
    
    isOnSnake(x,y){
        for(let i = 0; i < this.positions.length; i++){
            if(this.positions[i].x == x && this.positions[i].y == y){

                return true;    
            }
        }
        return false;
    }
    
}




let snake = new Snake();




function checkCollision(){
    let xMax = Math.floor(canvas.width/tileSize)-1;
    let yMax = Math.floor(canvas.height/tileSize)-1;
    //borders collisons
    if(snake.positions[0].x > xMax || snake.positions[0].y > yMax ||snake.positions[0].x < 0 || snake.positions[0].y < 0){
        console.log(`You're DEAD !`);
        return true;
    }
    
    //snake self colliding 
    let x = snake.positions[0].x;
    let y = snake.positions[0].y;
    for(let i = 1; i < snake.positions.length-1; i++){
        if(snake.positions[i].x == x && snake.positions[i].y == y){
            console.log("snake TRAP")
            return true;
        }
    }
    return false;
}

function inputManager(e){
    e.preventDefault();
    if(e.type === "keydown"){
        switch(e.key){
            case "ArrowUp":
                inputs.up = true;
                break;
            case "ArrowDown":
                inputs.down = true;
                break;
            case "ArrowLeft":
                inputs.left = true;
                break;
            case "ArrowRight":
                inputs.right = true;
                break;
        }
    }else{
        switch(e.key){
            case "ArrowUp":
                inputs.up = false;
                break;
            case "ArrowDown":
                inputs.down = false;
                break;
            case "ArrowLeft":
                inputs.left = false;
                break;
            case "ArrowRight":
                inputs.right = false;
                break;
        }
    }

    //change direction of snake
    if(Object.values(inputs).filter(bool => bool).length == 1){
        switch(true){
            case inputs.up :
                if(snake.direction != DOWN){
                    inputDirection = UP;
                }
                break;
            case inputs.down :
                if(snake.direction != UP){
                    inputDirection = DOWN;
                }
                break;
            case inputs.left :
                if(snake.direction != RIGHT){
                    inputDirection = LEFT;
                }
                break;
            case inputs.right :
                if(snake.direction != LEFT){
                    inputDirection = RIGHT;
                }
                break;
        }
    }
}

function changeDirection(){
    snake.direction = inputDirection;
}

function endGame(bool){
    if(!bool){
        console.log('PERDU')
        clearInterval(timer);
        ctx.beginPath();
        ctx.font = "48px 'Rye'";
        ctx.textAlign = "center"
        ctx.fillStyle = 'black';
        ctx.fillText('GAME OVER', canvas.width/2,canvas.height/2);
    }
    
    replayButton.classList.remove("invisible");
    let scoreEntry = document.createElement('li');
    scoreEntry.textContent = score;
    scoreBoard.children[3].insertBefore(scoreEntry, scoreBoard.children[3].firstChild);
    console.log(scoreBoard.children[3].children);
    if(scoreBoard.children[3].children.length > 5) {
        scoreBoard.children[3].removeChild(scoreBoard.children[3].lastChild);
    }
    if(+scoreBoard.children[1].textContent < score){
        scoreBoard.children[1].textContent = score;
    }
}


function gameLoop(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = colors.background;
    ctx.fillRect(0,0,canvas.width,canvas.height);
    changeDirection();
    snake.move();
    if(checkCollision()){
        return endGame(false);
    }
    snake.draw();
    sweet.draw();

}

function reset(){
    snake.positions = [
        new Tile(5,5),
        new Tile(4,5),
        new Tile(3,5),
        new Tile(2,5),
    ]
    snake.length = snake.positions.length;
    snake.direction = RIGHT;
    inputDirection = RIGHT;
    score = 0;
    scoreDisplay.textContent = "SCORE : 0";

    timer = setInterval(gameLoop,100);
    replayButton.classList.add("invisible");
}

let timer;

// EVENTS ---------
window.addEventListener("keydown",inputManager);
window.addEventListener("keyup",inputManager);
window.addEventListener("keydown", (e)=>{
    if(e.key == "Enter" && !replayButton.classList.contains("invisible")){
        reset();
    }
})
replayButton.addEventListener("click", reset);
playButton.addEventListener("click", ()=> {
    timer = setInterval(gameLoop,100);
    playButton.classList.add("invisible")
})