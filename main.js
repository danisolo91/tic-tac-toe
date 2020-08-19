
const GameBoard = (() => {

    const board = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];

    const getBoard = () => board;

    const isOccuped = (i ,j) => board[i][j];

    const markBox = (sym, i, j) => board[i][j] = sym;

    return { getBoard, isOccuped, markBox };
})();

const DisplayController = (() => {
    const grid = document.querySelector('#grid');

    const createBoard = (board) => {
        for(let i = 0; i < board.length; i++) {
            for(let j = 0; j < board[i].length; j++) {
                const box = document.createElement('div');
                box.setAttribute('id', `box-${i}${j}`); // id="box-00"
                box.classList.add('box');
                grid.appendChild(box);
            }
        }
    };

    const updateBox = (sym, box) => box.textContent = sym;

    const getGrid = () => grid.querySelectorAll('.box');

    const getBoxId = (box) => box.id.slice(4).split(''); // box position array: [i, j]

    return { createBoard, getGrid, getBoxId, updateBox };
})();

const Player = (name, symbol) => {
    return { name, symbol };
}

const Game = (() => {
    const player1 = Player('Player 1', 'X');
    const player2 = Player('Player 2', '0');;

    const changePlayer1Name = (name) => player1.name = name;
    const changePlayer2Name = (name) => player2.name = name;

    const loadListeners = () => {
        DisplayController.getGrid().forEach(box => {
            let boxId = DisplayController.getBoxId(box);
            box.addEventListener('click', () => {
                if(!GameBoard.isOccuped(...boxId)) {
                    GameBoard.markBox('X', ...boxId);
                    DisplayController.updateBox('X', box);
                }
            });
        });
    };

    const start = () => {
        DisplayController.createBoard(GameBoard.getBoard());
        loadListeners();
    };

    return { start };
})();

Game.start();