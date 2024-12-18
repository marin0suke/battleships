export default class Player {
    constructor(board, name = "You", isComputer = false) {
        if (!board) throw new Error("Gameboard input required");
        this.name = name;
        this.isComputer = isComputer;
        this.board = board;
    }

    positionShips(shipPositions) { // NF: game setup. called in controller. player places their ships on own board at start. accept array of positions.
        shipPositions.forEach(({ ship, coordinate, orientation }) => {
            try {
                this.board.placeShip(ship, coordinate, orientation);
            } catch (error) {
                throw new Error(`Failed to place ship at ${coordinate}: ${error.message}`);
            }
        });
    }

    makeMove(coordinate, opponentBoard) { // NF: gameplay. goal - call receiveAttack on opponentboard.
        if (!opponentBoard) throw new Error("Opponent's board required to make a move");
        return opponentBoard.receiveAttack(coordinate);

    }

    isDefeated() { // NF: win/loss condition. call areAllShipsSunk on this players board.
        return this.board.allShipsSunk();
    }   

    //generateMove - will need possible moves. (helper?)
    // choose the move from possibleMove (generate a coordinate) that will be passed into makeMove.
    // add smart move - if computer hits a ship, target adjacent squares. get info back from receiveAttack? (if hit). 

    possibleMoves() { // array of possible moves for the computer to make.
        const moves = [];

        this.board.grid.forEach((row) => {
            row.forEach((cell) => {
                if (!cell.clicked) {
                    moves.push(cell.coordinate);
                }
            })
        })

        return moves;
    }     

    generateMove(opponentBoard) {
        if (!opponentBoard) throw new Error("Opponent's board required to generate move")

        const moves = opponentBoard.possibleMoves
    }

    // need to generate computer moves - random move generator? get all possible moves on the board (not clicked).
    //smart move generator - target adjacent cells after a hit. 
}

//decide whether or not to have a new instance of Gameboard created with the Player - 
// will minimise assigning gameboards to players in game controller.
// practicing scalability and flexibility = let controller handle gameboard creation and pass it to Player class.