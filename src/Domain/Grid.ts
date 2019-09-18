import { Cell, CellAction } from './Cell';

export type Cells = Array<Cell>;

export class Grid {
    [key: number]: number;
    private _column: number;
    private _cells: Cells;

    static generate(row: number, column: number, minesCount: number): Grid {
        const length = row * column;
        let cells: Cells = [];
        for (let i = 0; i < length; i++) {
            const cell =
                minesCount > i ? Cell.withoutBomb() : Cell.withoutBomb();
            cells.push(cell);
        }

        let index = -1;
        while (++index < length) {
            const rand = index + Math.floor(Math.random() * (length - index));
            const cell = cells[rand];

            cells[rand] = cells[index];
            cells[index] = cell;
        }

        //cells.splice(9, 1, Cell.withBomb());
        cells.splice(0, 1, Cell.withBomb());
        cells.splice(1, 1, Cell.withBomb());
        cells.splice(8, 1, Cell.withBomb());
        cells.splice(9, 1, Cell.withBomb());
        cells.splice(20, 1, Cell.withBomb());

        cells.splice(88, 1, Cell.withBomb());
        //cells.splice(90, 1, Cell.withBomb());
        //cells.splice(81, 1, Cell.withBomb());

        const grid = new Grid(column, cells);
        grid.setNumberOfSurrondingMines();
        console.log(grid._cells);
        return grid;
    }

    constructor(column: number, cells: Cells) {
        if (!Number.isInteger(column)) {
            throw new TypeError('column count must be an integer');
        }

        if (cells.length % column !== 0 || cells.length === 0) {
            throw new RangeError(
                'cell count must be dividable by column count'
            );
        }

        this._column = column;
        this._cells = cells;
    }

    setNumberOfSurrondingMines(): void {
        const row = this._cells.length / this._column;
        // theses FOR loops set the number of surrounding mines.
        this.scan(row, 1);
        this.scan(1, row);
    }

    scan(longeur: number, step: number) {
        for (let i = 0; i < longeur * this._column; i += longeur) {
            let stockCurrent = this._cells[i].minesAround();
            let stockNext = 0;
            if (this._cells[i + longeur])
                // the second case of longueur
                stockNext = this._cells[i + step].minesAround();

            for (let j = 0; j < step * this._column; j += step) {
                //console.log(i * step + j);
                let current = i + j;
                let next = i + j + step;
                //console.log('current', i + j);
                //console.log('next', i + j + step);
                console.log((next + 1) / (current + 1) < 2);
                if (this._cells[next] && next / (current + step) != 0) {
                    this._cells[current].bomb;
                    stockCurrent = stockNext;
                    stockNext = this._cells[next].minesAround();
                    this._cells[next].addMinesAround(
                        stockCurrent + this._cells[next].minesAround()
                    );
                    this._cells[current].addMinesAround(
                        this._cells[current].minesAround() + stockNext
                    );
                }
            }
        }
    }

    scanBoardHorizontal(longeur: number, step: number) {
        for (let i = 0; i < longeur * this._column; i += longeur) {
            let stockCurrent = this._cells[i].minesAround();
            let stockNext = 0;
            if (this._cells[i + longeur])
                stockNext = this._cells[i + longeur].minesAround();
            console.log(i + longeur);
            //console.log(i + longeur);
            for (let j = 0; j < step * this._column; j += step) {
                // stockNext = this._cells[i * 10 + 1].minesAround();
                // Each surronding cells of a bomb
                // [0] [0] [0]
                // [0] [1] [0]
                // [0] [0] [0]
                let current = i + j;
                let next = i + j + step;
                //console.log('current', i + j);
                //console.log('next', i + j + step);
                if (this._cells[next]) {
                    console.log('in', next, current);
                    stockCurrent = stockNext.valueOf();
                    stockNext = this._cells[next].minesAround();
                    this._cells[next].addMinesAround(
                        stockCurrent + this._cells[next].minesAround()
                    );
                    this._cells[current].addMinesAround(
                        this._cells[current].minesAround() + stockNext
                    );
                }
            }
        }
        //this._cells[j * longeur + i + 1].incMinesAround();
        // Condition of not pointing out of the board
        /*
                        ** ligne précende: 
                        j / row = 0
                        ((j + k) * row + (i + d)) / row != j / row
                        *
                        * */
        // case same line
        // case line below
        // case line above
        /*
                    for (let d = -1; d < 3; d++) {
                        
                        let line = j * row;
                        let position = i + d;
                        if (this._cells[line + position]) {
                            // Condition of the case searched is on the board.
                            //if (row - (j + h) * row + (i + l) >= 0) {
                            if ((j * row + (i + d)) / row != j / row) {
                                console.log('in pb', [j * row + (i + d)]);
                            } else {
                                console.log('in pb2', [j * row + (i + d)]);
                            }
                            this._cells[line + position].incMinesAround();

                            //}
                        }
                        
                    }
                    */
    }

    [Symbol.iterator]() {
        return this._cells[Symbol.iterator]();
    }

    map(
        callbackfn: (value: Cell, index: number, array: Cell[]) => {},
        thisArg?: any
    ) {
        return this._cells.map(callbackfn);
    }

    cellByIndex(index: number): Cell | undefined {
        return this._cells[index];
    }

    cellByCoodinates(x: number, y: number): Cell | undefined {
        return this._cells[this._column * y + x];
    }

    sendActionToCell(cellIndex: number, action: CellAction): Grid {
        const cells = [...this._cells];
        const cell = cells[cellIndex];

        cells[cellIndex] = cell[action]();
        return new Grid(this._column, cells);
    }

    get column() {
        return this._column;
    }
}
