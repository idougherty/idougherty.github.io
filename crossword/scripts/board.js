class Board extends DomBoard {

    constructor() {
        super();
    }

    updateBoard() {
        this.lettersFilled = 0;
        this.wordsSolved = 0;
        this.totalLetters = 0;

        if(!this.isLoading) {
            this.words = this.populateWords();
            this.fillDomClues(this.words);
        }
    }

    populateWords() {
        let vertical = [];
        let horizontal = [];
        let wordIndex = 0;

        for(let row = 0; row < this.height; row++) {
            for(let col = 0; col < this.width; col++) {
                if(this.data[col][row] != BLOCKED_CHAR)
                    this.totalLetters++;

                if(!this.isStartOfWord(row, col))
                    continue;
                wordIndex++;
                if(row - 1 < 0 || this.data[row - 1][col] == BLOCKED_CHAR) {
                    let length = 0;
                    while(row + length < this.height && this.data[row + length][col] != BLOCKED_CHAR) length++;
                    vertical.push({row, col, isAcross: false, isSolved: false, length, label: wordIndex, value: new Array(length).fill(OPEN_CHAR)});
                }
                if(col - 1 < 0 || this.data[row][col - 1] == BLOCKED_CHAR) {
                    let length = 0;
                    while(col + length < this.width && this.data[row][col + length] != BLOCKED_CHAR) length++;
                    horizontal.push({row, col, isAcross: true, isSolved: false, length, label: wordIndex, value: new Array(length).fill(OPEN_CHAR)});
                }
            }
        }

        return [...horizontal, ...vertical];
    }

    updateWords(row, col, letter) {
        let [_, across] = this.findWord(row, col, true);
        let [__, down] = this.findWord(row, col, false);
        
        if(across.value[col - across.col] == OPEN_CHAR && letter != OPEN_CHAR)
            this.lettersFilled++;
        else if(across.value[col - across.col] != OPEN_CHAR && letter == OPEN_CHAR)
            this.lettersFilled--;

        across.value[col - across.col] = letter;
        down.value[row - down.row] = letter;
        this.data[row][col] = letter;

        this.updateProgress(across);
        this.updateProgress(down);

        this.setProgress(this.lettersFilled / this.totalLetters, this.wordsSolved == this.words.length);
    }

    updateProgress(word) {
        let isSolved = true;
        let clueList = word.isAcross ? 'across' : 'down';
        let clue = this.clues[clueList][word.label];

        word.filled = 0;
        for(let i = 0; i < word.value.length; i++) {
            if(word.value[i].toUpperCase() != clue.value[i].toUpperCase())
                isSolved = false;
        }

        if(!isSolved && word.isSolved)
            this.wordsSolved--;

        if(isSolved && !word.isSolved)
            this.wordsSolved++;
        
        word.isSolved = isSolved;
    }

    findWord(row, col, isAcross) {
        if(isAcross)
            while(col > 0 && this.data[row][col - 1] != BLOCKED_CHAR)
                col--;
        else
            while(row > 0 && this.data[row - 1][col] != BLOCKED_CHAR)
                row--;
    
        for(const [idx, word] of this.words.entries())
            if(word.row == row && word.col == col && word.isAcross == isAcross)
                return [idx, word];

        throw new Error(`Could not find word for (${col}, ${row})`);
    }

    findNextOpenCell(row, col, drow, dcol) {
        row += drow;
        col += dcol;

        while(row >= 0 && col >= 0 && row < this.height && col < this.width) {
            if(this.data[row][col] != BLOCKED_CHAR)
                return {row, col};

            row += drow;
            col += dcol;
        }

        return null;
    }

    findNextCell(row, col, isAcross, dir = 1) {
        if(isAcross && col + dir >= 0 && col + dir < this.width && this.data[row][col + dir] != BLOCKED_CHAR)
            return {row, col: col + dir, isAcross};
        if(!isAcross && row + dir >= 0 && row + dir < this.height && this.data[row + dir][col] != BLOCKED_CHAR)
            return {row: row + dir, col, isAcross};

        let [idx, _] = this.findWord(row, col, isAcross);
        idx = (idx + dir + this.words.length) % this.words.length;
        let word = this.words[idx];

        row = word.row;
        col = word.col;

        let letterIdx = dir == 1 ? 0 : word.length - 1;
        word.isAcross ? col += letterIdx : row += letterIdx;

        return {row, col, isAcross: word.isAcross};
    }
}