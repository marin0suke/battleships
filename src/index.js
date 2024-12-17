import Ship from "./ship.js";
import Gameboard from "./gameBoard.js";

console.log('test')

const ship = new Ship(3);
const board = new Gameboard();


board.placeShip(ship, "E5", "horizontal");
console.log(board.grid[4][4]);