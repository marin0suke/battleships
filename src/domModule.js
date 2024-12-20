import Gameboard from "./gameBoard.js";
import Player from "./player.js";
import Ship from "./ship.js"

const domModule = (() => {
    function startGame() { // public method
        const humanBoard = new Gameboard()
        const human = new Player(humanBoard);

        const computerBoard = new Gameboard();
        const computer = new Player(computerBoard);

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


    return {
        startGame
    };

})();

export default domModule;