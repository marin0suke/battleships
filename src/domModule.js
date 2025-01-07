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
        renderBoard(computerBoard, "computer-board"); 

        const computerShips = [
            { length: 5 },
            { length: 4 },
            { length: 3 },
            { length: 3 },
            { length: 2 },
        ];
        generateRandomShipLayout(computerBoard, computerShips);


        const playerShips = [ // temp ship container for player.
            { length: 5, orientation: "horizontal" },
            { length: 4, orientation: "horizontal" },
            { length: 3, orientation: "horizontal" },
            { length: 3, orientation: "horizontal" },
            { length: 2, orientation: "horizontal" },
        ];
        renderShipContainer(playerShips);

        const confirmButton = document.querySelector("#confirm-placement");
        confirmButton.disabled = true; 

        addResetButton();
        addConfirmPlacementButton();
        addFlipButtonListener();

        // to create: getUserShipPlacement and generateRandomShipLayout.
        // const humanShipPositions = getUserShipPlacement() || generateRandomShipLayout();
        // const computerShipPositions = generateRandomShipLayout(); 
        
    }

    function checkAllShipsPlaced() { // 
        const totalShips = 5;
        return humanBoard.ships.length === totalShips;
    }

    function generateRandomShipLayout(board, ships) {
        const directions = ["horizontal", "vertical"]; // will randomly choose
        const boardSize = board.grid.length; // on the board we are using.

        ships.forEach((ship) => { // ship array passed - for each ship
            let placed = false; 

            while (!placed) { // keep trying to place the ship until successfully placed. 
                const orientation = directions[Math.floor(Math.random() * directions.length)]; // randomly select orientation. outputs 1 or 2.

                const rowIndex = Math.floor(Math.random() * boardSize); // generates 0 - 9 randomly.
                const colIndex = Math.floor(Math.random() * boardSize);

                const coordinate = `${String.fromCharCode(65 + rowIndex)}${colIndex + 1}`; // takes random ints and turns row into ASCII letter, and + 1 for col since indexed.

                try {
                    board.placeShip(new Ship(ship.length), coordinate, orientation); // validation in placeShip.
                    placed = true; // change flag when successful.
                } catch (error) {
                   // silent error catch and retry placement.
                }
            }
        });
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

        if (!checkAllShipsPlaced()) { // to update - if startgame hasn't been clicked? reattach.
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
            shipElement.dataset.orientation = "horizontal"; // default
            shipElement.style.setProperty("--ship-length", ship.length);
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

            const { length, orientation } = event.target.dataset;
    
            const rect = event.target.getBoundingClientRect(); // get position and size of element relative to viewport.
            const cursorOffsetX = event.clientX - rect.left; // get offset from cursor (clientX) from left edge of element.
            const cursorOffsetY = event.clientY - rect.top; // get offset from cursor to top edge of element.
    
            draggedShip = {
                length: parseInt(length), // data attributes always stored as a string in DOM so have to convert back.
                orientation,
                element: event.target,
                cursorOffsetX,
                cursorOffsetY,
            };
        }
    
        function handleDragOver(event) {
            event.preventDefault(); // allows dropping.
            if (!draggedShip) return;

            
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
                
                renderBoard(humanBoard, "human-board");
                draggedShip.element.remove();
                draggedShip = null; 

                const confirmButton = document.querySelector("#confirm-placement");
                confirmButton.disabled = !checkAllShipsPlaced(); // dynamically update confirm button.

            } catch (error) {
                alert(error.message); 
            }
        }
    }

    function flipShips() {
        const ships = document.querySelectorAll(".ship");

        ships.forEach((ship) => {
            const currentOrientation = ship.dataset.orientation;
            const newOrientation = currentOrientation === "horizontal" ? "vertical" : "horizontal"; 
            ship.dataset.orientation = newOrientation;

            ship.classList.remove("horizontal", "vertical");
            ship.classList.add(newOrientation);

            const shipLength = parseInt(ship.dataset.length, 10);
            if (newOrientation === "horizontal") {
                ship.style.width = `${shipLength * 30}px`;
                ship.style.height = "30px";
            } else {
                ship.style.width = "30px";
                ship.style.height = `${shipLength * 30}px`;
            }
        });

     
    }

    function addFlipButtonListener() {
        const flipButton = document.querySelector("#flip-orientation");

        flipButton.addEventListener("click", flipShips);
    }

    function addConfirmPlacementButton() {
        const confirmButton = document.querySelector("#confirm-placement");

        const handleConfirmClick = () => {
            if (checkAllShipsPlaced()) {
                addAttackListeners();
                confirmButton.disabled = true;
            } else {
                alert("Please place all ships before starting the game");
            }
        }

        confirmButton.removeEventListener("click", handleConfirmClick);

        confirmButton.addEventListener("click", handleConfirmClick);

    }

    function resetGame() {
        document.querySelector("#human-board").innerHTML = "";
        document.querySelector("#computer-board").innerHTML = "";
        document.querySelector("#ship-container").innerHTML = "";

        const computerBoardElement = document.querySelector("#computer-board");
        const newBoardElement = computerBoardElement.cloneNode(true); // clone and replace to remove listeners.
        computerBoardElement.parentNode.replaceChild(newBoardElement, computerBoardElement);

        startGame();
    }


    function addResetButton() {
        const resetButton = document.querySelector("#reset-game");

        const newResetButton = resetButton.cloneNode(true);
        resetButton.parentNode.replaceChild(newResetButton, resetButton);

        newResetButton.addEventListener("click", resetGame);
    }
    
    return {
        startGame
    };

})();

export default domModule;