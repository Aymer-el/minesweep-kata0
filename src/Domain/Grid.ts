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

        for (let i = 0; i < cells.length; i++) {
            /*
              Both Algorithm: are having the same goal: adding surrounding mines. You can comment on on off.

              if (cells[i].mine) {
                  // 0 à 9
                  let topPossible: number = i >= column ? 1 : 0;
                  // 90
                  let bottomPossible: number = i < cells.length - column ? 1 : 0;
                  // 15 % 10 = 5 parcontre 10 % 10 = 0
                  let leftPossible: number = i % column !== 0 ? 1 : 0;
                  // 19 + 1 % 5)
                  let rightPossible: number = (i + 1) % column !== 0 ? 1 : 0;
                  // map => [haut, milieu, droit]
                  if (topPossible && leftPossible) cells[i - column - 1].surroundingMines++;
                  if (topPossible) cells[i - column].surroundingMines++;
                  if (topPossible && rightPossible) cells[i - column + 1].surroundingMines++;
                  if (leftPossible) cells[i - 1].surroundingMines++;
                  if (rightPossible) cells[i + 1].surroundingMines++;
                  if (bottomPossible && leftPossible) cells[i + column - 1].surroundingMines++;
                  if (bottomPossible) cells[i + column].surroundingMines++;
                  if (bottomPossible && rightPossible) cells[i + column + 1].surroundingMines++;
              }
          */

            /*
              Both Algorithm: are having the same goal: adding surrounding mines. You can comment on on off.
          */
            if (cells[i].mine) {
                for (let cellIndex of Grid.cellArounds(column, cells, i)) {
                    cells[cellIndex].surroundingMines++;
                }
            }
        }

        return new Grid(column, cells);
    }

    static cellArounds(
        column: number,
        cells: Array<Cell>,
        targetedCell: number
    ): Array<number> {
        // Whether the neighboor cells exist: left, top, right, bottom.
        let top = targetedCell >= column;
        let bottom = !top || targetedCell < cells.length - column;
        let left = targetedCell % column !== 0;
        let right = !left || (targetedCell + 1) % column !== 0;
        const possibleSide = [left, top, right, bottom, left];
        const coordinate: Array<number> = [-1, -10];
        const cellsAround: Array<number> = [];
        // coordinates of neighboor cells around the targeted cell.
        let positionSide = -1;
        // Stocking possible neighboor cells with a for loop around the targeted cell.
        for (let positionCells = 0; positionCells < 8; positionCells++) {
            // Beginning middle left if it is possible.
            let isPair = positionCells % 2 === 0;
            // moving in the truthTab (left, top, right, bottom)
            if (isPair) {
                positionSide++;
                if(possibleSide[positionSide]){ cellsAround.push(targetedCell + coordinate[0]) }
                if (possibleSide[positionSide] && possibleSide[positionSide + 1]) {
                    cellsAround.push(
                        targetedCell + (coordinate[0] + coordinate[1]))
                }
            } else {
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

    sendActionToCell(cellIndex: number, action: CellAction): Grid {
        const cells = [...this._cells];
        const cell = cells[cellIndex];
        cells[cellIndex] = cell[action]();
        this.digAllZero(cellIndex).map(index => {
            const c = cells[index];
            if (c && !c.mine) {
                cells[index] = c[action]();
            }
        });

        return new Grid(this._column, cells);
    }

    get column() {
        return this._column;
    }

    digAllZero(index: number): Array<number> {
        return Grid.cellArounds(this._column, this._cells, index);
    }
}
