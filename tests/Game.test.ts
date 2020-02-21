import { isDefeated, isVictorious } from '../src/Domain/Rules';
import { Cell } from '../src/Domain/Cell';
import { Grid } from '../src/Domain/Grid';

describe('Rules', () => {
    test('a new game is neither lost or won', () => {
        // La grandeur d'un démineur doit être au minimum de 2
        // car sinon il n'y pas de jeu.
        let grid = Grid.generate(2, 1, 0);
        expect(isDefeated(grid)).toBe(false);
        expect(isVictorious(grid)).toBe(false);

        grid = Grid.generate(1, 2, 0);
        expect(isDefeated(grid)).toBe(false);
        expect(isVictorious(grid)).toBe(false);
    });

    test('a game is lost if a cell with a mine has been dug', () => {
        const cellWithMine = Cell.withMine();
        const cellWithoutMine = Cell.withoutMine();
        const grid = new Grid(1, [cellWithMine, cellWithoutMine]);

        expect(isDefeated(grid)).toBe(false);
        expect(isVictorious(grid)).toBe(false);

        let gridDetonated = grid.sendActionToCell(0, 'dig');
        let newCellWithMine = gridDetonated.cellByIndex(0);
        if (!newCellWithMine) {
            newCellWithMine = new Cell(true, false, false);
        }
        expect(newCellWithMine.dug).toBe(true);
        expect(newCellWithMine.status).toBe('detonated');
        expect(isDefeated(gridDetonated)).toBe(true);
        expect(isVictorious(gridDetonated)).toBe(false);
    });

    test('a game is won if every cell without mine has been dug', () => {
        const cellWithMine = Cell.withMine();
        const cellWithoutMine = Cell.withoutMine();
        const grid = new Grid(1, [cellWithMine, cellWithoutMine]);

        expect(isDefeated(grid)).toBe(false);
        expect(isVictorious(grid)).toBe(false);

        const gridDug = grid.sendActionToCell(1, 'dig');

        expect(isDefeated(gridDug)).toBe(false);
        expect(isVictorious(gridDug)).toBe(true);
    });
});
