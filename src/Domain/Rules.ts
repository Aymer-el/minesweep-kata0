import { Grid } from './Grid';
import { Cell } from './Cell';

export const isDefeated = async (grid: Grid) => {
    let defeat: boolean = false;
    let i = 0;
    while (!defeat && grid.gridLength < i) {
        const cell = grid.cellByIndex(i);
        if (cell && cell.detonated) {
            defeat = true;
        }
        i++;
    }
    return defeat;
};

export const isVictorious = async (grid: Grid) => {
    let cellsInGame = grid
        .map((e: any) => (e.detonated || (!e.dug && !e.mine) ? null : e))
        .filter((cell: any) => {
            return cell != null;
        });

    /*const cellsInGame = []
for (let i = 0; i < grid.gridLength; i++){
    const cell = grid.cellByIndex(i);
    if(cell && !cell.detonated) {
        cellsInGame.push(grid.cellByIndex(i))
    }
}
console.log(cellsInGame.length)*/
    return cellsInGame.length === grid.gridLength;
};
