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
            const cell = minesCount > i ? Cell.withBomb() : Cell.withoutBomb();
            cells.push(cell);
        }

        let index = -1;
        while (++index < length) {
            const rand = index + Math.floor(Math.random() * (length - index));
            const cell = cells[rand];
            cells[rand] = cells[index];
            cells[index] = cell;
        }

        for (let i = 0; i < cells.length; i++) {
            if (cells[i].bomb) {
                // 0 à 9
                let topPossible: number = i >= column ? 1 : 0;
                // 90
                let bottomPossible: number = i < cells.length - column ? 1 : 0;
                // 15 % 10 = 5 parcontre 10 % 10 = 0
                let leftPossible: number = i % column !== 0 ? 1 : 0;
                // 19 + 1 % 5)
                let rightPossible: number = (i + 1) % column !== 0 ? 1 : 0;
                // map => [haut, milieu, droit]
                if (topPossible && leftPossible)
                    cells[i + column * -1 + -1].surrondingMines++;
                if (topPossible) cells[i + column * -1].surrondingMines++;
                if (topPossible && rightPossible)
                    cells[i + column * -1 + 1].surrondingMines++;
                if (leftPossible) cells[i - 1].surrondingMines++;
                if (rightPossible) cells[i + 1].surrondingMines++;
                if (bottomPossible && leftPossible)
                    cells[i + column * +1 - 1].surrondingMines++;
                if (bottomPossible) cells[i + column * +1].surrondingMines++;
                if (bottomPossible && rightPossible)
                    cells[i + column * 1 + 1].surrondingMines++;
            }
        }
        return new Grid(column, cells);
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
