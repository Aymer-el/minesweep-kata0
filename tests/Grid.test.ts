import { Grid } from '../src/Domain/Grid';
import { Cell } from '../src/Domain/Cell';

describe(Grid, () => {
    test('it needs to be filled', () => {
        expect(() => new Grid(2, [])).toThrowError(RangeError);
    });

    describe('getByCoordinate', () => {
        test('it get the first cell in grid when asking for x:0 y:0', () => {
            const expected = Cell.withMine();
            const unexpected = Cell.withoutMine();
            const grid = new Grid(5, [
                expected,
                unexpected,
                unexpected,
                unexpected,
                unexpected,
            ]);

            expect(grid.cellByCoodinates(0, 0)).toBe(expected);
        });

        test('it get the last cell in grid when asking for x:3 y:1', () => {
            const expected = Cell.withMine();
            const unexpected = Cell.withoutMine();
            const grid = new Grid(4, [
                unexpected,
                unexpected,
                unexpected,
                unexpected,
                unexpected,
                unexpected,
                unexpected,
                expected,
            ]);

            const cell = grid.cellByCoodinates(3, 1);
            expect(cell).toBe(expected);
        });
    });

    describe('generator', () => {
        const row = 10;
        const column = row;
        const iterator = Array.from(Array(row * column));

        test('it create a grid with cells', () => {
            const grid = Grid.generate(row, column, 0).setMinesAround();
            iterator.forEach((_, index) => {
                expect(grid.cellByIndex(index)).toBeDefined();
            });
        });

        test('it create a grid without any mines', () => {
            const grid = Grid.generate(row, column, 0).setMinesAround();
            iterator.forEach((_, index) => {
                const cell = grid.cellByIndex(index);
                if (cell) {
                    const dugCell = cell.dig();
                    expect(dugCell.detonated).toBe(false);
                }
            });
        });

        test('it create a grid full of mines', () => {
            const grid = Grid.generate(row, column, row * column).setMinesAround();
            iterator.forEach((_, index) => {
                const cell = grid.cellByIndex(index);
                if (cell) {
                    const trappedDugCell = cell.dig();
                    expect(trappedDugCell.detonated).toBe(true);
                }
            });
        });

        test('it create a grid with 10 mines out of 100 cells', () => {
            const grid = Grid.generate(row, column, 10).setMinesAround();
            const mineCount = iterator.reduce((count, _, index) => {
                const cell = grid.cellByIndex(index);
                if (cell === undefined) return count;

                const dugCell = cell.dig();
                return dugCell.detonated === true ? count + 1 : count;
            }, 0);

            expect(mineCount).toBe(10);
        });
    });

    describe('checks the total of surrounding mines (ab: totalSurroundingMines)', () => {
        const row: number = 10;
        const column: number = 10;
        const iterator = Array.from(Array(row * column));
        const grid = Grid.generate(row, column, 10).setMinesAround();
        function checkAroundsAMine(
            _: any,
            i: number,
            totalSurroundingMines: number
        ) {
            let countMine: number = 0;
            const currentCase = grid.cellByIndex(i);
            if (
                currentCase &&
                currentCase.surroundingMines === totalSurroundingMines &&
                !currentCase.mine
            ) {
                // 0 à 9
                let topPossible: number = i >= column ? 1 : 0;
                // 90
                let bottomPossible: number = i < column * row - column ? 1 : 0;
                // 15 % 10 = 5 parcontre 10 % 10 = 0
                let leftPossible: number = i % column !== 0 ? 1 : 0;
                // 19 + 1 % 5)
                let rightPossible: number = (i + 1) % column !== 0 ? 1 : 0;
                // map => [haut, milieu, droit]

                /*
                console.log('-------------')
                console.log(currentCase, i);

                if(topPossible && cell && +cell.mine) {
                  console.log(cell, (i - column))
                }
                */

                // top left
                let cell = grid.cellByIndex(i - column - 1);
                if (topPossible && leftPossible && cell)
                    countMine += +cell.mine;
                // top
                cell = grid.cellByIndex(i - column);
                if (topPossible && cell) countMine += +cell.mine;
                // top right
                cell = grid.cellByIndex(i - column + 1);
                if (topPossible && rightPossible && cell)
                    countMine += +cell.mine;
                // left
                cell = grid.cellByIndex(i - 1);
                if (leftPossible && cell) countMine += +cell.mine;
                // right
                cell = grid.cellByIndex(i + 1);
                if (rightPossible && cell) countMine += +cell.mine;
                // bottom right
                cell = grid.cellByIndex(i + column + 1);
                if (bottomPossible && rightPossible && cell)
                    countMine += +cell.mine;
                // bottom
                cell = grid.cellByIndex(i + column);
                if (bottomPossible && cell) countMine += +cell.mine;
                // bottom left
                cell = grid.cellByIndex(i + column - 1);
                if (bottomPossible && leftPossible && cell)
                    countMine += +cell.mine;

                expect(countMine).toBe(totalSurroundingMines);
            }
        }
        //const iterator = Array.from(Array(row * column));

        // expNumber expected number of surrounding Mines
        test('expected number of surrounding mines', () => {
            for (let expectMines = 0; expectMines < 8; expectMines++) {
                iterator.forEach((_: any, i: number) =>
                    checkAroundsAMine(_, i, expectMines)
                );
            }
        });
    });
});
