// factory function for creating players

const createPlayer = ({whichPlayer, playerName, sign}) => ({
    whichPlayer,
    playerName,
    sign,
})
 
 const gameboard = (function() {

    let aiOn = false;

    function setAiOn(status) {
        aiOn = status;
    }

    // 2d array acting as a base for the html table
    const gameboardArray = [
         [1, 2, 3],
         [4, 5, 6],
         [7, 8, 9],
    ];

    // function which draws the board
    function drawBoard() {
        const gameContainer = document.getElementById("game-container");
        if (gameContainer.firstChild) {
            gameContainer.removeChild(gameContainer.lastChild);
        }
        const gameTable = document.createElement("table");
        gameContainer.appendChild(gameTable);

        for (let i = 0; i < gameboardArray.length; i++) {
            const tr = document.createElement("tr");
            gameTable.appendChild(tr);

            for (let n = 0; n < gameboardArray[i].length; n++) {
                const td = document.createElement("td");
                td.id = `${gameboardArray[i][n]}`;
                td.dataset.player = "0";
                td.addEventListener("click", _draw);
                tr.appendChild(td);
            }
        }
    }

    // function which draws in cells
    function _draw() {
        if (this.lastChild) return;
        this.dataset.player = gameState.getActivePlayer().whichPlayer;
        const temporarySign = document.createElement("img");
        temporarySign.src = gameState.getActivePlayer().sign.src;
        this.appendChild(temporarySign);
        this.style.borderStyle = "inset";
        if (gameState.checkWinner()) return;
        gameState.nextTurn();
        if (aiOn) gameState.computerMove();
    }

    // call function to draw the board
    // drawBoard(gameboardArray);

    return {
        gameboardArray,
        drawBoard,
        setAiOn,
        aiOn
    };
 })();

 // create two players using the factory function

const x = document.createElement("img");
x.src = "img/X.png";
const o = document.createElement("img");
o.src = "img/O.png";

const playerOne = createPlayer({
    whichPlayer: "1",
    playerName: "",
    sign: x
});
const playerTwo = createPlayer({
    whichPlayer: "2",
    playerName: "",
    sign: o
});

