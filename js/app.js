// factory function for creating players

const createPlayer = ({playerName, sign}) => ({
    playerName,
    sign
})

// create two players using the factory function

const playerOne = createPlayer({
    playerName: "John",
    sign: "X"
});
const playerTwo = createPlayer({
    playerName: "Sam",
    sign: "O"
});

// create module for the gameState which controls the game
const gameState = (function() {
    const activePlayerDOM = document.querySelector("#active-player>h1");
    let activePlayer = playerOne;
    activePlayerDOM.textContent = activePlayer.playerName + " - " + activePlayer.sign;

    function nextTurn() {
        console.log("next turn");
        if (activePlayer === playerOne) {
            activePlayer = playerTwo;
        } else {
            activePlayer = playerOne;
        }
        activePlayerDOM.textContent = activePlayer.playerName + " - " + activePlayer.sign;
    }

    function getActivePlayer() {
        return activePlayer;
    }

    return {
        nextTurn,
        getActivePlayer,
    }
 })();
 
 const gameboard = (function() {

    // 2d array acting as a base for the html table
    const _gameboardArray = [
         [1, 2, 3],
         [4, 5, 6],
         [7, 8, 9],
    ];

    // create the object which will store the DOM reference to each cell
    let cells = {}

    // function which draws the board
    function _drawBoard(array) {
        const gameContainer = document.getElementById("game-container");
        const gameTable = document.createElement("table");
        gameContainer.appendChild(gameTable);

        for (let i = 0; i < array.length; i++) {
            const tr = document.createElement("tr");
            gameTable.appendChild(tr);

            for (let n = 0; n < array[i].length; n++) {
                const td = document.createElement("td");
                td.id = `${array[i][n]}`;
                td.textContent = array[i][n];
                td.addEventListener("click", _draw);
                cells[array[i][n]] = td;
                tr.appendChild(td);
            }
        }
    }

    // function which draws in cells
    function _draw() {
        if (gameState.getActivePlayer() === playerOne) {
            this.textContent = "X";
        } else {
            this.textContent = "O";
        }
        gameState.nextTurn();
    }

    // call function to draw the board
    _drawBoard(_gameboardArray);

    return {
        cells
    };
 })();