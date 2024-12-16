import Ship from "../src/ship.js";

test("ship instance initialised as isSunk = false", () => {
    const ship = new Ship();
    expect(ship.isSunk()).toBe(false);
})

test("ship isSunk returns true if hit the same number of times as its length", () => {
    const ship = new Ship(3);
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
})