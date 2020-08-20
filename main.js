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
        loadBoxListeners();
    };

    const loadBoxListeners = () => {
        grid.querySelectorAll('.box').forEach(box => {
            let boxId = box.id.slice(4).split(''); // box position array: [i, j]
            box.addEventListener('click', () => {
                if(!GameBoard.isOccuped(...boxId)) {
                    let sym = Game.getSym();
                    GameBoard.markBox(sym, ...boxId);
                    updateBox(sym, box);
                    if(Game.isWinner(boxId, sym)) {
                        console.log('Has won!!!');
                    } else {
                        Game.changeSym();
                    }
                }
            });
        });
    };

    const updateBox = (sym, box) => box.textContent = sym;

    return { createBoard };
})();

const Player = (name, sym) => {
    return { name, sym };
}

const Game = (() => {

    let sym = 'X'; // Player with X starts first

    const player1 = Player('Player 1', 'X');
    const player2 = Player('Player 2', '0');;

    const changePlayer1Name = (name) => player1.name = name;
    const changePlayer2Name = (name) => player2.name = name;

    const getSym = () => sym;

    const changeSym = () => sym === 'X' ? sym = '0' : sym = 'X';

    const start = () => {
        DisplayController.createBoard(GameBoard.getBoard());
    };

    const isWinner = (boxId, sym) => {
        let result = false;
        result = isHorizontalWin(boxId[0], sym);
        if(result) return result;
        result = isVerticalWin(boxId[1], sym);
        if(result) return result;
        result = isDiagonalWin(boxId, sym);
        return result;
    }

    const isHorizontalWin = (row, sym) => {
        const board = GameBoard.getBoard();
        let count = 0;
        for(let i = 0; i < board[row].length; i++) {
            board[row][i] === sym ? count++ : count = 0;
        }
        return count === 3;
    }

    const isVerticalWin = (col, sym) => {
        const board = GameBoard.getBoard();
        let count = 0;
        for(let i = 0; i < board.length; i++) {
            board[i][col] === sym ? count++ : count = 0;
        }
        return count === 3;
    }

    return { start, getSym, changeSym, isWinner };
})();

Game.start();