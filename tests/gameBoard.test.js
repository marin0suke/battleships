import Gameboard from "../src/gameBoard.js";

test("initializeBoard generates default board of 10x10 grid", () => {
    const board = new Gameboard();
    expect(board.grid.length).toBe(10);
    expect(board.grid[0].length).toBe(10);
})

test("initializeBoard generates custom board size smaller than 10x10", () => {
    const board = new Gameboard(8);
    expect(board.grid.length).toBe(8);
    expect(board.grid[0].length).toBe(8);
})

test("initializeBoard generates board squares with correct initialized properties", () => {
    const board = new Gameboard();
    board.grid.forEach((row) => {
        row.forEach((cell) => {
            expect(cell.occupied).toBe(false);
            expect(cell.clicked).toBe(false);
        })
    })
    
})

