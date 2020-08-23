const GameBoard = (() => {
    let board;

    const getBoard = () => board;
    const isOccuped = (i ,j) => board[i][j];
    const markBox = (sym, i, j) => board[i][j] = sym;
    const areEmptyBoxes = () => {
        let r = board.reduce((result, arr) => {
            if(arr.includes(null)) result = true;
            return result;
        }, false);
        return r;
    }
    const setEmptyBoard = () => board = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];
    
    return { 
        getBoard, 
        setEmptyBoard,
        isOccuped, 
        markBox, 
        areEmptyBoxes 
    };
})();

const DisplayController = (() => {
    const players = document.querySelector('#players');
    const grid = document.querySelector('#grid');
    const content = document.querySelector('#content');

    const loadPlayers = () => {
        const player1 = players.querySelector('#player1');
        const player2 = players.querySelector('#player2');
        const player1Sym = document.createElement('span');
        const player2Sym = document.createElement('span');

        player1Sym.textContent = Game.player1.sym;
        player2Sym.textContent = Game.player2.sym;
        
        player1Sym.classList.add('player-sym');
        player2Sym.classList.add('player-sym');

        player1.appendChild(player1Sym);
        player2.appendChild(player2Sym);
        loadPlayerName(player1, Game.player1.name);
        loadPlayerName(player2, Game.player2.name);
        players.appendChild(player1);
        players.appendChild(player2);

        loadPlayerListeners(player1);
        loadPlayerListeners(player2);
    }

    const loadPlayerName = (playerDiv, playerName) => {
        const playerNameDiv = document.createElement('div');
        playerNameDiv.textContent = playerName;
        playerDiv.appendChild(playerNameDiv);
    }

    const loadPlayerListeners = (player) => {
        player.addEventListener('click', () => runModal(player));
    }

    const createBoard = (board) => {
        while(grid.firstChild) grid.removeChild(grid.lastChild); // clear the board

        for(let i = 0; i < board.length; i++) {
            for(let j = 0; j < board[i].length; j++) {
                const box = document.createElement('div');
                box.setAttribute('id', `box-${i}${j}`); // id="box-00"
                box.classList.add('box');
                if(i < board.length - 1) box.classList.add('border-bottom');
                if(j < board[i].length - 1) box.classList.add('border-right');
                grid.appendChild(box);
            }
        }
        loadBoxListeners();
    };

    const loadBoxListeners = () => {
        grid.querySelectorAll('.box').forEach(box => {
            let boxId = box.id.slice(4).split(''); // box position array: [i, j]
            boxId[0] = +boxId[0];
            boxId[1] = +boxId[1];
            box.addEventListener('click', () => {
                if(!GameBoard.isOccuped(...boxId) && !Game.isOver) {
                    let sym = Game.getSym();
                    GameBoard.markBox(sym, ...boxId);
                    updateBox(sym, box);
                    if(Game.isWinner(boxId, sym)) {
                        if(sym === 'X') {
                            showGameResult(Game.player1.name);
                        } else {
                            showGameResult(Game.player2.name);
                        }
                        Game.isOver = true;
                        showReplayButton();
                        highlightWinnerBoxes(Game.winnerBoxes);
                    } else {
                        if(GameBoard.areEmptyBoxes()) {
                            Game.changeSym();
                        } else {
                            Game.isOver = true;
                            showGameResult();
                            showReplayButton();
                        }
                    }
                }
            });
        });
    };

    const showGameResult = (winner) => {
        const gameResult = document.createElement('div');
        gameResult.classList.add('game-result');
        if(winner) {
            gameResult.textContent = `${winner} has won!`;
        } else {
            gameResult.textContent = "It's a tie!";
        }
        content.appendChild(gameResult);
    }

    const showReplayButton = () => {
        const replayButton = document.createElement('button');
        replayButton.classList.add('button');
        replayButton.textContent = 'Play again';
        replayButton.addEventListener('click', Game.restart);
        content.appendChild(replayButton);
    }

    const highlightWinnerBoxes = (boxes) => {
        boxes.forEach(b => {
            const box = grid.querySelector(`#box-${b.join('')}`);
            box.classList.add('winner-box');loadPlayerName
        });
    }

    const runModal = (player) => {
        const modal = document.getElementById("myModal");
        const span = document.getElementsByClassName("close")[0];
        const form = document.getElementById('update-player');

        modal.style.display = "block";

        span.onclick = function() {
            modal.style.display = "none";
        }

        window.onclick = function(event) {
            if (event.target == modal) {
              modal.style.display = "none";
            }
        }

        const changePlayer1Name = function(form) {
            form.preventDefault();
            const playerDiv = document.querySelector('#player1');
            playerDiv.removeChild(playerDiv.lastChild);
            Game.player1.name = form.target.elements.playerName.value;
            loadPlayerName(playerDiv, Game.player1.name);
            modal.style.display = "none";
        }

        const changePlayer2Name = function(form) {
            form.preventDefault();
            const playerDiv = document.querySelector('#player2');
            playerDiv.removeChild(playerDiv.lastChild);
            Game.player2.name = form.target.elements.playerName.value;
            loadPlayerName(playerDiv, Game.player2.name);
            modal.style.display = "none";
        }

        if(player.querySelector('span').textContent === 'X') {
            form.onsubmit = changePlayer1Name.bind(form);
        } else {
            form.onsubmit = changePlayer2Name.bind(form);
        }
    }

    const clearContent = () => {
        while(content.firstChild) content.removeChild(content.lastChild);
    }

    const updateBox = (sym, box) => box.textContent = sym;

    return { createBoard, clearContent, loadPlayers };
})();

