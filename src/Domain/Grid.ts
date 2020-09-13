import { Cell, CellAction } from './Cell';

export type Cells = Array<Cell>;

export const SetUp = {
    row: 10,
    column: 10,
    minesCount: 10
};

export class Grid {
    [key: number]: number;
    private readonly _column: number;
    private readonly _cells: Cells;

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
                this.getNeighborCells(1, i).map((area) =>  {
                    area.map((index) => {
                        if(this._cells[index]) this._cells[index].surroundingMines++;
                    })
                })
            }
        }
        return this;
    }


    findingCell(i: number, j:number): number {
        return (j * this._column) + i
    }

    getNeighborCells(
        beginning: number,
        refCellNumber: number
    ): number[][] {
        let cellsAround: number[] = [];
        for (let j = -1; j <= 1; j++) {
            for (let i = -1; i <= 1; i++) {
                cellsAround.push(this.findingCell(i, j) +refCellNumber)
            }
        }
        return [cellsAround];

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
      //  thisArg?: any
    ) {
        return this._cells.map(callbackfn);
    }

    cellByIndex(index: number): Cell | undefined {
        return this._cells[index];
    }

    cellByCoordinates(x: number, y: number): Cell | undefined {
        return this._cells[this._column * y + x];
    }

    sendActionToCell(targetedCell: number, action: CellAction): Grid {
        const cells = [...this._cells];
        const cell = cells[targetedCell];
        cells[targetedCell] = cell[action]();
        if (!cell.surroundingMines && action != 'flag') {
            // @ts-ignore
            const areas = this.getNeighborCells(1, targetedCell);
            // while areas
            for(let area of areas) {
                for (let index of area) {
                    const c = cells[index];
                    if (c && !c.mine) {
                        cells[index] = c[action]();
                    }
                }
            }
        }
        return new Grid(this._column, cells);
    }

    get column() {
        return this._column;
    }

}
