export default class Player {
    constructor(board, name = "You", isComputer = false) {
        if (!board) throw new Error("Gameboard input required");
        this.name = name;
        this.isComputer = isComputer;
        this.board = board;
        this.pendingTargets = [];
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

        const { result, sunk } = opponentBoard.receiveAttack(coordinate);

        if (result === "Hit!" && !sunk) {
            this.addPendingTargets(coordinate, opponentBoard);
        }

        return { result, sunk }; // returns attack on opponent board. receiveAttack will return hit or miss string.
    }

    isDefeated() { // NF: win/loss condition. call areAllShipsSunk on this players board.
        return this.board.allShipsSunk();
    }   

    //generateMove - will need possible moves. (helper?)
    // choose the move from possibleMove (generate a coordinate) that will be passed into makeMove.
    // add smart move - if computer hits a ship, target adjacent squares. get info back from receiveAttack? (if hit). 

    possibleMoves(opponentBoard) { // possible moves for this player to make, on opponent's board.
        const moves = [];

        opponentBoard.grid.forEach((row) => {
            row.forEach((cell) => {
                if (!cell.clicked) {
                    moves.push(cell.coordinate);
                }
            })
        })

        return moves;
    }     

    generateMove(opponentBoard) {
        if (this.pendingTargets.length > 0) { // if there is something in pendingTargets, means we have hit something and need to attack adjacent instead of random.
            return this.pendingTargets.pop();
        }

        const moves = this.possibleMoves(opponentBoard); 

        if (moves.length === 0) {
            throw new Error("No moves left to generate");
        }

        const randomIndex = Math.floor(Math.random() * moves.length); 

        return moves[randomIndex]; 
    }

    addPendingTargets(coordinate, opponentBoard) {
        console.log("addPendingTargets called with coordinate:", coordinate);

        const [row, col] = [ // consider helper func - pair to string.
            coordinate.charCodeAt(0) - 65,
            parseInt(coordinate.slice(1), 10) - 1
        ];

        const potentialTargets = [
            { row: row - 1, col },
            { row: row + 1, col },
            { row, col: col - 1 },
            { row, col: col + 1 }
        ];
        console.log("Potential targets:", potentialTargets);

        const boardSize = opponentBoard.grid.length; // support dynamic board size.
        const validTargets = potentialTargets 
            .filter(({ row, col }) => row >= 0 && col >= 0 && row < boardSize && col < boardSize) // removes cells out of bounds
            .filter(({ row, col }) => !opponentBoard.grid[row][col].clicked)
            .map(({ row, col }) => `${String.fromCharCode(65 + row)}${col + 1}`); // for each set of coord, make it a string coord.
        
            console.log("valid targets:", validTargets);
        
        this.pendingTargets.push(...validTargets); // pushes each ind. coord.
    }

    
}