const Player = (name, sym) => {
    return { name, sym };
}

const Game = (() => {
    let sym = 'X'; // Player with X starts first
    let isOver = false;
    let winnerBoxes = [];

    const player1 = Player('Player 1', 'X');
    const player2 = Player('Player 2', '0');

    const getSym = () => sym;
    const changeSym = () => sym === 'X' ? sym = '0' : sym = 'X';

    const start = () => {
        GameBoard.setEmptyBoard();
        DisplayController.loadPlayers();
        DisplayController.createBoard(GameBoard.getBoard());
    };

    const restart = () => {
        DisplayController.clearContent();
        if(Game.getSym() === '0') Game.changeSym();
        Game.isOver = false;
        GameBoard.setEmptyBoard();
        DisplayController.createBoard(GameBoard.getBoard());
    }

    const isWinner = (boxId, sym) => {
        let result = false;
        result = isHorizontalWin(boxId[0], sym);
        if(result) return result;
        result = isVerticalWin(boxId[1], sym);
        if(result) return result;
        result = isLeftDiagonalWin(boxId, sym);
        if(result) return result;
        result = isRightDiagonalWin(boxId, sym);
        return result;
    }

    const isHorizontalWin = (row, sym) => {
        const board = GameBoard.getBoard();
        let count = 0;
        for(let i = 0; i < board[row].length; i++) {
            if(board[row][i] === sym) {
                count++;
                Game.winnerBoxes.push([row, i]);
            } else {
                count = 0;
                Game.winnerBoxes = [];
            }
        }
        if(count != 3) Game.winnerBoxes = [];
        return count === 3;
    }

    const isVerticalWin = (col, sym) => {
        const board = GameBoard.getBoard();
        let count = 0;
        for(let i = 0; i < board.length; i++) {
            if(board[i][col] === sym) {
                count++;
                Game.winnerBoxes.push([i, col]);
            } else {
                count = 0;
                Game.winnerBoxes = [];
            }
        }
        if(count != 3) Game.winnerBoxes = [];
        return count === 3;
    }

    const isLeftDiagonalWin = (boxId, sym) => {
        const board = GameBoard.getBoard();
        const boardLength = board[0].length;
        let count = 0;
        let box;

        if(boxId[0] > boxId[1]) {
            box = [boxId[0] - boxId[1], 0];
        } else if(boxId[0] < boxId[1]) {
            box = [0, boxId[1] - boxId[0]];
        } else {
            box = [0, 0];
        }
        
        while(box[0] != boardLength && box[1] != boardLength) {
            if(board[box[0]][box[1]] === sym) {
                count++;
                Game.winnerBoxes.push([box[0], box[1]]);
            } else {
                count = 0;
                Game.winnerBoxes = [];
            }
            box[0]++;
            box[1]++;
        }
        if(count != 3) Game.winnerBoxes = [];
        return count === 3;
    }

    const isRightDiagonalWin = (boxId, sym) => {
        const board = GameBoard.getBoard();
        const boardLength = board[0].length - 1;
        let count = 0;
        let box;

        if(boxId[0] + boxId[1] >= boardLength) {
            box = [boxId[0] + boxId[1] - boardLength, boardLength];
        } else {
            box = [0, boxId[0] + boxId[1]];
        }

        while(box[0] != boardLength + 1 && box[1] != -1) {
            if(board[box[0]][box[1]] === sym) {
                count++;
                Game.winnerBoxes.push([box[0], box[1]]);
            } else {
                count = 0;
                Game.winnerBoxes = [];
            }
            box[0]++;
            box[1]--;
        }
        if(count != 3) Game.winnerBoxes = [];
        return count === 3;
    }

    return { 
        start, 
        restart,
        getSym, 
        changeSym, 
        isWinner,
        winnerBoxes,
        player1,
        player2, 
        isOver
    };
})();

Game.start();