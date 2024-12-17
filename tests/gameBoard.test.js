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

test("placeShip occupies the board with specified Ship details", () => {
    const board = new Gameboard;
    board.placeShip(3, "E5", "horizontal");
    expect(board.grid[4][4].occupied).toBe(true);   
    expect(board.grid[4][5].occupied).toBe(true);   
    expect(board.grid[4][6].occupied).toBe(true);   
})

test("placeShip occupies the board vertically", () => {
    const board = new Gameboard;
    board.placeShip(3, "E5", "vertical");
    expect(board.grid[4][4].occupied).toBe(true);   
    expect(board.grid[5][4].occupied).toBe(true);   
    expect(board.grid[6][4].occupied).toBe(true);   
})

test("placeShip throws an error when trying to place out of bounds of the board", () => {
    const board = new Gameboard;
    expect(() => board.placeShip(2, "J10", "horizontal")).toThrow("Ship placement is out of bounds");
    expect(() => board.placeShip(3, "I5", "vertical")).toThrow("Ship placement is out of bounds");
})

test("placeShip throws an error when trying to place ship on occupied coordinate", () => {
    const board = new Gameboard;
    board.placeShip(3, "E5", "vertical");
    expect(() => board.placeShip(3, "E5", "vertical")).toThrow("Cell is already occupied");
})