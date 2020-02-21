import { Cell } from '../src/Domain/Cell';

describe(Cell, () => {
    describe('without a mine', () => {
        const cell = Cell.withoutMine();

        test('does not explodes if untouched', () => {
            expect(cell.detonated).toBe(false);
        });

        test('can be flagged and still not explose', () => {
            cell.flag();
            expect(cell.detonated).toBe(false);
        });

        test('does not explode even when you dig it (there is no mine)', () => {
            cell.dig();
            expect(cell.detonated).toBe(false);
        });

        test("can't be flagged if it has been dug", () => {
            const dugCell = cell.dig();

            expect(() => {
                dugCell.flag();
            }).toThrowError();
        });
    });

    describe('with a mine', () => {
        const trappedCell = Cell.withMine();

        test('does not explodes if untouched', () => {
            expect(trappedCell.detonated).toBe(false);
        });

        test('can be flagged and still not explose', () => {
            const flaggedTrappedCell = trappedCell.flag();
            expect(flaggedTrappedCell.detonated).toBe(false);
            expect(flaggedTrappedCell.flagged).toBe(true);
        });

        test('blows player face when he dig this cell', () => {
            const dugTrappedCell = trappedCell.dig();
            expect(dugTrappedCell.detonated).toBe(true);
        });
    });
});
