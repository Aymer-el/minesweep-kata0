import { isDefeated, isVictorious } from '../src/Domain/Rules';
import { Cell } from '../src/Domain/Cell';
import { Grid } from '../src/Domain/Grid';

describe('Rules', () => {
    test('a new game is neither lost or won', async () => {
        // La grandeur d'un démineur doit être au minimum de 2
        // car sinon il n'y pas de jeu.
        let grid = Grid.generate(10, 10, 10).setMinesAround();
        expect(isVictorious(grid)).toBe(false);

        grid = Grid.generate(10, 10, 10).setMinesAround();
        expect(isVictorious(grid)).toBe(false);
    });

    test('a game is lost if a cell with a mine has been dug', async () => {
        let grid = Grid.generate(10, 10, 10).setMinesAround();
        expect(isDefeated(grid)).toBe(false);
        expect(isVictorious(grid)).toBe(false);

        for (let i = 0; i < 100; i++){
            let cell = grid.cellByIndex(i)
            if(cell && cell.mine) {
                grid = grid.sendActionToCell(i, 'dig');
                cell = grid.cellByIndex(i);
                if(cell) {
                    expect(cell.dug).toBe(true);
                    expect(cell.status).toBe('detonated');
                }

            }
        }
        expect(isDefeated(grid)).toBe(true);
    });

    test('a game is won if every cell without mine has been dug', async () => {
        let grid = Grid.generate(10, 10, 10).setMinesAround();
        expect(isDefeated(grid)).toBe(false);
        expect(isVictorious(grid)).toBe(false);
        for (let i = 0; i < 100; i++){
            let cell = grid.cellByIndex(i)
            if(cell && !cell.mine) {
                grid = grid.sendActionToCell(i, 'dig');
                cell = grid.cellByIndex(i)
                if(cell) {
                    expect(cell.dug).toBe(true);
                    expect(cell.status).toBe('dug');
                }
            }
        }
        expect(isVictorious(grid)).toBe(true);
    });
});
