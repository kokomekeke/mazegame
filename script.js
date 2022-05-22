var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var dir = [ 'up' , 'down' , 'left' , 'right'];
var grammar = '#JSGF V1.0; grammar dir; public <dir> = ' + dir.join(' | ') + ' ;'

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();

speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

var recStarted = false;
var isGameStarted = false;
var isSizeSet = false;
var algSelected = false;

var algorythm;

let size = 5;

let levels = [];

let i = 0;

function Game(id, level) {
    
    this.el = document.getElementById(id);

    this.tileTypes = ['floor', 'wall'];

    this.tileDim = 32;

    this.map = level.map;

    this.theme = level.theme;


    this.player = {...level.player};

    this.goal = {...level.goal};
    
    this.player.el = null;

}

Game.prototype.populateMap = function () {

    this.el.className = 'game-container ' + this.theme;

    let tiles = document.getElementById('tiles');

    for (var y = 0; y < this.map.length; ++y) {

        for (var x = 0; x < this.map[y].length; ++x) {

            let tileCode = this.map[y][x];

            let tileType = this.tileTypes[tileCode];

            let tile = this.createEl(x, y, tileType);

            tiles.appendChild(tile);

        }
    }
}

Game.prototype.createEl = function (x, y, type) {

    let el = document.createElement('div');

    el.className = type;

    el.style.width = el.style.height = this.tileDim + 'px';
    //
    //na itt
    //
    el.style.left = x * this.tileDim + 'px';

    el.style.top = y * this.tileDim + 'px';

    return el;

}

Game.prototype.sizeUp = function () {

    let map = this.el.querySelector('.game-map');

    map.style.height = this.map.length * this.tileDim + 'px';

    map.style.width = this.map[0].length * this.tileDim + 'px';



}

Game.prototype.placeSprite = function (type) {

    let x = this[type].x;

    let y = this[type].y;

    let sprite = this.createEl(x,y,type);

    sprite.id = type;

    sprite.style.borderRadius = this.tileDim + 'px';

    let layer = this.el.querySelector('#sprites');

    layer.appendChild(sprite);

    return sprite;

}

Game.prototype.movePlayer = function (event) {

    event.preventDefault();

    if (event.keyCode < 37 || event.keyCode > 40) {
        return;
    }

    switch (event.keyCode) {

        case 37:
            this.moveLeft();
        break;

        case 38:
            this.moveUp();
        break;

        case 39:
            this.moveRight();
        break;

        case 40:
            this.moveDown();
        break;

    }

}

Game.prototype.moveUp = function() {
   
    if (this.player.y == 0) {

        return;

    }

    let nextTile = this.map[this.player.y-1][this.player.x];

    if (nextTile == 1) {
        
        return;

    }

    this.player.y -= 1;

    this.updateVert();

}

Game.prototype.moveDown = function() {

    if (this.player.y == this.map.length - 1) {
        
        return;

    }

    let nextTile = this.map[this.player.y+1][this.player.x];

    if (nextTile == 1) {

        return;

    }

    this.player.y += 1;

    this.updateVert();

}

Game.prototype.moveLeft = function() {

    if (this.player.x == 0) {

        return;

    }

    let nextTile = this.map[this.player.y][this.player.x - 1];

    if (nextTile == 1) {

        return;

    }

    this.player.x -= 1;

    this.updateHoriz();

}

Game.prototype.moveRight = function() {

    if (this.player.x == this.map[this.player.y].length - 1) {

        return;

    }

    let nextTile = this.map[this.player.y][this.player.x + 1];
        
    if (nextTile == 1) {

        return;
    
    }

    this.player.x += 1;

    this.updateHoriz();

}

Game.prototype.updateVert = function () {

    this.player.el.style.top = this.player.y * this.tileDim + 'px';

}

Game.prototype.updateHoriz = function () {

    this.player.el.style.left = this.player.x * this.tileDim + 'px';

}

Game.prototype.keyboardListener = function () {
    
    document.addEventListener ('keydown', event => {

        this.movePlayer(event);

        this.checkGoal();

    });
}

