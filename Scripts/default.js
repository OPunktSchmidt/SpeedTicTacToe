/// <reference path="jquery-3.1.1.intellisense.js" />
/// <reference path="jquery-3.1.1.js" />

var currentPlayer = null;
var openPlayFields = [1, 2, 3, 4, 5, 6, 7, 8, 9];
var selectedPlayfieldsPlayer1 = new Array();
var selectedPlayfieldsPlayer2 =  new Array();
var remainingMilli;
var timer;

function init() {
   
    var playfieldTableCells = document.querySelectorAll("#playfieldTable td");

    for(var i = 0; i < playfieldTableCells.length; i++)
    {
        playfieldTableCells[i].addEventListener("click", tableCellClick, false)
    }

    document.getElementById("gameControlButton").addEventListener("click", changeGameState, false)
}

function tableCellClick (e){

    if (e.currentTarget.getAttribute("data-gamestate") == 2 && currentPlayer == 1) {
        e.currentTarget.setAttribute("data-playerid", 1);

        var playFieldId = parseInt(e.currentTarget.getAttribute("data-playfieldCell"));

        var index = openPlayFields.indexOf(playFieldId);
        openPlayFields.splice(index, 1);

        selectedPlayfieldsPlayer1.push(playFieldId);

        changePlayer();
    }

    e.stopPropagation();
}

function changeGameState() {

    var gamestate = document.getElementById("gameControlButton").getAttribute("data-gamestate");

    if (gamestate == 1)
        startGame();
    else {

        var playfieldTableCells = document.querySelectorAll("#playfieldTable td");

        for (var i = 0; i < playfieldTableCells.length; i++) {
            playfieldTableCells[i].setAttribute("data-playerid", "");
        }

        document.getElementById("gameStateDiv").innerHTML = "";

        resetGame();
    }
}


function resetGame() {

    var playfieldTableCells = document.querySelectorAll("#playfieldTable td");

    for (var i = 0; i < playfieldTableCells.length; i++) {
        playfieldTableCells[i].setAttribute("data-gamestate", "1");
    }

    var gameControlButton = document.getElementById("gameControlButton")
    gameControlButton.setAttribute("data-gamestate", 1);
    gameControlButton.innerHTML = "START";

    currentPlayer = null;

    if (timer != null)
        window.clearInterval(timer);

    openPlayFields = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    selectedPlayfieldsPlayer1 = new Array();
    selectedPlayfieldsPlayer2 = new Array();
}

function startGame()
{
    var playfieldTableCells = document.querySelectorAll("#playfieldTable td");

    for (var i = 0; i < playfieldTableCells.length; i++) {
        playfieldTableCells[i].setAttribute("data-playerid", "");
        playfieldTableCells[i].setAttribute("data-gamestate", "2");
    }

    var gameControlButton = document.getElementById("gameControlButton")
    gameControlButton.setAttribute("data-gamestate", 2);
    gameControlButton.innerHTML = "END";

    changePlayer();
}

function changePlayer() {

    if (timer != null)
        window.clearInterval(timer);

    var gameStateDiv = document.getElementById("gameStateDiv");

    if (checkWin()) {
        if (currentPlayer == null || currentPlayer == 2) {
            currentPlayer = 1;
            gameStateDiv.innerHTML = "Your turn: 10:00 seconds"
            gameStateDiv.className = "gameStateGreenDiv";

            remainingMilli = 1000;
            timer = window.setInterval(updateTimer, 50);

        }
        else if (currentPlayer == 1) {
            currentPlayer = 2;
            gameStateDiv.innerHTML = "KI is playing";
            gameStateDiv.className = "gameStateRedDiv";

            window.setTimeout(changePlayer, 1000);

            var index = -1;
            var randomValue;

            while (index == -1)
            {
                randomValue = getRandomInt(1, 9)
                index = openPlayFields.indexOf(randomValue);
            }

            document.querySelector("#playfieldTable td[data-playfieldCell='" + randomValue.toString() + "']").setAttribute("data-playerid", 2);
            openPlayFields.splice(index, 1);
            selectedPlayfieldsPlayer2.push(randomValue);
            
        }

        var playfieldTableCells = document.querySelectorAll("#playfieldTable td");

        for (var i = 0; i < playfieldTableCells.length; i++) {
            playfieldTableCells[i].setAttribute("data-currentplayerid", currentPlayer);
        }
    }
}

