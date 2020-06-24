import { Grid } from './Grid';
import { Cell } from './Cell';

export const isDefeated = async (grid: Grid) => {
    return new Promise((resolve, reject) => {
        let answ = false;
        /*await grid.map((cell) => {
            if (cell.detonated && cell.mine) {
                resolve(true);
            }
        });*/
    });
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
