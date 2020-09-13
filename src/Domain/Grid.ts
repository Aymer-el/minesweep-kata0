import { Cell, CellAction } from './Cell';

export type Cells = Array<Cell>;

export class Position {
    line: number = 0;
    column: number = 0;
}

export const SetUp = {
    row: 10,
    column: 10,
    minesCount: 10
};

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
                console.log('mines at', i);
                this.getNeighborCells(1, i).map((index) =>  {
                    if(this._cells[index]) this._cells[index].surroundingMines++;
                })
            }
        }
        return this;
    }

    indexTo2d(targetedCell: number) {
        const pos = new Position();
        pos.line = targetedCell > 0 ? Math.floor((targetedCell / this._column)) : -1;
        pos.column = targetedCell > 0 ? Math.floor(targetedCell % this._column) : -1;
        return pos
    }

    isPossible(isPossibleCell: Position, refCell: Position): boolean {
        return isPossibleCell.line >= 0
            && isPossibleCell.line <= (this._cells.length / this._column)
            && isPossibleCell.line >=  (refCell.line ? (refCell.line - 1): 0)
            && isPossibleCell.column <= this._column
            && isPossibleCell.column <= (refCell.column ? (refCell.column + 1): 0)
            && isPossibleCell.column >= 0
    }
    /*
   let top = targetedCell >= this._column;
   let bottom = !top || targetedCell < this._cells.length - this._column;
   let left = targetedCell % this._column !== 0;
   let right = !left || (targetedCell + 1) % this._column !== 0;
    */

    index2dTo1d(pos: Position): number {
        return pos.line * pos.column + pos.line
    }

    getNeighborCells(
        beginning: number,
        refCellNumber: number
    ): number[] {
        let cellsAround: number[] = [];
        const refCell = this.indexTo2d(refCellNumber);
        // position of the pointer around a case. It records the number of step to reach a neighbor case.
        let coordinate: Array<number> = [-1,-SetUp.column];
        // Stocking possible neighbors' cells with a for loop around the targeted cell.//
        for (let i = 0; i < 2; i++) {
            // First loop from 0 à 3
            // Second loop from 4 to 7
            const isIPair = i % 2 === 0;
            if (isIPair) {
                coordinate = [-1, -SetUp.column]
            } else {
                coordinate = [-1, SetUp.column]
            }
            let targetedCell: number = refCellNumber;
            for(let j= -1; j < 3; j++) {
                // Beginning middle left if it is possible.
                let isJPair = j % 2 === 0;
                // targetedCell * this._column + column
                if (isJPair) {
                   targetedCell = refCellNumber + coordinate[0] + coordinate[1];
                } else {
                    targetedCell = refCellNumber + (coordinate[0])
                    coordinate.push(-coordinate[0]);
                    coordinate.shift();
                }
                if (this.isPossible(this.indexTo2d(targetedCell), refCell)) {
                    cellsAround.push(targetedCell);
                }
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
            // @ts-ignore
            const area = this.getNeighborCells(1, targetedCell);
            if(area) for(let index of area) {
                const c = cells[index];
                if (!c.mine) {
                    cells[index] = c[action]();
                }
            }
        }
        return new Grid(this._column, cells);
    }

    get column() {
        return this._column;
    }

}
