import { Cell, CellAction } from './Cell';

export type Cells = Array<Cell>;

export class Position {
    static line: number = 0;
    static column: number = 0;
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
                for (let area of this.cellArounds(this._column, this._cells, i)) {
                    for (let cellIdex of area) {
                        this._cells[cellIdex].surroundingMines++;
                    }
                }
            }
        }
        return this;
    }

    possibleSide(targetedCell: number): Array<boolean> {
        // Whether the neighboor cells exist: left, top, right, bottom.
        let top = targetedCell >= this._column;
        let bottom = !top || targetedCell < this._cells.length - this._column;
        let left = targetedCell % this._column !== 0;
        let right = !left || (targetedCell + 1) % this._column !== 0;
        return [left, top, right, bottom, left];
    }

    indexTo2d(targetedCell: number) {
        Position.line = (targetedCell + 1 / this._column);
        Position.column = (targetedCell +1) % this._column;
    }

    index2dTo1d(first: number, second: number): number {
        return Position.line * Position.column + Position.line
    }

    cellArounds(
        column: number,
        cells: Array<Cell>,
        targetedCell: number
    ): number[][] {
        // Whether the neighboor cells exist: left, top, right, bottom.
    /*    let top = targetedCell >= column;
        let bottom = !top || targetedCell < cells.length - column;
        let left = targetedCell % column !== 0;
        let right = !left || (targetedCell + 1) % column !== 0;*/
        const possibleSide = this.possibleSide(targetedCell);
        const coordinate: Array<number> = [-1, -10];
        let cellsAround: number[][] = [];
        // coordinates of neighboor cells around the targeted cell.
        let positionSide = -1;
        // Stocking possible neighboor cells with a for loop around the targeted cell.
        for (let positionCells = 0; positionCells < 8; positionCells++) {
            // Beginning middle left if it is possible.
            let isPair = positionCells % 2 === 0;
           // targetedCell * this._column + column
            if (isPair) {
                positionSide++;
                if (possibleSide[positionSide]) {
                    cellsAround.push([targetedCell + coordinate[0]]);
                }
            } else {
                if (
                    possibleSide[positionSide] &&
                    possibleSide[positionSide + 1]
                ) {
                    cellsAround.push([
                        targetedCell + (coordinate[0] + coordinate[1])
                    ]);
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
            this.cellArounds(this._column, cells, targetedCell).map(areas => {
                areas.map((index) => {
                    const c = cells[index];
                    if (!c.mine) {
                        cells[index] = c[action]();
                    }
                })
                console.log(areas)
            });
        }
        return new Grid(this._column, cells);
    }

    get column() {
        return this._column;
    }

}