// create module for the gameState which controls the game
const gameState = (function() {
    const resetBtn = document.querySelector("#reset");
    resetBtn.addEventListener("click", _reset);

    let activePlayer;

    function setActivePlayer(player) {
        const activePlayerDOM = document.querySelector("#active-player>h1");
        activePlayer = player;
        activePlayerDOM.textContent = activePlayer.playerName;
        activePlayerDOM.appendChild(getActivePlayer().sign);
    }

    function nextTurn() {
        const activePlayerDOM = document.querySelector("#active-player>h1");

        if (activePlayer === playerOne) {
            activePlayer = playerTwo;
        } else {
            activePlayer = playerOne;
        }
        activePlayerDOM.textContent = activePlayer.playerName;
        activePlayerDOM.appendChild(getActivePlayer().sign);
    }

    function getActivePlayer() {
        return activePlayer;
    }

    function _reset() {
        displayController.popupNames();
    }

    const winningPositions = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],
        [1, 5, 9],
        [3, 5, 7]
    ]

    function checkWinner() {
        for (let i = 0; i < winningPositions.length; i++) {
            if (winningPositionsCheck(winningPositions, i, "1")) {
                displayController.popupWinner(true);
                return true;
            } else if (winningPositionsCheck(winningPositions, i, "2")) {
                displayController.popupWinner(true);
                return true;
            }
        }
        if (checkDraw()) {
            displayController.popupWinner(false);
            return true;
        }
    }

    function checkDraw() {
        for (let i = 0; i < gameboard.gameboardArray.length; i++) {
            for (let n = 0; n < gameboard.gameboardArray[i].length; n++) {
                let cell = document.getElementById(`${gameboard.gameboardArray[i][n]}`);
                if (cell.dataset.player === "0") {
                    return false;
                }
            }
        }
        return true;
    }

    function winningPositionsCheck(array, i, player) {
        return (document.getElementById(`${array[i][0]}`).dataset.player === player &&
        document.getElementById(`${array[i][1]}`).dataset.player === player &&
        document.getElementById(`${array[i][2]}`).dataset.player === player);
    }

    function computerMove() {
        let targetCell;
        do {
            const randomCellId = Math.floor(Math.random() * 9 + 1);
            targetCell = document.getElementById(`${randomCellId}`);
        } while (targetCell.lastChild);
        targetCell.dataset.player = activePlayer.whichPlayer;
        const temporarySign = document.createElement("img");
        temporarySign.src = gameState.getActivePlayer().sign.src;
        targetCell.appendChild(temporarySign);
        targetCell.style.borderStyle = "inset";
        if (gameState.checkWinner()) return;
        nextTurn();
    }

    // incomplete function for evaluating moves made by the computer

    // function evaluateMove() {
    //     let validMoves = [];
    //     let targetCell;

    //     for (let i = 0; i < gameboard.gameboardArray.length; i++) {
    //         for (let n = 0; n < gameboard.gameboardArray[i].length; n++) {
    //             let cell = document.getElementById(`${gameboard.gameboardArray[i][n]}`);
    //             if (cell.dataset.player < 1) validMoves.push(cell);
    //         }
    //     }

    //     console.log(validMoves);

    //     for (cell of validMoves) {
    //         simulateMove(cell);
    //     }

    //     const randomCellId = Math.floor(Math.random() * validMoves.length);
    //     console.log(randomCellId);
    //     targetCell = validMoves[randomCellId];

    //     return targetCell;
    // }

    return {
        computerMove,
        checkWinner,
        nextTurn,
        getActivePlayer,
        setActivePlayer,
    }
 })();

 const displayController = (function() {
     function popupNames() {
        const body = document.querySelector("body");
        const popupContainer = document.createElement("div");
        popupContainer.id = "popup-container";
        const mask = document.createElement("div")
        mask.id = "mask";
        const popup = document.createElement("div")
        popup.classList.add("popup");
        const inputPlayerOne = document.createElement("input");
        const inputPlayerTwo = document.createElement("input");
        inputPlayerOne.type = "text";
        inputPlayerOne.style.color = "black";
        inputPlayerOne.placeholder = "* Name for Player One *";
        inputPlayerTwo.type = "text";
        inputPlayerTwo.style.color = "black";
        inputPlayerTwo.placeholder = "* Name for Player Two *";
        const computerToggleContainer = document.createElement("div");
        computerToggleContainer.id = "computer-toggle-container";
        const computerToggleText = document.createElement("h1");
        computerToggleText.textContent = "AI acting as Player Two";
        computerToggleText.id = "computer-toggle-text";
        const computerToggle = document.createElement("input");
        computerToggle.type = "checkbox";
        computerToggle.id = "computer-toggle";
        computerToggleContainer.appendChild(computerToggleText);
        computerToggleContainer.appendChild(computerToggle);
        const startBtn = document.createElement("button");
        startBtn.id = "start";
        startBtn.textContent = "START";
        startBtn.addEventListener("click", function() {startGame(inputPlayerOne, inputPlayerTwo, popupContainer)});
        popup.appendChild(inputPlayerOne);
        popup.appendChild(inputPlayerTwo);
        popup.appendChild(computerToggleContainer);
        popup.appendChild(startBtn);
        mask.appendChild(popup);
        popupContainer.appendChild(mask);
        body.appendChild(popupContainer);
    }

    function popupWinner(result) {
        const body = document.querySelector("body");
        const popupContainer = document.createElement("div");
        popupContainer.id = "popup-container";
        const mask = document.createElement("div")
        mask.id = "mask";
        const popup = document.createElement("div")
        popup.classList.add("popup");
        const popupText = document.createElement("h1");
        popupText.style.fontSize = "24px";
        if (result) {
            popupText.textContent = `${gameState.getActivePlayer().playerName} is the winner!`;
        } else {
            popupText.textContent = "The game ends in a draw! no one wins!";
        }
        popup.appendChild(popupText);
        const startBtn = document.createElement("button");
        startBtn.id = "start";
        startBtn.textContent = "RESET";
        startBtn.addEventListener("click", function() {
            gameboard.setAiOn(false);
            popupNames();
            if (popupContainer.firstChild) {
                popupContainer.removeChild(popupContainer.lastChild);
            };
        });
        popup.appendChild(startBtn);
        mask.appendChild(popup);
        popupContainer.appendChild(mask);
        body.appendChild(popupContainer);
    }

    function startGame(inputPlayerOne, inputPlayerTwo, popupContainer) {
        playerOne.playerName = inputPlayerOne.value;
        playerTwo.playerName = inputPlayerTwo.value;
        const computerToggle = document.getElementById("computer-toggle");
        if (computerToggle.checked) gameboard.setAiOn(true);
        if (popupContainer.firstChild) {
            popupContainer.removeChild(popupContainer.lastChild);
        }
        gameState.setActivePlayer(playerOne);
        gameboard.drawBoard();
    }

    return {
        popupNames,
        popupWinner
    }
 })();

 // actual start

 displayController.popupNames();