import { Cell, CellAction } from './Cell';

export type Cells = Array<Cell>;

export class Position {
    line: number = 0;
    column: number = 0;
}


export class Grid {
    [key: number]: number;
    private _column: number;
    private _cells: Cells;

    static generate(row: number, column: number, minesCount: number): Grid {
        const length = row * column;
        let cells: Cells = [];
        for (let i = 0; i < length; i++) {
            const cell = minesCount > i ? Cell.withMine() : Cell.withoutMine();
            cells.push(cell);
        }

        let index = -1;
        while (++index < length) {
            const rand = index + Math.floor(Math.random() * (length - index));
            const cell = cells[rand];
            cells[rand] = cells[index];
            cells[index] = cell;
        }

        return new Grid(column, cells);
    }

    setMinesAround() {
        for (let i = 0; i < this._cells.length; i++) {
            if (this._cells[i].mine) {
                for (let area of this.cellArounds(i)) {
                    this._cells[area].surroundingMines++;
                }
            }
        }
        return this;
    }

    indexTo2d(targetedCell: number) {
        const pos = new Position();
        pos.line = Math.ceil((targetedCell) / this._column);
        pos.column = Math.ceil((targetedCell) % this._column);
        return pos
    }

    isPossible(position: Position): boolean {
        return position.line >= 0
            && position.line < this._cells.length / this._column
            && position.column >= 0
            && position.column < this._column
    }

    index2dTo1d(pos: Position): number {
        return pos.line * pos.column + pos.line
    }

    cellArounds(
        targetedCell: number
    ): number[] {
        // position of the pointer around a case. It records the number of step to reach a neighbor case.
        const coordinate: Array<number> = [-1, -10];
        let cellsAround: number[] = [];
        // Stocking possible neighbor cells with a for loop around the targeted cell.
        for (let positionCells = 0; positionCells < 8; positionCells++) {
            // Beginning middle left if it is possible.
            let isPair = positionCells % 2 === 0;
           // targetedCell * this._column + column
            if (isPair) {
                if (this.isPossible(this.indexTo2d(targetedCell + coordinate[0]))) {
                    cellsAround.push(targetedCell + coordinate[0]);
                }
            } else {
                if (
                    this.isPossible(this.indexTo2d(targetedCell + coordinate[0])) &&
                    this.isPossible(this.indexTo2d(targetedCell + coordinate[1]))
                ) {
                    cellsAround.push(
                        targetedCell + (coordinate[0] + coordinate[1])
                    );
                }
                coordinate.push(-coordinate[0]);
                coordinate.shift();
            }
        }
        return cellsAround;
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

    sendActionToCell(targetedCell: number, action: CellAction): Grid {
        const cells = [...this._cells];
        const cell = cells[targetedCell];
        cells[targetedCell] = cell[action]();
        if (!cell.surroundingMines && action != 'flag') {
            this.cellArounds(targetedCell).map(index => {
                    const c = cells[index];
                    if (!c.mine) {
                        cells[index] = c[action]();
                    }
            });
        }
        return new Grid(this._column, cells);
    }

    get column() {
        return this._column;
    }

}
