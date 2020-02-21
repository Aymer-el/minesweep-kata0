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
            if(cells[i].mine) {
              // 0 à 9
              let isTopOK = (i >= column) ? 1 : 0;
              // 90
              let isBottomOK = (!isTopOK ? 1 : i < cells.length - column) ? 1 : 0;
              // 15 % 10 = 5 parcontre 10 % 10 = 0
              let isLeftOK = (i % column !== 0) ? 1 : 0;
              // 19 + 1 % 5)
              let isRightOK = (!isLeftOK ? 1 : (i + 1) % column !== 0) ? 1 : 0;
              // Mapping possible cells around the cell of the index, from 0 to 8.
              let position = 0;
              // Whether the direction in the grid is ok: left, top, right, bottom.
              const truthTab: Array<number> = [isLeftOK, isTopOK, isRightOK, isBottomOK, isLeftOK];
              // Cells to count or decount Around the current index (i).
              const coordinate: Array<number> = [-1, -10];
              // is two possible the two direction possible L largeur et l longueur ?
              let isPair: boolean = true;
              while (position < 8) {
                isPair = position % 2 === 0;
                if(isPair) {
                  cells[i + coordinate[0] * truthTab[Math.floor(position/2)]].surroundingMines++;
                } else {
                  cells[i + (coordinate[0] + coordinate[1]) *
                    (truthTab[Math.floor(position/2)] * truthTab[Math.floor((position +1)/2)])
                  ].surroundingMines++;
                  coordinate.push(-coordinate[0]);
                  coordinate.shift();
                }
                position++;
              }
              position = 0;
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

    digAllZero() {


    }
}
