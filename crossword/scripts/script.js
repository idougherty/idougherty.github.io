
let board = new Board();

function generateBoard() {
    let size = document.getElementById("sizeInput").value;
    size = Math.round(Math.max(3, Math.min(size, 18)));

    loadNewBoard(size);
}

async function loadNewBoard(size) {
    board.loadBoard(board.loadingBoardData, {}, true);

    await new Promise(resolve => {
            requestAnimationFrame(() => requestAnimationFrame(resolve));
        });

    let start = Date.now();
    const boardVector = await Module.generate_board_with_seed(size, Math.floor(Math.random() * 10000));
    console.log(`Generated board in: ${Date.now()-start} ms`);
    
    let boardData = [];

    for(let i = 0; i < size; i++) {
        let row = [];

        for(let j = 0; j < size; j++) {
            let charCode = boardVector.get(i * size + j);
            row.push(String.fromCharCode(charCode));
        }

        boardData.push(row);
    }

    start = Date.now();
    const clueVector = await Module.solve_given_board(size, boardVector);
    console.log(`Generated solution in: ${Date.now()-start} ms`);

    if(clueVector.size() == 0) {
        console.log("No solution found!");

        board.loadBoard(board.errorBoardData, clueVector, false, true);
        return;
    }

    let clues = { across: {}, down: {} };

    for(let i = 0; i < clueVector.size(); i++) {
        let clue = clueVector.get(i);
        let clueList = clue.is_across ? "across" : "down";
        clues[clueList][clue.word_num] = { value: clue.word, hint: clue.hint };
    }

    console.log(clues);

    board.loadBoard(boardData, clues);
}

var Module = {};

Module['locateFile'] = function(path, prefix) {
  return 'scripts/wasm/'+path;
}

Module['onRuntimeInitialized'] = () => loadNewBoard(5);