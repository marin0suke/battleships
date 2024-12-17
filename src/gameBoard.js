import Ship from "./ship.js";

export default class Gameboard {
    constructor(size = 10) {
        this.size = size;
        this.grid = this.initializeBoard();
    }

    initializeBoard() {
        const rows = "ABCDEFGHIJ".slice(0, this.size).split(""); // alphabet for corresponding rows. slice to custom size if specified. split to arrays so Array.from works.
        const board = rows.map((row) => Array.from({ length: this.size }, (_, col) => ({ // practiced using Array.from instead of nested loop to generate grid.
            coordinate: `${row}${col + 1}`,
            occupied: false, 
            clicked: false 
            }))
        )
        return board;
    }

    placeShip(length, coordinate, orientation) {
        const rowIndex = coordinate.charCodeAt(0) - 65; // ascii E to 4.
        const colIndex = parseInt(coordinate.slice(1)) - 1; // "5" to 4.

        if (orientation !== "horizontal" && orientation !== "vertical") {
            throw new Error("Orientation must be 'horizontal' or 'vertical'");
        }

        if ( // check if ship placement will be out of bounds. index + length of ship can't be more than the size of grid.
            (colIndex + length > this.size && orientation === "horizontal") || 
            (rowIndex + length > this.size && orientation === "vertical") 
        ) {
            throw new Error("Ship placement is out of bounds");
        }

        // next, separate checking for overlap from actually placing the ship.
        //placing each part of the ship in a loop might cause partially placed ships.

        for (let i = 0; i < length; i++) { // checking each cell for length of ship we will place.
            const targetRow = orientation === "horizontal" ? rowIndex : rowIndex + i;
            const targetCol = orientation === "horizontal" ? colIndex + i : colIndex;

            if (this.grid[targetRow][targetCol].occupied) {
                throw new Error("Cell is already occupied"); // if we encounter an occupied cell, we 
            }
        }
        
        for (let i = 0; i < length; i++) {
            const targetRow = orientation === "horizontal" ? rowIndex : rowIndex + i;
            const targetCol = orientation === "horizontal" ? colIndex + i : colIndex;
    
            this.grid[targetRow][targetCol].occupied = true;
        }
    }
}

