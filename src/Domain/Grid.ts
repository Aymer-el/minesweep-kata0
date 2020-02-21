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
                for (let cellIndex of Grid.cellArounds(column, cells, i, 8)) {
                    cells[cellIndex].surroundingMines++;
                }
            }
        }

        return new Grid(column, cells);
    }

    static cellArounds(
        column: number,
        cells: Array<Cell>,
        i: number,
        totalposition: number,
        forceNotTab: Array<boolean> = []
    ): Array<number> {
        let top = forceNotTab[0] ? false : i >= column;
        let bottom = forceNotTab[1] ? false : !top || i < cells.length - column;
        let left = forceNotTab[2] ? false : i % column !== 0;
        let right = forceNotTab[3] ? false : !left || (i + 1) % column !== 0;
        // Whether the direction in the grid is ok: left, top, right, bottom.
        const truthTab = [left , top, right, bottom, left];
        // Cells to count or decount Around the current index (i).
        const coordinate: Array<number> = [-1, -10];
        // is two possible the two direction possible L largeur et l longueur ?
        let isPair: boolean = true;
        const arrayIndexes: Array<number> = [];
        // Mapping possible cells around the cell of the index, from 0 to totalposition.
        let position = 0;
        while (position < totalposition) {
            isPair = position % (totalposition / 4) === 0;
            if (
                isPair &&
                truthTab[Math.floor(position / (totalposition / 4))]
            ) {
                arrayIndexes.push(i + coordinate[0]);
            } else if (
                truthTab[Math.floor(position / (totalposition / 4))] &&
                truthTab[Math.floor((position + 1) / (totalposition / 4))]
            ){
                // moving on a direction (top left to top, top to topright etc...)
                for (let til = totalposition / 8; til > 0; til--){
                    arrayIndexes.push(i + (til * coordinate[0] + coordinate[1]));
                }
            }
            if (!isPair) {
                coordinate.push(-coordinate[0] * totalposition / 8);
                coordinate.shift();
            }
            position++;
        }
        position = 0;
        return arrayIndexes;

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
        this.digAllZero(cellIndex).map((index) => {
            const c = cells[index];
            if(!c.mine) {
                cells[index] = c[action]();
            }
        })

        return new Grid(this._column, cells);
    }

    get column() {
        return this._column;
    }

    digAllZero(index: number): Array<number> {
        return Grid.cellArounds(this._column, this._cells, index, 8, []);
    }
}