Game.prototype.voiceListener = function () {
    
    if (!recStarted)
    recognition.start();
    console.log("start");

    recStarted = true;
    


    recognition.onresult = function(event) {
        var dir = event.results[0][0].transcript;
        console.log(dir);

        

        if (dir == "up" || dir == "Up.") {
            
            this.moveUp();
            this.checkGoal();
            //
            

        } else 
        
        if (dir == "down" || dir == "Down.") {

            this.moveDown();
            this.checkGoal();
            //
            

        }  else

        if (dir == "left" || dir == "Left.") {

            this.moveLeft();
            this.checkGoal();
            //
           

        } else

        if (dir == "right" || dir == "Right.") {

            this.moveRight();
            this.checkGoal();
            //
            

        } else 

        if (dir == "quit" || dir == "Quit.") {

            quit();
            commandListener();
            //
            

        } else 

        if (dir == "next" || dir == "Next.") {
            let body = document.querySelector('body');
            if (body.className == 'success') {
                console.log("asdd");
                nextLevel();
                //
               

            }

        }

        
        
        
    }.bind(this);


    //visszarakni
    
      recognition.onend = function() {
          //if (recStarted) {
            console.log('speech ended');
            recognition.stop();
            recognition.start();
            //recStarted = false;
          //}
        
      }
        
    
}

Game.prototype.checkGoal = function () {
    console.log("check goal");
    let body = document.querySelector('body');

    if (this.player.y == this.goal.y && this.player.x == this.goal.x) {

        body.className = 'success';
        
        document.getElementById('button').style.visibility = 'visible';

        //isGameStarted = false;        


    } else {
        document.getElementById('button').style.visibility = 'hidden';
        body.className = '';

    }

}

Game.prototype.drawMazePrim = function (Game, level) {

    console.log("prim");

    this.player.y = 4;
    this.player.x = 0;

    //
    //0 - unvisited wall
    //1 - visited cel
    
    let grid = matrix(size, 0);

    //
    //
    //list of walls
    let wallList = {
        y: [],
        x: []
    }

    
    this.map[this.player.y][this.player.x] = 0;
    grid[this.player.y][this.player.x] = 1;

    //+1 és -1 eseket elhagytam
    if (this.player.y > 0) {

        wallList.y.push(this.player.y - 1);
        wallList.x.push(this.player.x);

    }

    if (this.player.y + 1 < this.map.length) {

        wallList.y.push(this.player.y + 1);
        wallList.x.push(this.player.x);

    }

    if (this.player.x > 0) {

        wallList.y.push(this.player.y);
        wallList.x.push(this.player.x - 1);

    }

    if (this.player.x + 1 < this.map.length) {

        wallList.y.push(this.player.y);
        wallList.x.push(this.player.x + 1);

    }
    
    
    
    while (wallList.y.length > 0) {
        
        let rand = Math.floor(Math.random() * wallList.y.length);
    
        let j = 0;

        let y = wallList.y[rand];//pl 3 v 2
        let x = wallList.x[rand];//pl 3 v 2


        if (y > 0 && grid[y - 1][x] == 1) {
            j ++;
        }
        if (y + 1 < grid[y].length && grid[y + 1][x] == 1) {
            j ++;
        }
        if (x > 0 && grid[y][x - 1] == 1) {
            j ++;
        }
        if (x + 1 < wallList.x.length && grid[y][x + 1] == 1) {
            j ++;
        }

        if (j == 1) {
            this.map[wallList.y[rand]][wallList.x[rand]] = 0;
            grid[wallList.y[rand]][wallList.x[rand]] = 1;

            //-1 +1
            if (y > 0) {  
                wallList.y.push(y - 1);
                wallList.x.push(x);
            }

            if (y + 1 < grid[y].length) {
                wallList.y.push(y + 1);
                wallList.x.push(x);
            }

            if (x > 0) {
                wallList.y.push(y);
                wallList.x.push(x - 1);
            }

            if (x + 1 < grid[x].length) {
                wallList.y.push(y);
                wallList.x.push(x + 1);
            }
            
        }

        wallList.y.splice(rand, 1);
        wallList.x.splice(rand, 1);

        console.log("2) " + wallList.y + "\n   " + wallList.x)
    }
    
    //annak ellenörzése, hogy ne legyen a cél falban
    while (this.map[this.goal.y][this.goal.x] == 1) {
        let rand = Math.floor(Math.random() * 2);
        console.log("rand:"+rand);
        if (rand == 2 || this.goal.y + 1 !== this.map.length) {
            this.goal.y ++;
        } else this.goal.x ++;
    }
}

