class UserSelection {

    constructor() {
        this.isSelected = false;
        this.isAcross = true;
        this.row = 0;
        this.col = 0;
        this.word = null;
    }

    moveCursor(board, row, col, isAcross) {
        let prevCell = board.getCell(this.row, this.col);
        let focusout = new FocusEvent('focusout');
        prevCell.dispatchEvent(focusout);

        this.isAcross = isAcross;

        let cell = board.getCell(row, col);
        let click = new PointerEvent('click');
        cell.focus();
        cell.dispatchEvent(click);
    }

    advanceCursor(board, dir = 1) {
        let {row, col, isAcross} = board.findNextCell(this.row, this.col, this.isAcross, dir);
        this.moveCursor(board, row, col, isAcross);
    }

    shiftCursor(board, drow, dcol) {
        const isHorizontalShift = drow == 0;

        if(this.isAcross != isHorizontalShift) {
            this.moveCursor(board, this.row, this.col, isHorizontalShift);
        } else {
            let nextPos = board.findNextOpenCell(this.row, this.col, drow, dcol);

            if(nextPos != null)
                this.moveCursor(board, nextPos.row, nextPos.col, isHorizontalShift);
        }
    }
}