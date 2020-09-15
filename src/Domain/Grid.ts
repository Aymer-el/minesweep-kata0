import { Cell, CellAction } from './Cell';

export type Cells = Array<Cell>;

export class Position {
    public line: number;
    public column: number;

    constructor(cell: number, column: number){
        this.line = Math.floor(cell / column);
        this.column = Math.floor(cell % column);
    }
}

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
                this.getNeighborCells(i).map((area: number) =>  {
                        this._cells[area].surroundingMines++;
                    })
            }
        }
        return this;
    }


    findingCell(i: number, j:number, refCellNumber: number): number {
        return (j * this._column) + i + refCellNumber
    }

    isPossible(isPossibleCell: Position, refCell: Position): boolean {
        return isPossibleCell.line >= 0
            && isPossibleCell.line < (this._cells.length / this._column)
            && isPossibleCell.column >= 0
            && isPossibleCell.column < this._column
            && isPossibleCell.line >= refCell.line - 1
            && isPossibleCell.line <= refCell.line + 1
            && isPossibleCell.column <= refCell.column + 1
            && isPossibleCell.column >= refCell.column - 1
    }

    getNeighborCells(
        refCellNumber: number
    ): number[] {
        let cellsAround: number[] = [];
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if(this.isPossible(
                    new Position(this.findingCell(i, j, refCellNumber), this._column),
                    new Position(refCellNumber, this._column)
                ))
                cellsAround.push(this.findingCell(i, j,refCellNumber))
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
            const areas = this.getNeighborCells(targetedCell);
            console.log(areas)
            // while areas
            for(let area of areas) {
                    const c = cells[area];
                    if (c && !c.mine) {
                        cells[area] = c[action]();
                    }
            }
        }
        return new Grid(this._column, cells);
    }

    get column() {
        return this._column;
    }

}
