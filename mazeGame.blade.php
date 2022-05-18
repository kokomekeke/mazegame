<!doctype html>
<html lang="en">
<head>
    <title>Maze Game</title>
    <meta charset="utf-8">
    <meta name="description" content="Maze Game">
    <meta name="author" content="Csori Kornel">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- custom css -->
    <link rel="stylesheet" type="text/css" href="{{asset('css/style.css')}}">
    
</head>
<body>
    <!-- container-->
    <div class="header">Maze Game</div>
    <div id="game-container-1" class="game-container" >
    <!--<div class="map-and-controls">
                    <div id="map-and-controls"> -->
        <div id="game-map-1" class="game-map">
            
            <div id="tiles" class="layer"></div>
            <div id="sprites" class="layer"></div>
            <div id="success-msg">Goal reached!</div>
            Maze Game
        </div> 
        <div class="button-container">
            <button id="quit" type="button" onclick="quit()">Quit game(quit)</button>
            <button id="button" type="button" onclick="nextLevel()">Next Level(next)</button>
        </div>           
    </div>
    <div class="options">
        <p>Options</p>
        <div class="algorythm">
            <p class="alg-text">Algorythm</p>
            <input type="button" id="button1" name="fav_language" value="PRIM (1)" onclick="algorythm1(this.id)">          
            <input type="button" id="button2" name="fav_language" value="ITERATIVE DEPTH FIRST (2)" onclick="algorythm1(this.id)">
            <input type="button" id="button3" name="fav_language" value="ALDOUS-BRODER (3)" onclick="algorythm1(this.id)">
            <input type="button" id="button4" name="fav_language" value="RECURSIVE DIVISION (4)" onclick="algorythm1(this.id)">
        </div>
        <div class="size">
            <p class="size-text">Size</p>
            <input type="button" id="button5" name="fav_language" value="(5)" onclick="setSize(this.id)">          
            <input type="button" id="button6" name="fav_language" value="(7)" onclick="setSize(this.id)">
            <input type="button" id="button7" name="fav_language" value="(9)" onclick="setSize(this.id)">
        </div>
        <div class="start">
            <button id="start" type="button" onclick="start()">(Start)</button>
        </div>
    </div> 
    <div class="footer">
        <br>Use voice commands or buttons to move<br>Available voice commands are between '(' and ')' characters
            <p id="text-1" class="text"></p>
            <p id="text-2" class="text"></p>
        
    </div>
        
    </div>
    <script type="text/javascript" src="{{asset('js/script.js')}}"></script>
    <!-- -->
   
</body>

</html>