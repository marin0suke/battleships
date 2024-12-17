import Gameboard from "./gameBoard.js";

export default class Player {
    constructor(board, name = "You", isComputer = false) {
        if (!board) throw new Error("Gameboard input required");
        this.name = name;
        this.isComputer = isComputer;
        this.board = board;
    }

    positionShips(shipPositions) { // called in controller. player places their ships on own board at start. accept array of positions.
        shipPositions.forEach(({ ship, coordinate, orientation }) => {
            try {
                this.board.placeShip(ship, coordinate, orientation);
            } catch (error) {
                throw new Error(`Failed to place ship at ${coordinate}: ${error.message}`);
            }
        });
    }

    
    
}

//decide whether or not to have a new instance of Gameboard created with the Player - 
// will minimise assigning gameboards to players in game controller.
// practicing scalability and flexibility = let controller handle gameboard creation and pass it to Player class.