Game.prototype.drawMaze = function (Game, level) {
    console.log("iterative");


    //2*size-1 nek kell a rácsosság miatt lennie a méretnek
    //size*2-1
    let sizeM = size*2-1;

    this.map = matrix(sizeM, 1);

    //a rácsosság létrehozása
    for (let i = 0; i < sizeM; i ++) {
        for (let j = 0; j < sizeM; j ++) {
            if (j % 2 ==0 && i % 2 == 0) {
                this.map[i][j] = 0;
            }
        }
    }

    // az n-edik elempárok koordináták
    let stack = {
        y: [],
        x: []
    };

    // az n edik elempárok a már meglátogatott cellákat jelölik
    let visited = {
        y: [],
        x: []
    }

    this.player.y = 4;
    this.player.x = 0;

    this.goal.y = 0;
    this.goal.x = 4;

    //initial cell is visited
    visited.y.push(this.player.y);
    visited.x.push(this.player.x);


    //
    //teszt adat
    //
    //visited.y.push(this.player.y-2);
    //visited.x.push(this.player.x);



    //initial cell
    stack.y.push(this.player.y);
    stack.x.push(this.player.x);

    console.log("player y: " + stack.y[0]);
    console.log("player x: " + stack.x[0]);

    j = 0
    while (stack.y.length > 0) {
        console.log("\n\nstack length: "+stack.y.length);
        let rand = Math.floor(Math.random() * stack.y.length);
        console.log("rand: " + rand);
        //pl [4,0]
        let current = {
            y: stack.y[rand],
            x: stack.x[rand]       
        }

        console.log("curY: " + current.y + "\ncurX: " + current.x);
        
        stack.y.splice(rand, 1);
        stack.x.splice(rand, 1);

        let unvisited = false;
        
        let unvisitedList = [];

        if (current.y > 1 && !contains(visited, current.y - 2, current.x)) {
            console.log("down");
            unvisited = true;
            unvisitedList.push("down");
        }
            
        if (current.y + 2 < this.map[0].length && !contains(visited, current.y + 2, current.x)) {
            console.log("up");
            unvisited = true;
            unvisitedList.push("up");
        }

        if (current.x > 1 && !contains(visited, current.y, current.x - 2)) {
            console.log("left");
            unvisited = true;
            unvisitedList.push("left");
            
        }
        
        if (current.x + 2 < this.map[0].length && !contains(visited, current.y, current.x + 2)) {
            console.log("right");
            unvisited = true;
            unvisitedList.push("right");
            
        }
        
        if (unvisited) {
            stack.y.push(current.y);
            stack.x.push(current.x);

            let rand2 = Math.floor(Math.random() * unvisitedList.length);
            
            console.log("rand2: "+ rand2);
            console.log("uList: "+unvisitedList);
            console.log("ulist element: "+unvisitedList[rand2]);

            switch (unvisitedList[rand2]) {

                case "down":
                    //stack.y.push(current.y);
                    //stack.x.push(current.x);


                    console.log("stack length: " + stack.y.length +"\nWall: " + (current.y - 1) + " " + current.x);
                    this.map[current.y - 1][current.x] = 0;
                    


                    visited.y.push(current.y - 2);
                    visited.x.push(current.x);
                    stack.y.push(current.y - 2);
                    stack.x.push(current.x);

                    console.log("stack: " + stack.y + "---" + stack.x);
                    //unvisitedList = [];
                break;

                case "up":
                    //stack.y.push(current.y);
                    //stack.x.push(current.x);

                    console.log("stack length: " + stack.y.length +"\nWall: " + (current.y + 1) + " " + current.x);
                    this.map[current.y + 1][current.x] = 0;
                    

                    visited.y.push(current.y + 2);
                    visited.x.push(current.x);
                    stack.y.push(current.y + 2);
                    stack.x.push(current.x);

                    console.log("stack: " + stack.y + "---" + stack.x);
                    //unvisitedList = [];
                break;

                case "left":
                    //stack.y.push(current.y);
                    //stack.x.push(current.x);

                    console.log("stack length: " + stack.y.length +"\nWall: " + current.y + " " + (current.x - 1));
                    this.map[current.y][current.x - 1] = 0;
                    

                    visited.y.push(current.y);
                    visited.x.push(current.x - 2);
                    stack.y.push(current.y);
                    stack.x.push(current.x - 2);

                    console.log("stack: " + stack.y + "---" + stack.x);
                    //unvisitedList = [];
                break;

                case "right":
                    //stack.y.push(current.y);
                    //stack.x.push(current.x);

                    console.log("stack length: " + stack.y.length +"\nWall: " + current.y + " " + (current.x + 1));
                    this.map[current.y][current.x + 1] = 0;
                    

                    visited.y.push(current.y );
                    visited.x.push(current.x + 2);
                    stack.y.push(current.y);
                    stack.x.push(current.x + 2);

                    console.log("stack: " + stack.y + "---" + stack.x);
                   // unvisitedList = [];
                break;

                default:
                    console.log("default");
            }
        } else console.log("skip");
        
        
        unvisitedList = [];
        j ++;
        
        //break;
    }
    
}

