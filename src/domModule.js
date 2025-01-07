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

        renderBoard(humanBoard, "human-board");
        renderBoard(computerBoard, "computer-board", true); 

        const computerShipPositions = [ // temp.
            { ship: new Ship(5), coordinate: "A1", orientation: "horizontal" },
            { ship: new Ship(4), coordinate: "B2", orientation: "vertical" },
            { ship: new Ship(3), coordinate: "C3", orientation: "horizontal" },
            { ship: new Ship(3), coordinate: "D4", orientation: "vertical" },
            { ship: new Ship(2), coordinate: "E5", orientation: "horizontal" },
        ];

        computer.positionShips(computerShipPositions); // temp.


        const ships = [ // temp ship container for player.
            { length: 5, orientation: "horizontal" },
            { length: 4, orientation: "horizontal" },
            { length: 3, orientation: "horizontal" },
            { length: 3, orientation: "horizontal" },
            { length: 2, orientation: "horizontal" },
        ];

        renderShipContainer(ships);

        // to create: getUserShipPlacement and generateRandomShipLayout.
        // const humanShipPositions = getUserShipPlacement() || generateRandomShipLayout();
        // const computerShipPositions = generateRandomShipLayout(); 
        
    }

    function checkAllShipsPlaced() {
        const totalShips = 5;
        return humanBoard.ships.length === totalShips;
    }

    function handlePlayerAttack(event) {
        const cell = event.target;
        const coordinate = cell.dataset.coordinate; // eg) "A1" 

        const rowIndex = coordinate.charCodeAt(0) - 65; // add this block here so receiveAttack doesn't deal with it.
        const colIndex = parseInt(coordinate.slice(1), 10) - 1;
        const targetCell = computerBoard.grid[rowIndex][colIndex];
    
        if (targetCell.clicked) {
            return; // Ignore the click if the cell has already been attacked
        }

        const result = human.makeMove(coordinate, computerBoard); // player attacks computer board.

        renderBoard(computerBoard, "computer-board", true); // render board with updated attack.

        //check for win condition
        if (computerBoard.areAllShipsSunk()) {
            setTimeout(() => {
                endGame("Player 1");
            }, 100); // slight delay
            return;
        }

        //switch to computer's turn
        console.log("switching to computer turn");
        handleComputerTurn();
    }

    function handleComputerTurn() {
        const computerMove = computer.generateMove(humanBoard); // generates coord.

        const result = computer.makeMove(computerMove, humanBoard); // fires board state.


        renderBoard(humanBoard, "human-board");

        if (humanBoard.areAllShipsSunk()) {
            setTimeout(() => {
                endGame("Computer");
            }, 100); // slight delay
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
                    cellElement.style.pointerEvents = "none"; // disable further clicks.
                } else if (cell.occupied && !hideShips) {
                    cellElement.classList.add("ship");
                }

                boardElement.appendChild(cellElement);
            });
        });

        if (!checkAllShipsPlaced()) {
            addDragDropListeners();
        }
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
        const boardElement = document.querySelector("#computer-board");
        boardElement.classList.add("disabled");
    }

    function renderShipContainer(ships) { // called in game start with array with appropriate ships.
        const container = document.getElementById("ship-container");
        container.innerHTML = ""; 

        ships.forEach((ship, index) => { // array index.
            const shipElement = document.createElement("div");
            shipElement.classList.add("ship");
            shipElement.setAttribute("draggable", true);
            shipElement.dataset.length = ship.length;
            shipElement.dataset.orientation = ship.orientation;
            shipElement.dataset.index = index;
            container.appendChild(shipElement);
        });

        addDragDropListeners();
    }

    function addDragDropListeners() {
        let draggedShip = null;

        const shipElements = document.querySelectorAll(".ship");
        const boardCells = document.querySelectorAll("#human-board .cell");

        shipElements.forEach(ship => {
            ship.addEventListener("dragstart", handleDragStart);
        });

        boardCells.forEach(cell => {
            cell.addEventListener("dragover", handleDragOver);
            cell.addEventListener("drop", handleDrop);
        });

        function handleDragStart(event) {
            console.log("dragging started", event.target.dataset);
            const { length, orientation, index } = event.target.dataset;
    
            const rect = event.target.getBoundingClientRect(); // get position and size of element relative to viewport.
            const cursorOffsetX = event.clientX - rect.left; // get offset from cursor (clientX) from left edge of element.
            const cursorOffsetY = event.clientY - rect.top; // get offset from cursor to top edge of element.
    
            draggedShip = {
                length: parseInt(length), // data attributes always stored as a string in DOM so have to convert back.
                orientation,
                index,
                element: event.target,
                cursorOffsetX,
                cursorOffsetY,
            };
            console.log("current dragged ship:",draggedShip);
        }
    
        function handleDragOver(event) {
            event.preventDefault(); // allows dropping.
            if (!draggedShip) return;

            console.log("currently DRAGGING,", draggedShip);
            
        }
    
        function handleDrop(event) {
            if (!draggedShip) return; // if there is no obj 
    
            const { length, orientation } = draggedShip; // destructure.
    
            //get bounding box of target cell.
            const targetCellRect = event.target.getBoundingClientRect(); // gets dimensions and position of the cell the ship is being dropped on relative to the viewport.
    
            let adjustedRowIndex = event.target.dataset.coordinate.charCodeAt(0) - 65; // get letter for row.
            let adjustedColIndex = parseInt(event.target.dataset.coordinate.slice(1), 10) - 1; // get num for col.
    
            const cellWidth = targetCellRect.width; // width of element of target cell for alignment calcs.
            const cellHeight = targetCellRect.height; // same for height.
    
            if (orientation === "horizontal") { // adjust for drag offset. 
                const startColOffset = Math.floor(draggedShip.cursorOffsetX / cellWidth); // calc how many grid cells the offset corresponds to.
                adjustedColIndex -= startColOffset; // shifts start column index backward by above to align correctly.
            } else if (orientation === "vertical") {
                const startRowOffset = Math.floor(draggedShip.cursorOffsetY / cellHeight);
                adjustedRowIndex -= startRowOffset;
            }
    
            const adjustedCoordinate = `${String.fromCharCode(65 + adjustedRowIndex)}${adjustedColIndex + 1}`;
            
    
    
            try {
                humanBoard.placeShip( // use placeShip for validation.
                    new Ship(draggedShip.length),
                    adjustedCoordinate,
                    draggedShip.orientation
                );
                
                console.log("dropping ship", draggedShip);
                renderBoard(humanBoard, "human-board");
                draggedShip.element.remove();
                draggedShip = null; 
                console.log(draggedShip);

                if (checkAllShipsPlaced()) {
                    console.log("all ships placed. starting GAME");
                    addAttackListeners();
                }

            } catch (error) {
                console.log("didn't work - can't drop.");
                alert(error.message); 
            }
        }
    }
    
    return {
        startGame
    };

})();

export default domModule;