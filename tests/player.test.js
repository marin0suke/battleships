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

//makeMove

test("makeMove interacts with and updates opponent board", () => {
    const myBoard = new Gameboard();
    const player1 = new Player(myBoard);

    const opponentBoard = new Gameboard();
    const opponent = new Player(opponentBoard);

    const ship1 = new Ship(3);
    const ship2 = new Ship(2);

    const shipPositions = [
        { ship: ship1, coordinate: "A1", orientation: "horizontal"},
        { ship: ship2, coordinate: "D5", orientation: "vertical"},
    ];

    opponent.positionShips(shipPositions);

    player1.makeMove("A4", opponentBoard); 

    expect(opponentBoard.grid[0][3].clicked).toBe(true);
})


//possibleMoves

test("possibleMoves adds unclicked squares to moves array", () => {
    const board = new Gameboard();
    const player = new Player(board);

    const expectedCoordinates = board.grid.flat().map(cell => cell.coordinate);

    const result = player.possibleMoves(board);

    expect(result).toEqual(expect.arrayContaining(expectedCoordinates));
})

test("possibleMoves doesn't add clicked squares to moves array", () => {
    const board = new Gameboard();
    const player = new Player(board);

    board.receiveAttack("A1");
    board.receiveAttack("A2");

    const expectedCoordinates = board.grid
        .flat()
        .filter(cell => !cell.clicked)
        .map(cell => cell.coordinate);

    const result = player.possibleMoves(board);

    expect(result).toEqual(expect.arrayContaining(expectedCoordinates));

    expect(result).not.toContain("A1");
    expect(result).not.toContain("A2");
})

//generateMove 

test("generateMove returns coordinate for a possible move", () => {
    const board = new Gameboard();
    const player1 = new Player(board);

    const board2 = new Gameboard();
    const player2 = new Player(board2);

    board2.receiveAttack("A1");
    board2.receiveAttack("A2");

    const move = player1.generateMove(board2);

    const possibleMoves = player1.possibleMoves(board2);
    
    expect(possibleMoves).toContain(move);
})

test("generateMove returns valid coordinates for adjacent cells after hitting a ship", () => {
    const board = new Gameboard();
    const player1 = new Player(board);
    
    const board2 = new Gameboard();
    const player2 = new Player(board2);
    
    const ship = new Ship(3);
    board.placeShip(ship, "D1", "horizontal");
    
    player2.makeMove("D1", board); // makeMove to trigger addPendingTargets. (although )

    const nextMove = player2.generateMove(board);

    const expectedTargets = ["C1", "E1", "D2"]; 

    expect(expectedTargets).toContain(nextMove);
})

