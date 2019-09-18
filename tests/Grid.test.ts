import { Grid } from '../src/Domain/Grid';
import { Cell } from '../src/Domain/Cell';

describe(Grid, () => {
    test('it needs to be filled', () => {
        expect(() => new Grid(2, [])).toThrowError(RangeError);
    });

    describe('getByCoordinate', () => {
        test('it get the first cell in grid when asking for x:0 y:0', () => {
            const expected = Cell.withBomb();
            const unexpected = Cell.withoutBomb();
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
            const expected = Cell.withBomb();
            const unexpected = Cell.withoutBomb();
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
            const grid = Grid.generate(row, column, 0);
            iterator.forEach((_, index) => {
                expect(grid.cellByIndex(index)).toBeDefined();
            });
        });

        test('it create a grid without any mines', () => {
            const grid = Grid.generate(row, column, 0);
            iterator.forEach((_, index) => {
                const cell = grid.cellByIndex(index);
                if (cell) {
                    const dugCell = cell.dig();
                    expect(dugCell.detonated).toBe(false);
                }
            });
        });

        test('it create a grid full of mines', () => {
            const grid = Grid.generate(row, column, row * column);
            iterator.forEach((_, index) => {
                const cell = grid.cellByIndex(index);
                if (cell) {
                    const trappedDugCell = cell.dig();
                    expect(trappedDugCell.detonated).toBe(true);
                }
            });
        });

        test('it create a grid with 10 mines out of 100 cells', () => {
            const grid = Grid.generate(row, column, 10);
            const mineCount = iterator.reduce((count, _, index) => {
                const cell = grid.cellByIndex(index);
                if (cell === undefined) return count;

                const dugCell = cell.dig();
                return dugCell.detonated === true ? count + 1 : count;
            }, 0);

            expect(mineCount).toBe(10);
        });

        /*
        * cells.splice(9, 1, Cell.withBomb());
        cells.splice(0, 1, Cell.withBomb());
        cells.splice(1, 1, Cell.withBomb());
        cells.splice(99, 1, Cell.withBomb());
        cells.splice(98, 1, Cell.withBomb());
        cells.splice(90, 1, Cell.withBomb());
        cells.splice(81, 1, Cell.withBomb());
        */
    });

    test('a game with a minimum 2 case board and 1 bomb, is having on an empty case the number 1', () => {
        const grid = Grid.generate(2, 1, 1);
        for (let cell of grid) {
            if (!cell.bomb) expect(cell.minesAround()).toBe(1);
        }
    });
    test('a game of 4 cases with two bombs on end board, is having on empty cases the number 1', () => {
        const cellWithBomb = Cell.withBomb();
        const cellWithoutBomb = Cell.withoutBomb();
        const grid = new Grid(1, [
            cellWithBomb,
            cellWithoutBomb,
            cellWithoutBomb,
            cellWithBomb,
        ]);
        grid.setNumberOfSurrondingMines();
        for (let cell of grid) {
            if (!cell.bomb) expect(cell.minesAround()).toBe(1);
        }
    });
    test('a game of 4 cases with two bombs in the middle of the board, is having on empty cases the number 1', () => {
        const cellWithBomb = Cell.withBomb();
        const cellWithoutBomb = Cell.withoutBomb();
        const grid = new Grid(1, [
            cellWithoutBomb,
            cellWithBomb,
            cellWithBomb,
            cellWithoutBomb,
        ]);
        grid.setNumberOfSurrondingMines();
        for (let cell of grid) {
            if (!cell.bomb) expect(cell.minesAround()).toBe(1);
        }
    });
    /*
    test('a game of 3 cases with two bombs on end board, is having on empty cases the number 2', () => {
        const cellWithBomb = Cell.withBomb();
        const cellWithoutBomb = Cell.withoutBomb();
        const grid = new Grid(1, [
            Cell.withBomb(),
            cellWithoutBomb,
            Cell.withBomb(),
        ]);
        grid.setNumberOfSurrondingMines();
        for (let cell of grid) {
            if (!cell.bomb) expect(cell.minesAround()).toBe(2);
            if (cell.bomb) expect(cell.minesAround()).toBe(1);
        }
    });
    */
    test('a game of 3 cases with one bomb in the middle of the board, is having on empty cases the number 1', () => {
        const cellWithBomb = Cell.withBomb();
        const cellWithoutBomb = Cell.withoutBomb();
        const grid = new Grid(1, [cellWithBomb, cellWithoutBomb, cellWithBomb]);
        grid.setNumberOfSurrondingMines();
        for (let cell of grid) {
            if (!cell.bomb) expect(cell.minesAround()).toBe(2);
        }
    });
    test('a game of 3 cases with one bomb in the middle of the board, is having on empty cases the number 1', () => {
        const cellWithBomb = Cell.withBomb();
        const cellWithoutBomb = Cell.withoutBomb();
        const grid = new Grid(1, [
            cellWithoutBomb,
            cellWithBomb,
            cellWithoutBomb,
        ]);
        console.log(grid);

        grid.setNumberOfSurrondingMines();
        for (let cell of grid) {
            if (!cell.bomb) expect(cell.minesAround()).toBe(1);
        }
    });
});