Game.prototype.drawMazeAldous = function (Game, level) {
    let sizeM = size*2-1;

    this.map = matrix(sizeM, 1);

    let unvisited = {
        y: [],
        x: []
    }

    this.player.y = 0;
    this.player.x = 0;

    this.goal.y = sizeM - 1;
    this.goal.x = sizeM - 1;

    //a rácsosság létrehozása
    for (let i = 0; i < sizeM; i ++) {
        for (let j = 0; j < sizeM; j ++) {
            if (j % 2 ==0 && i % 2 == 0) {
                this.map[i][j] = 0;

                unvisited.y.push(i);
                unvisited.x.push(j);
            }
        }
    }

    console.log("unv:\n"+unvisited.y + "\n" + unvisited.x + "\n\n");

    let current = {
        y: this.player.y,
        x: this.player.x      
    }

    let neighbour = [];

    let j = 0;
    while (unvisited.y.length > 0) {

        if (current.y > 1) {
            neighbour.push("down");
        }
            
        if (current.y + 2 < this.map[0].length) {
            neighbour.push("up");    
        }

        if (current.x > 1) {
            neighbour.push("left");   
        }
        
        if (current.x + 2 < this.map[0].length) {
            neighbour.push("right");   
        }

        console.log(neighbour);

        let rand = Math.floor(Math.random() * neighbour.length);

        let randNeighbour;

        console.log(rand + "\n  " + neighbour[rand]);

        switch (neighbour[rand]) {

            case "down":
                randNeighbour = {
                    y: current.y - 2,
                    x: current.x
                }
            break;

            case "up":
                randNeighbour = {
                    y: current.y + 2,
                    x: current.x
                }
            break;

            case "left":
                randNeighbour = {
                    y: current.y,
                    x: current.x - 2
                }
            break;

            case "right":
                randNeighbour = {
                    y: current.y,
                    x: current.x + 2
                }
            break;

            default:
                console.log("default");
        }

        if (contains(unvisited, randNeighbour.y, randNeighbour.x)) {
            //console.log("juhuuu");


            //
            this.map[(current.y + randNeighbour.y) / 2][(current.x + randNeighbour.x) / 2] = 0;
            deleteElement(unvisited, randNeighbour.y, randNeighbour.x);

            console.log("unv:\n"+unvisited.y + "\n" + unvisited.x + "\n\n");
        }

        current.y = randNeighbour.y;
        current.x = randNeighbour.x;
        
        neighbour = [];
    }
}

Game.prototype.drawMazeRecursive = function (Game, level) {
    console.log("Recursive\n");

    this.player.y = size - 2;
    this.player.x = 1;

    this.goal.y = 1;
    this.goal.x = size - 2;

    let count = 0;

    let matrix1 = matrix(size, 0);
    let matrix2, matrix3;

    //placeWall2(matrix1, false, 0, matrix1.length, 0, matrix1[0].length, count);
    addInnerWalls(matrix1, true,  0, matrix1.length, 0, matrix1[0].length);

    this.map = matrix1;
}

function placeWall (isVertical, start, end, count) {
    console.log("vert......" + isVertical);
    let newMatrix = matrix;

    sizeM = {
        y: matrix[0].length,
        x: matrix.length
    }

    console.log("\nsizeY " + sizeM.y);
    console.log("\nsizeX " + sizeM.x);
    console.log("\n");  

    let rand;

    if (isVertical) {

        rand = Math.floor(Math.random() * matrix.length);

    } else rand = Math.floor(Math.random() * matrix[0].length);

    
    while (rand % 2 !== 0) {

        if (isVertical) {

            rand = Math.floor(Math.random() * matrix.length);
        
        } else rand = Math.floor(Math.random() * matrix[0].length);

    }

    

    //i = y, j = x
    for (let i = 0; i < size; i ++) {
        for (let j = 0; j < size; j ++) {
            if (isVertical) {
                if (j == rand) {
                    matrix[i][j] = 1;
                } 
            } else {
                if (i == rand) {
                    matrix[i][j] = 1;
                } 
            }
        }
    }
    

    let rand2;

    if (isVertical) {

        rand2 = Math.floor(Math.random() * matrix.length);

    } else rand2 = Math.floor(Math.random() * matrix[0].length);

    
    
    while (rand2 % 2 == 0) {

        if (isVertical) {

            rand2 = Math.floor(Math.random() * matrix.length);
        
        } else rand2 = Math.floor(Math.random() * matrix[0].length);

    }

    for (let i = 0; i < size; i ++) {
        for (let j = 0; j < size; j ++) {
            if (isVertical) {
                if (j == rand && i == rand2) {
                   matrix[i][j] = 0;
                }
            } else {
                if (i == rand && j == rand2) {
                    matrix[i][j] = 0;
                }
            }
        }
    }
    count ++;
    if (count == 100) {
        return;
    }
    //placeWall(newMatrix, !this.isVertical, 0, (size-1-rand), count);
    placeWall(newMatrix, !this.isVertical, 0, (size-(size-rand)), count);
    
}


