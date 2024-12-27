export default class Gameboard {
    constructor(size = 10) {
        this.size = size;
        this.grid = this.initializeBoard();
        this.missedShots = []; // tracks all so can display easily.
        this.ships = []; // tracks all ship instances on board.
    }

    initializeBoard() { // relevant to have its own method to make boards smaller is want to.
        const rows = "ABCDEFGHIJ".slice(0, this.size).split(""); // alphabet for corresponding rows. slice to custom size if specified. split to arrays so Array.from works.
        const board = rows.map((row) => Array.from({ length: this.size }, (_, col) => ({ // practiced using Array.from instead of nested loop to generate grid.
            coordinate: `${row}${col + 1}`,
            occupied: null, 
            hit: false,
            clicked: false,
            reserved: false 
            }))
        )
        return board;
    }

    placeShip(ship, coordinate, orientation) { 
        const rowIndex = coordinate.charCodeAt(0) - 65;
        const colIndex = parseInt(coordinate.slice(1)) - 1; 

        if (orientation !== "horizontal" && orientation !== "vertical") {
            throw new Error("Orientation must be 'horizontal' or 'vertical'");
        }

        if ( // check if ship placement will be out of bounds. index + length of ship can't be more than the size of grid.
            (colIndex + ship.length > this.size && orientation === "horizontal") || 
            (rowIndex + ship.length > this.size && orientation === "vertical") 
        ) {
            throw new Error("Ship placement is out of bounds");
        }

        // next, separate checking for overlap from actually placing the ship.
        //placing each part of the ship in a loop might cause partially placed ships.

        for (let i = 0; i < ship.length; i++) { // checking each cell for length of ship we will place.
            const targetRow = orientation === "horizontal" ? rowIndex : rowIndex + i;
            const targetCol = orientation === "horizontal" ? colIndex + i : colIndex;

            if (this.grid[targetRow][targetCol].occupied) {
                throw new Error("Cell is already occupied"); // if we encounter an occupied cell, we 
            }
        }
        
        for (let i = 0; i < ship.length; i++) {
            const targetRow = orientation === "horizontal" ? rowIndex : rowIndex + i;
            const targetCol = orientation === "horizontal" ? colIndex + i : colIndex;
            
            // console.log(`Placing ship at: Row ${targetRow}, Col ${targetCol}`);
            // console.log(`Occupied Cell: `, this.grid[targetRow][targetCol]);
            this.grid[targetRow][targetCol].occupied = ship;
            this.ships.push(ship);
        }
    }

    receiveAttack(coordinate) {
    //take letter coord and convert it to a pair.
        const rowIndex = coordinate.charCodeAt(0) - 65;
        const colIndex = parseInt(coordinate.slice(1)) - 1; 

        const targetCell = this.grid[rowIndex][colIndex]; // verbose so save.

       
        targetCell.clicked = true;

                        
        if (targetCell.occupied) {
            targetCell.occupied.hit(); // invokes hit function
            targetCell.hit = true; // updates hit prop on coordinate.
            return "Hit!"; 
        } else {
            this.missedShots.push(coordinate);
            return "Miss!"; 
        }
    }

    // next adding allShipsSunk() function - to add this, this means Gameboard will be responsible for tracking ships.
    // would have to create new class to deal with all ship placement and tracking (assignment brief excludes this)

    areAllShipsSunk() {
        const allSunk = this.ships.every(ship => ship.isSunk());
        return allSunk;
    }
}

