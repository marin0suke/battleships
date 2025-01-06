import domModule from "../src/domModule.js";
import { JSDOM } from 'jsdom';

describe("drag and drop ship placement", () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div id="human-board" class="board"></div>
            <div id="ship-container"></div>
        `;

        domModule.startGame();
    });

    test("places a ship on a valid drop", () => {
        const ship = document.querySelector(".ship");
        const cell = document.querySelector('[data-coordinate="A1"]');

        ship.dispatchEvent(new DragEvent("dragstart"));
        cell.dispatchEvent(new DragEvent("drop"));

        const boardCell = document.querySelector('[data-coordinate="A1"]');
        expect(boardCell.classList.contains("ship")).toBe(true);
    })
})