function placeWall2(matrix, isVertical, startY, endY, startX, endX, count) {
    console.log("\n\n\nmatrix " + matrix);
    console.log("count " + count);
    console.log("veritcal " + isVertical);
    console.log("startY " + startY);
    console.log("endY " + endY);
    console.log("startX " + startX);
    console.log("endX " + endX);
    //console.log("\n");  
    //let matrix1 = matrix;

    if (endX - startX < 2 || endY - startY < 2) {
        return;
    }


    let rand;

    if (isVertical) {

        rand = randomNumber(startX, endX);

    } else rand = randomNumber(startY, endY);
    
    while (rand % 2 !== 0) {

        if (isVertical) {

            rand = randomNumber(startX, endX);
        
        } else rand = randomNumber(startY, endY);

    }
    console.log("rand " + rand);
    

    //i = y, j = x
    for (let i = startY; i < endY; i ++) {
        for (let j = startX; j < endX; j ++) {
            if (isVertical) {
                if (j == rand) {
                    matrix[i][j] = 1;
                } 
            } else {
                if (i == rand) {
                    //map[i][j] = 1;
                    matrix[i][j] = 1;
                } 
            }
        }
    }
    

    let rand2;

    if (isVertical) {

        rand2  = randomNumber(startX, endX);

    } else rand2 = randomNumber(startY, endY);

    while (rand2 % 2 == 0) {

        if (isVertical) {

            rand2  = randomNumber(startX, endX);
        
        } else rand2 = randomNumber(startY, endY);

    }
    console.log("rand2 " + rand2);


    for (let i = startY; i < endY; i ++) {
        for (let j = startX; j < endX; j ++) {
            if (isVertical) {
                if (j == rand && i == rand2) {
                    matrix[i][j] = 0;
                }
            } else {
                if (i == rand && j == rand2) {
                    //this.map[i][j] = 0;
                    matrix[i][j] = 0;
                }
            }
        }
    }
    /*
    if (isVertical) {

        rand = Math.floor(Math.random() * endX);
        while (rand % 2 !== 0) {
            rand = Math.floor(Math.random() * endY);
        }

    } else {

        rand = Math.floor(Math.random() * endY);
        while (rand % 2 !== 0) {
            rand = Math.floor(Math.random() * endX);
        }
    }*/


    count ++;
    if (count == 50) {
        console.log("return");
        return;
    }
    

    //ezzel vmit lehet kezdeni: retrunol matrixokat, es azoknak a matrixoknak a koordinatait helyettesiti be a map ba
    if (isVertical) {
        if(rand !== startX)
        placeWall2(matrix, !isVertical, startY, endY, startX, rand-1 , count);
        if(rand !== endX - 1)
        placeWall2(matrix, !isVertical, startY, endY, rand + 1, endX, count);
    } else {
        if(rand !== startY)
        placeWall2(matrix, !isVertical, startY, rand-1, startX, endX, count);
        if(rand !== endY - 1)
        placeWall2(matrix, !isVertical, rand + 1, endY, startX, endX, count);
    } 
    

      
    /*
    console.log(count);
    if (isVertical) {
        if (rand !== 0)placeWall2(matrix1, !isVertical, startY, endY, startX, rand, count);
        if (rand !== endX)placeWall2(matrix1, !isVertical, startY, endY, rand + 1, endX, count);
    } else {
        if (rand !== 0)placeWall2(matrix1, !isVertical, startY, rand, startX, endX, count);
        if (rand !== endY)placeWall2(matrix1, !isVertical, startY, rand + 1, startX, endX, count);
    }*/

    //isVertical = !isVertical;
    
    //placeWall2(newMatrix, isVertical, 0, size, count);
    //placeWall2(newMatrix, !this.isVertical, (sizeM.y-(sizeM.y-rand)), 0, count);

    
    
    //placeWall2(newMatrix, isVertical, startY, endY, startX, endX, count);
   
    
}
//
//
//
function addInnerWalls(matrix, h, minX, maxX, minY, maxY) {
    console.log("\n"+matrix);
    console.log(h);
    console.log(minY);
    console.log(maxY);
    console.log(minX);
    console.log(maxX);
    if (h) {

        if (maxX - minX < 2) {
            return;
        }

        var y = Math.floor(randomNumber(minY, maxY-1)/2)*2;
        console.log(y);
    
        var hole = Math.floor(randomNumber(minX, maxX-1)/2)*2+1;
        while (hole >= maxX) {
            hole = Math.floor(randomNumber(minX, maxX-1)/2)*2+1;
        }

        console.log(hole);
        for (var i = minX; i < maxX; i++) {
            if (i == hole) matrix[y][i] = 0;
            else matrix[y][i] = 1;
        }

        if(y !== minX)
        addInnerWalls(matrix, !h, minX, maxX, minY, y);
        if(y + 1 !== maxY)
        addInnerWalls(matrix, !h, minX, maxX, y + 1, maxY);
    } else {
        if (maxY - minY < 2) {
            return;
        }

        var x = Math.floor(randomNumber(minX, maxX-1)/2)*2;
        console.log(x);
    
        var hole = Math.floor(randomNumber(minY, maxY-1)/2)*2+1;
        while (hole >= maxY) {
            hole = Math.floor(randomNumber(minY, maxY-1)/2)*2+1;
        }

        console.log(hole);
        for (var i = minY; i < maxY; i++) {
            if (i == hole) matrix[i][x] = 0;
            else matrix[i][x] = 1;
        }

        if(x !== minX)
        addInnerWalls(matrix, !h, minX, x, minY, maxY);
        if(x+1 !== maxX)
        addInnerWalls(matrix, !h, x + 1, maxX, minY, maxY);
    }
}

