class DomBoard {

    constructor() {
        this.DomTable = document.getElementById("crossword");
        this.DomClues = {
            across: document.getElementById("acrossClues"),
            down: document.getElementById("downClues")
        };
        this.DomProgressBar = document.getElementById("progressCounter");
        this.contentPane = document.getElementById("contentWrapper");

        this.loadingBoardData = [['#', '#', '#', '#', '#', '#', '#'],
                                 ['#', '#', 'Y', 'O', 'U', 'R', '#'],
                                 ['#', 'P', 'U', 'Z', 'Z', 'L', 'E'],
                                 ['#', '#','I', 'S',  '#', '#', '#'],
                                 ['L', 'O', 'A', 'D', 'I', 'N', 'G'],
                                 ['#', '.', '.', '.', '#', '#', '#'],
                                 ['#', '#', '#', '#', '#', '#', '#']];

        this.loadBoard(this.loadingBoardData, {}, true);
    }

    loadBoard(data, clues, isLoading = false) {
        this.selection = new UserSelection();

        this.data = data;
        this.height = data.length;
        this.width = data[0].length;
        this.clues = clues;
        this.isLoading = isLoading;
        this.contentPane.dataset.loading = isLoading;

        console.log(data)
        this.fillDomTable();
        this.updateBoard();
    }

    getCell(row, col) {
        return this.DomTable.rows[row].cells[col];
    }

    getClue(word) {
        let clueList = word.isAcross ? 'across' : 'down';

        for (const li of this.DomClues[clueList].children)
            if (li.value == word.label)
                return li;

        return null;
    }

    setProgress(percentage, completed = false) {
        this.DomProgressBar.dataset.completed = completed;
        this.DomProgressBar.style.setProperty('--progress-value', (percentage * 100)+'%');
    }

    updateHighlight(highlight = true) {
        let row = this.selection.word.row;
        let col = this.selection.word.col;
    
        while (row < this.data.length && col < this.data[0].length && this.data[row][col] != BLOCKED_CHAR) {
            let td = this.getCell(row, col);
            td.dataset.highlighted = highlight;
            this.selection.isAcross ? col++ : row++;
        }
    
        let selectedCell = this.getCell(this.selection.row, this.selection.col);
        selectedCell.dataset.selected = highlight;
    
        let selectedClue = this.getClue(this.selection.word);
        selectedClue.dataset.highlighted = highlight;

        if(highlight)
            selectedClue.scrollIntoView({ behavior: 'smooth' });
    }

    onInput(e) {
        var data = this.handleInput(e.key);

        if(data == null || !this.selection.isSelected)
            return;
        
        const row = Number(e.target.dataset.row);
        const col = Number(e.target.dataset.col);   

        if(e.target.innerHTML == OPEN_CHAR || data != OPEN_CHAR) {
            this.selection.advanceCursor(this, data == OPEN_CHAR ? -1 : 1);
        }

        if(e.target.innerHTML == OPEN_CHAR && data == OPEN_CHAR) {
            let cell = this.getCell(this.selection.row, this.selection.col);
            cell.innerHTML = OPEN_CHAR;
            this.updateWords(this.selection.row, this.selection.col, data);
            return;
        }

        e.target.innerHTML = data;
        this.updateWords(row, col, data);
    }

    handleInput(key) {
        if(key.length == 1 && key.match(/[A-Za-z]/i))
            return key;

        switch(key) {
            case 'Backspace':
                return OPEN_CHAR;
            case 'ArrowUp':
                this.selection.shiftCursor(this, -1, 0);
                break;
            case 'ArrowDown':
                this.selection.shiftCursor(this, 1, 0);
                break;
            case 'ArrowLeft':
                this.selection.shiftCursor(this, 0, -1);
                break;
            case 'ArrowRight':
                this.selection.shiftCursor(this, 0, 1);
                break;
            default:
        }

        return null;
    }

    onFocusOut(e) {
        if(this.selection.isSelected)
            this.updateHighlight(false);

        this.selection.isSelected = false;
    }

    onClick(e) {
        const row = Number(e.target.dataset.row);
        const col = Number(e.target.dataset.col);

        if(this.selection.isSelected)
            this.updateHighlight(false);

        if(this.selection.isSelected && this.selection.row == row && this.selection.col == col) {
            this.selection.isAcross = !this.selection.isAcross;
        } else {
            this.selection.isSelected = true;
            this.selection.row = row;
            this.selection.col = col;
        }

        let [_, word] = this.findWord(row, col, this.selection.isAcross);
        this.selection.word = word;
        this.updateHighlight();
    }

    fillDomTable() {
        const size = this.DomTable.getBoundingClientRect().height / this.data.length;
        const borderWidth = Math.ceil(.025 * size);
        const borderRadius = .1 * size;
        const cellFontSize = .65 * size;
        const cellSize = Math.size - borderWidth;

        let wordIndex = 0;

        this.clearChildren(this.DomTable);
        
        for(let row = 0; row < this.data.length; row++) {
            let tr = this.DomTable.insertRow();
        
            for(let col = 0; col < this.data[0].length; col++) {
                let td = tr.insertCell(); 

                td.dataset.row = row;
                td.dataset.col = col;
        
                td.style.borderWidth = `${borderWidth}px`;
                td.style.borderRadius = `${borderRadius}px`;
                td.style.fontSize = `${cellFontSize}px`;
                td.style.width = `${cellSize}px`;
                td.style.height = `${cellSize}px`;
                
                if (this.data[row][col] == BLOCKED_CHAR) {
                    td.dataset.blocked = true;
                } else {
                    td.tabIndex = -1;

                    if(this.isStartOfWord(row, col)) {
                        td.dataset.wordnum = ++wordIndex;
                        td.tabIndex = wordIndex;
                    }
        
                    td.innerHTML = this.isLoading ? this.data[row][col] : OPEN_CHAR;
        
                    if(!this.isLoading) {
                        td.addEventListener("keydown", e => this.onInput(e));
                        td.addEventListener("click", e => this.onClick(e));
                        td.addEventListener("focusout", e => this.onFocusOut(e));
                    }
                }
            }
        }
    }

    onClueClicked(e) {
        let li = e.target;

        let row = Number(li.dataset.wordRow);
        let col = Number(li.dataset.wordCol);
        let isAcross = li.dataset.wordAcross === 'true';

        this.selection.moveCursor(this, row, col, isAcross);
    }

    fillDomClues(words) {
        this.clearChildren(this.DomClues['across']);
        this.clearChildren(this.DomClues['down']);

        for (const word of words) {
            let clueList = word.isAcross ? 'across' : 'down';
            let clue = this.clues[clueList][word.label];
            console.log(clue, clueList, word.label);

            let li = document.createElement('li');
            li.innerHTML = clue.hint;
            li.value = word.label;

            li.dataset.wordRow = word.row;
            li.dataset.wordCol = word.col;
            li.dataset.wordAcross = word.isAcross;

            li.addEventListener("click", e => this.onClueClicked(e));

            this.DomClues[clueList].appendChild(li);
        }
    }

    clearChildren(element) {
        while(element.firstChild)
            element.removeChild(element.firstChild);
    }

    isStartOfWord(row, col) {
        return this.data[row][col] != BLOCKED_CHAR &&
            (row - 1 < 0 || this.data[row - 1][col] == BLOCKED_CHAR || 
             col - 1 < 0 || this.data[row][col - 1] == BLOCKED_CHAR);
    }
}