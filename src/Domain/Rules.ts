import { Grid } from './Grid';
import { Cell } from './Cell';

export const isDefeated = (grid: Grid) => {
    for (let cell of grid) {
        if (cell.detonated === true) return true;
    }
    return false;
};

export const isVictorious = (grid: Grid) => {
    for (let cell of grid) {
        // S'il reste des cases à creusées
        // Si une minee a explosé
        if (
            (cell.dug === false && cell.mine === false) ||
            cell.detonated === true
        ) {
            return false;
        }
    }
    return true;
};