function addHWall(matrix, minX, maxX, y) {
    var hole = Math.floor(randomNumber(minX, maxX)/2)*2+1;

    for (var i = minX; i <= maxX; i++) {
        if (i == hole) matrix[y][i] = 0;
        else matrix[y][i] = 1;
    }
}

function addVWall(matrix, minY, maxY, x) {
    var hole = Math.floor(randomNumber(minY, maxY)/2)*2+1;

    for (var i = minY; i <= maxY; i++) {
        if (i == hole) matrix[i][x] = 0;
        else matrix[i][x] = 1;
    }
}
//
//
//
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function deleteElement (object, value1, value2) {

    for (let i = 0; i < object.y.length; i ++) {
        if (object.y[i] == value1) {
            if (object.x[i] == value2) {
                object.x.splice(i, 1);
                object.y.splice(i, 1);
            }
        }
    }
    
}

function contains (object, value1, value2) {
    
    for (let i = 0; i < object.y.length; i ++) {
        if (object.y[i] == value1) {
            if (object.x[i] == value2) {
                return true;
            }
        }
    }
    return false;
}

function init () {
    console.log(levels[i])
    console.log(size);

    isGameStarted = true;

    let myGame = new Game('game-container-1', levels[i]);
    
    switch (algorythm) {
        case "button1":
            myGame.drawMazePrim();
            console.log("1");
        break;

        case "button2":
            if (size == 5) {
                size = 3;
            } else 
            
            if(size == 7) {
                size = 4;
            }  else 
            if (size == 9 ){
                size = 5;
            } 
            myGame.drawMaze();
            console.log("2");
        break;

        case "button3":
            if (size == 5) {
                size = 3;
            } else 
            
            if(size == 7) {
                size = 4;
            }  else 
            if (size == 9 ){
                size = 5;
            } 
            myGame.drawMazeAldous();
            console.log("3");
        break;

        case "button4":
            myGame.drawMazeRecursive();
            console.log("4");
        break;
    }

    myGame.populateMap();

    myGame.sizeUp();

    myGame.placeSprite('goal');

    let playerSprite = myGame.placeSprite('player');

    myGame.player.el = playerSprite;
   
    myGame.keyboardListener();

    myGame.voiceListener();
    
    console.log("----------player: " + myGame.player.y + " " + myGame.player.x + "\n----------" + "goal: " + myGame.goal.y + " " + myGame.goal.x);

    //commandListener();
}

