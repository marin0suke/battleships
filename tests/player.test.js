import Player from "../src/player.js";
import Gameboard from "../src/gameBoard.js";
import Ship from "../src/ship.js";

test("New Player instance only returns new player if board is provided", () => {
    const board = new Gameboard();
    const player1 = new Player(board);
    expect(player1.board).toBe(board);
})

//positionShips

test("positionShips takes array of ship information from controller and applies positions to player board", () => {
    const board = new Gameboard();
    const player = new Player(board);

    const ship1 = new Ship(3);
    const ship2 = new Ship(2);

    const shipPositions = [
        { ship: ship1, coordinate: "A1", orientation: "horizontal"},
        { ship: ship2, coordinate: "D5", orientation: "vertical"},
    ];

    player.positionShips(shipPositions);

    expect(board.grid[0][0].occupied).toBe(ship1); // A1
    expect(board.grid[0][1].occupied).toBe(ship1); // A2
    expect(board.grid[0][2].occupied).toBe(ship1); // A3

    expect(board.grid[3][4].occupied).toBe(ship2); // D5
    expect(board.grid[4][4].occupied).toBe(ship2); // E5
    
})
