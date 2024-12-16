export default class Ship {
    constructor(length) {
        this.length = length;
        this.health = this.length; // number of times the ship can be hit = how many coord points the ship has.
    }

    isSunk() {
        return this.health === 0; // just returns the check for health. 
    }

    hit() {
        if (this.health <= 0) {
            throw new Error("Health is somehow below 0 :( ");
        } else {
            this.health -= 1;
        }
    }
}