function nextLevel () {
    recognition.stop();

    isGameStarted = true;

    console.log("next level" + i);

    i ++;

    document.getElementById('button').style.visibility = 'hidden';
    let body = document.querySelector('body');
    body.className = '';
    console.log(size);
    levels[i] = {

        //1 - wall
        //0 - cell
        map: matrix(size, 1),
    
        player: {
            x:0,
            y:0
        },
    
        goal: {
            x:4,
            y:1
        },
        theme:'default'
    };

    document.getElementById('player').remove();

    document.getElementById('goal').remove();

    init();
    
}

function matrixNM(m, n) {
    
        return Array.from({
      // generate array of length m
      length: m
      // inside map function generate array of size n
      // and fill it with `0`
    }, () => new Array(n).fill(0));
    
    
}

function matrix(n, num) {
    var result = []
    for(var i = 0; i < n; i++) {
        result.push(new Array(n).fill(num))
    }
    console.log(result);
    return result
}

function algorythm1 (clicked_id) {

    //ha elindult már a játék, le kell tiltani
   /* if (!isGameStarted) {
        document.getElementById(clicked_id).disabled = true;
        document.getElementById(clicked_id).style.background = "rgb(44, 50, 127)";
        //isGameStarted = true;

        algorythm = clicked_id;
        console.log(clicked_id);
    }*/
    
    switch (clicked_id) {
        case "button1": 
            if (!document.getElementById("button2").disabled && !document.getElementById("button3").disabled && !document.getElementById("button4").disabled) {
                document.getElementById(clicked_id).disabled = true;
                document.getElementById(clicked_id).style.background = "rgb(44, 50, 127)";
                algorythm = clicked_id;
                console.log(clicked_id);
            }    
        break;
        case "button2": 
            if (!document.getElementById("button1").disabled && !document.getElementById("button3").disabled && !document.getElementById("button4").disabled) {
                document.getElementById(clicked_id).disabled = true;
                document.getElementById(clicked_id).style.background = "rgb(44, 50, 127)";
                algorythm = clicked_id;
                console.log(clicked_id);
            }    
        break;
        case "button3": 
            if (!document.getElementById("button1").disabled && !document.getElementById("button2").disabled && !document.getElementById("button4").disabled) {
                document.getElementById(clicked_id).disabled = true;
                document.getElementById(clicked_id).style.background = "rgb(44, 50, 127)";
                algorythm = clicked_id;
                console.log(clicked_id);
            }    
        break;
        case "button4": 
            if (!document.getElementById("button1").disabled && !document.getElementById("button2").disabled && !document.getElementById("button3").disabled) {
                document.getElementById(clicked_id).disabled = true;
                document.getElementById(clicked_id).style.background = "rgb(44, 50, 127)";
                algorythm = clicked_id;
                console.log(clicked_id);
            }    
        break;
    }
    
}

function setSize (clicked_id) {

    switch (clicked_id) {
        case "button5": 
            if (!document.getElementById("button6").disabled && !document.getElementById("button7").disabled) {
                size = 5;
                console.log(5);
                document.getElementById("button5").disabled = true;
                document.getElementById(clicked_id).style.background = "rgb(44, 50, 127)";
            }    
        break;

        case "button6":
            if (!document.getElementById("button5").disabled && !document.getElementById("button7").disabled) {
                size = 7;
                console.log(7);
                document.getElementById("button6").disabled = true;
                document.getElementById(clicked_id).style.background = "rgb(44, 50, 127)";
            }    
        break;

        case "button7":
            if (!document.getElementById("button5").disabled && !document.getElementById("button6").disabled) {
                size = 9;
                console.log(9);
                document.getElementById("button7").disabled = true;
                document.getElementById(clicked_id).style.background = "rgb(44, 50, 127)";
            }    
        break;
    }
}

function start () {
    document.getElementById("start").disabled = true;

    isGameStarted = true;
    algSelected = false;

    levels[i] = {

        //1 - wall
        //0 - cell
        map: matrix(size, 1),
    
        player: {
            x:2,
            y:3
        },
    
        goal: {
            x:4,
            y:1
        },
        theme:'default'
    };
    init();
    document.getElementById('button').style.visibility = 'hidden';
    document.getElementById('quit').style.visibility = 'visible';
}


            //
            //
            //
            //
            //
