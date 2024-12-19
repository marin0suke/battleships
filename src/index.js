import Ship from "./ship.js";
import Gameboard from "./gameBoard.js";
import Player from "./player.js";

const board = new Gameboard();
const player1 = new Player(board);

const board2 = new Gameboard();
const player2 = new Player(board2);

const ship = new Ship(3);
board.placeShip(ship, "D1", "horizontal");

console.log(board.receiveAttack("D1")); // "Hit!" is returned.
console.log(player2.pendingTargets); // D1 should be added to player2 pendingTargets

console.log(player2.generateMove(board)); // move generated should be from pending targets - cells adjecent to D1.

