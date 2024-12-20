import Gameboard from "./gameBoard";
import Player from "./player";

const domModule = (() => {
    function startGame() { // public method
        const humanBoard = new Gameboard()
        const human = new Player(humanBoard);

        const computerBoard = new Gameboard();
        const computer = new Player(computerBoard);

        // add userinput ship placement and randomly generated ships later.

        const testShipPositions = [ // temp.
            { ship: new Ship(5), coordinate: "A1", orientation: "horizontal" },
            { ship: new Ship(4), coordinate: "B2", orientation: "vertical" },
            { ship: new Ship(3), coordinate: "C3", orientation: "horizontal" },
            { ship: new Ship(3), coordinate: "D4", orientation: "vertical" },
            { ship: new Ship(2), coordinate: "E5", orientation: "horizontal" },
        ];

        // to create: getUserShipPlacement and generateRandomShipLayout.
        // const humanShipPositions = getUserShipPlacement() || generateRandomShipLayout();
        // const computerShipPositions = generateRandomShipLayout(); 

        human.positionShips(testShipPositions);
        computer.positionShips(testShipPositions);

    }


    // DOM METHODS:

    renderBoard() {
        
    }


    return {
        startGame,

    };

})();

export default domModule;