function quit () {
    //recognition.stop();
    console.log("quit started");
    if (isGameStarted) {
        recognition.stop();

        document.getElementById('button').style.visibility = 'hidden';
        let body = document.querySelector('body');
        body.className = '';

        const elements = document.getElementsByClassName('wall');
        while(elements.length > 0){
            elements[0].parentNode.removeChild(elements[0]);
        }
        const elements1 = document.getElementsByClassName('floor');
        while(elements1.length > 0){
            elements1[0].parentNode.removeChild(elements1[0]);
        }

        document.getElementById('player').remove();
        document.getElementById('goal').remove();

        document.getElementById("button1").disabled = false;
        document.getElementById("button2").disabled = false;
        document.getElementById("button3").disabled = false;
        document.getElementById("button4").disabled = false;
        document.getElementById("button5").disabled = false;
        document.getElementById("button6").disabled = false;
        document.getElementById("button7").disabled = false;

        document.getElementById("button1").style.background = "rgb(89, 99, 248)";
        document.getElementById("button2").style.background = "rgb(89, 99, 248)";
        document.getElementById("button3").style.background = "rgb(89, 99, 248)";
        document.getElementById("button4").style.background = "rgb(89, 99, 248)";
        document.getElementById("button5").style.background = "rgb(89, 99, 248)";
        document.getElementById("button6").style.background = "rgb(89, 99, 248)";
        document.getElementById("button7").style.background = "rgb(89, 99, 248)";

        document.getElementById("start").disabled = false;

        isGameStarted = false;

        i ++;

        levels[i] = {

            //1 - wall
            //0 - cell
            map: matrix(size, 1),
        
            player: {
                x:2,
                y:3
            },
        
            goal: {
                x:4,
                y:1
            },
            theme:'default'
        };
    } else console.log("quit failed");
    
}

commandListener();

function commandListener() {

    if (!recStarted)
    recognition.start();
    console.log("start");

    recStarted = true;
    
    recognition.onresult = function(event) {
        var dir = event.results[0][0].transcript;
        console.log(dir);

        

        if (dir == "one" || dir == "One." || dir == 1) {
            
            if (!isGameStarted && !algSelected) {
                document.getElementById("button1").disabled = true;
                document.getElementById("button1").style.background = "rgb(44, 50, 127)";
                isGameStarted = true;
                algSelected = true;
        
                algorythm = "button1";
                console.log("button1");
            }

        } else 
        
        if (dir == "two" || dir == "Two." || dir == 2) {

            if (!isGameStarted && !algSelected) {
                document.getElementById("button2").disabled = true;
                document.getElementById("button2").style.background = "rgb(44, 50, 127)";
                isGameStarted = true;
                algSelected = true;
        
                algorythm = "button2";
                console.log("button2");
            }

        }  else

        if (dir == "three" || dir == "Three." || dir == 3) {

            if (!isGameStarted && !algSelected) {
                document.getElementById("button3").disabled = true;
                document.getElementById("button3").style.background = "rgb(44, 50, 127)";
                isGameStarted = true;
                algSelected = true;
        
                algorythm = "button3";
                console.log("button3");
            }

        } else

        if (dir == "four" || dir == "Four." || dir == 4) {

            if (!isGameStarted && !algSelected) {
                document.getElementById("button4").disabled = true;
                document.getElementById("button4").style.background = "rgb(44, 50, 127)";
                isGameStarted = true;
                algSelected = true;
        
                algorythm = "button4";
                console.log("button4");
            }

        } else 
        
        if (dir == "five" || dir == "Five." || dir == 5) {

            if (!document.getElementById("button6").disabled && !document.getElementById("button7").disabled) {
                size = 5;
                console.log(5);
                document.getElementById("button5").disabled = true;
                document.getElementById("button5").style.background = "rgb(44, 50, 127)";
            } 

        } else 

        if (dir == "seven" || dir == "Seven." || dir == 7) {

            if (!document.getElementById("button5").disabled && !document.getElementById("button7").disabled) {
                size = 7;
                console.log(7);
                document.getElementById("button6").disabled = true;
                document.getElementById("button6").style.background = "rgb(44, 50, 127)";
            }  

        } else 

        if (dir == "nine" || dir == "Nine." || dir == 9) {

            if (!document.getElementById("button6").disabled && !document.getElementById("button5").disabled) {
                size = 9;
                console.log(9);
                document.getElementById("button7").disabled = true;
                document.getElementById("button7").style.background = "rgb(44, 50, 127)";
            }   

        } else 

        if (dir == "start" || dir == "Start.") {
            start();
        }
    }
    


    recognition.onend = function() {
        //console.log('speech ended');
        recognition.stop();
        recognition.start();
    }
        
    
}