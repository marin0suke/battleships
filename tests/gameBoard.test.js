import Gameboard from "../src/gameBoard.js";
import Ship from "../src/ship.js";

// initialiseBoard

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
            expect(cell.occupied).toBe(null);
            expect(cell.clicked).toBe(false);
            expect(cell.reserved).toBe(false);
        })
    })
})

//placeShip

test("placeShip occupies the board with specified Ship details", () => {
    const board = new Gameboard;
    const ship = new Ship(3);
    board.placeShip(ship, "E5", "horizontal");
    expect(board.grid[4][4].occupied).toEqual(ship);   
    expect(board.grid[4][5].occupied).toEqual(ship);   
    expect(board.grid[4][6].occupied).toEqual(ship);   
})

test("placeShip occupies the board vertically", () => {
    const board = new Gameboard;
    const ship = new Ship(3);
    board.placeShip(ship, "E5", "vertical");
    expect(board.grid[4][4].occupied).toBe(ship);   
    expect(board.grid[5][4].occupied).toBe(ship);   
    expect(board.grid[6][4].occupied).toBe(ship);   
})

test("placeShip throws an error when trying to place out of bounds of the board", () => {
    const board = new Gameboard;
    const ship = new Ship(3);
    expect(() => board.placeShip(ship, "J10", "horizontal")).toThrow("Ship placement is out of bounds");
    expect(() => board.placeShip(ship, "I5", "vertical")).toThrow("Ship placement is out of bounds");
})

test("placeShip throws an error when trying to place ship on occupied coordinate", () => {
    const board = new Gameboard;
    const ship1 = new Ship(3);
    const ship2 = new Ship(3); 
    board.placeShip(ship1, "E5", "vertical");
    expect(() => board.placeShip(ship2, "E5", "vertical")).toThrow("Cell is already occupied");
})

//receiveAttack

test("receiveAttack takes coordinates and updates cell to be clicked(attacked)", () => {
    const board = new Gameboard();
    board.receiveAttack("A1");
    expect(board.grid[0][0].clicked).toBe(true);
})
