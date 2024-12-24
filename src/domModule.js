import Gameboard from "./gameBoard.js";
import Player from "./player.js";
import Ship from "./ship.js"

const domModule = (() => {
    let human, computer;
    let humanBoard, computerBoard;

    function startGame() { // public method
        humanBoard = new Gameboard()
        human = new Player(humanBoard);

        computerBoard = new Gameboard();
        computer = new Player(computerBoard);

        // add userinput ship placement and randomly generated ships later.

        const testShipPositions = [ // temp.
            { ship: new Ship(5), coordinate: "A1", orientation: "horizontal" },
            { ship: new Ship(4), coordinate: "B2", orientation: "vertical" },
            { ship: new Ship(3), coordinate: "C3", orientation: "horizontal" },
            { ship: new Ship(3), coordinate: "D4", orientation: "vertical" },
            { ship: new Ship(2), coordinate: "E5", orientation: "horizontal" },
        ];

        // to create: getUserShipPlacement and generateRandomShipLayout.
        // const humanShipPositions = getUserShipPlacement() || generateRandomShipLayout();
        // const computerShipPositions = generateRandomShipLayout(); 

        human.positionShips(testShipPositions);
        computer.positionShips(testShipPositions);

        renderBoard(humanBoard, "human-board");
        renderBoard(computerBoard, "computer-board", true);

        addAttackListeners();
    }

    function handlePlayerAttack(event) {
        const cell = event.target;

        if (cell.classList.contains("clicked")) {
            return;
        }
        const coordinate = event.target.dataset.coordinate; // eg) "A1" 

        const result = human.makeMove(coordinate, computerBoard); // player attacks computer board.

        renderBoard(computerBoard, "computer-board", true); // render board with updated attack.

        //check for win condition
        if (computerBoard.areAllShipsSunk()) {
            endGame("Player 1");
            return;
        }

        //switch to computer's turn
        handleComputerTurn();
    }

    function handleComputerTurn() {
        const computerMove = computer.generateMove(humanBoard); // generates coord.
        const result = computer.makeMove(computerMove, humanBoard); // fires board state.

        renderBoard(humanBoard, "human-board");

        if (humanBoard.areAllShipsSunk()) {
            endGame("Computer");
            return;
        }
    }

    function endGame(winner) {
        alert(`${winner} wins!`);
        disableBoardClicks();

        //to add restart game here / reset game.
    }


    // DOM METHODS:

    function renderBoard(board, elementId, hideShips = false) {
        const boardElement = document.getElementById(elementId);
        boardElement.innerHTML = ""; // clear previous content.

        board.grid.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellElement = document.createElement("div");
                cellElement.classList.add("cell");
                cellElement.dataset.coordinate = `${String.fromCharCode(65 + rowIndex)}${colIndex + 1}`;

                // style the cell based on its state
                if (cell.clicked) {
                    cellElement.classList.add(cell.occupied ? "hit" : "miss"); // for styling ?
                } else if (cell.occupied &&  !hideShips) {
                    cellElement.classList.add("ship");
                }

                boardElement.appendChild(cellElement);
            });
        });
    }

    function addAttackListeners() { 
        const boardElement = document.getElementById("computer-board");

        boardElement.addEventListener("click", event => {
            if (event.target.classList.contains('cell')) {
                handlePlayerAttack(event);
            }
        })
    }

    function disableBoardClicks() {
        const cells = document.querySelectorAll("#computer-board .cell");
        cells.forEach(cell => {
            cell.removeEventListener("click", handlePlayerAttack);
        })
    }

    return {
        startGame
    };

})();

export default domModule;