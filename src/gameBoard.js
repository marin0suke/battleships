export default class Gameboard {
    constructor(size = 10) {
        this.size = size;
        this.grid = this.initializeBoard();
    }

    initializeBoard() {
        const rows = "ABCDEFGHIJ".slice(0, this.size).split("");
        console.log(rows);
        const board = rows.map((row) => Array.from({ length: this.size }, (_, col) => ({
            coordinate: `${row}${col + 1}`,
            occupied: false,
            clicked: false
            }))
        )

        return board;
    }
}

