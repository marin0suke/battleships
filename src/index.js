import Ship from "./ship.js";

console.log('test')

const ship = new Ship(3);
console.log(ship);
console.log(ship.isSunk());
ship.isHit();
console.log(ship.health);
console.log(ship.isSunk());
ship.isHit();
console.log(ship.health);
console.log(ship.isSunk());
ship.isHit();
console.log(ship.health);
console.log(ship.isSunk());

console.log(ship);
