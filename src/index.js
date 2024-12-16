import Ship from "./ship.js";
import Gameboard from "./gameBoard.js";

console.log('test')

const ship = new Ship(3);
console.log(ship);
console.log(ship.isSunk());
ship.hit();
console.log(ship.health);
console.log(ship.isSunk());
ship.hit();
console.log(ship.health);
console.log(ship.isSunk());
ship.hit();
console.log(ship.health);
console.log(ship.isSunk());

console.log(ship);

const board = new Gameboard();
console.log(board.grid);
