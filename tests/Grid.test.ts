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

            expect(grid.cellByCoordinates(0, 0)).toBe(expected);
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

            const cell = grid.cellByCoordinates(3, 1);
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
            const minesCount = iterator.reduce((count, _, index) => {
                const cell = grid.cellByIndex(index);
                if (cell === undefined) return count;

                const dugCell = cell.dig();
                return dugCell.detonated ? count + 1 : count;
            }, 0);

            expect(minesCount).toBe(10);
        });
    });

    describe('checks if the number indicated is equals to the' +
        ' real total of surrounding mines', () => {
        const row: number = 5;
        const column: number = 5;
        const iterator = Array.from(Array(row * column));
        const grid = Grid.generate(row, column, 10).setMinesAround();
        test('expected number of surrounding mines', () => {
                iterator.forEach((_: any, i: number) => {
                    const cellsWithMines = grid.getNeighborCells(i).map((cell) =>
                        grid.cellByIndex(cell)).filter((cell) =>
                        cell && cell.mine
                    );
                    let minesCount: number = 0;
                    if(cellsWithMines) for(const cell of cellsWithMines) {
                        minesCount++
                    }
                    const cell = grid.cellByIndex(i);
                    if(cell) {
                        expect(minesCount).toBe(cell.surroundingMines);
                    }
                })
        })
    }
)}
);