function updateTimer() {

    remainingMilli -= 50;
    var ms = remainingMilli % 1000;
    var sec = (remainingMilli - ms) / 1000;

    document.getElementById("gameStateDiv").innerHTML = "Your turn: " + sec + ":" + ms;

    if (remainingMilli == 0)
        checkWin();
}

function checkWin() {

    var gameStateDiv = document.getElementById("gameStateDiv");

    if(currentPlayer == 1 && remainingMilli == 0)
    {
        gameStateDiv.className = "gameStateRedDiv";
        gameStateDiv.innerHTML = "GAME OVER! (Timeout)";

        resetGame();

        return false;
    }
    else if(checkPlayerWin() == 2)
    {
        gameStateDiv.className = "gameStateRedDiv";
        gameStateDiv.innerHTML = "GAME OVER!";

        resetGame();

        return false;
    }
    else if (checkPlayerWin() == 1) {

        gameStateDiv.className = "gameStateGreenDiv";
        gameStateDiv.innerHTML = "YOU WIN!";

        resetGame();

        return false;
    }
    else if (openPlayFields.length == 0) {

        gameStateDiv.className = "gameStateRedDiv";
        gameStateDiv.innerHTML = "UNDECIDED!";

        resetGame();

        return false;
    }

    return true;
}

function checkPlayerWin() {

    if ((selectedPlayfieldsPlayer2.includes(1) && selectedPlayfieldsPlayer2.includes(4) && selectedPlayfieldsPlayer2.includes(7))
        || (selectedPlayfieldsPlayer2.includes(2) && selectedPlayfieldsPlayer2.includes(5) && selectedPlayfieldsPlayer2.includes(8))
        || (selectedPlayfieldsPlayer2.includes(3) && selectedPlayfieldsPlayer2.includes(6) && selectedPlayfieldsPlayer2.includes(9))
        || (selectedPlayfieldsPlayer2.includes(1) && selectedPlayfieldsPlayer2.includes(2) && selectedPlayfieldsPlayer2.includes(3))
        || (selectedPlayfieldsPlayer2.includes(4) && selectedPlayfieldsPlayer2.includes(5) && selectedPlayfieldsPlayer2.includes(6))
        || (selectedPlayfieldsPlayer2.includes(7) && selectedPlayfieldsPlayer2.includes(8) && selectedPlayfieldsPlayer2.includes(9))
        || (selectedPlayfieldsPlayer2.includes(7) && selectedPlayfieldsPlayer2.includes(5) && selectedPlayfieldsPlayer2.includes(3))
        || (selectedPlayfieldsPlayer2.includes(9) && selectedPlayfieldsPlayer2.includes(5) && selectedPlayfieldsPlayer2.includes(1)))
        return 2;
    else if ((selectedPlayfieldsPlayer1.includes(1) && selectedPlayfieldsPlayer1.includes(4) && selectedPlayfieldsPlayer1.includes(7))
        || (selectedPlayfieldsPlayer1.includes(2) && selectedPlayfieldsPlayer1.includes(5) && selectedPlayfieldsPlayer1.includes(8))
        || (selectedPlayfieldsPlayer1.includes(3) && selectedPlayfieldsPlayer1.includes(6) && selectedPlayfieldsPlayer1.includes(9))
        || (selectedPlayfieldsPlayer1.includes(1) && selectedPlayfieldsPlayer1.includes(2) && selectedPlayfieldsPlayer1.includes(3))
        || (selectedPlayfieldsPlayer1.includes(4) && selectedPlayfieldsPlayer1.includes(5) && selectedPlayfieldsPlayer1.includes(6))
        || (selectedPlayfieldsPlayer1.includes(7) && selectedPlayfieldsPlayer1.includes(8) && selectedPlayfieldsPlayer1.includes(9))
        || (selectedPlayfieldsPlayer1.includes(7) && selectedPlayfieldsPlayer1.includes(5) && selectedPlayfieldsPlayer1.includes(3))
        || (selectedPlayfieldsPlayer1.includes(9) && selectedPlayfieldsPlayer1.includes(5) && selectedPlayfieldsPlayer1.includes(1)))
        return 1;

    return -1;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

