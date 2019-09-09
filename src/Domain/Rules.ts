import { Grid } from './Grid';

export const isDefeated = (grid: Grid) => {
    for (let cell of grid) {
        if (cell.detonated === true) return true;
    }
    return false;
};

export const isVictorious = (grid: Grid) => {
    for (let cell of grid) {
        // S'il reste des cases à creusées
        // Si une bombe a explosé
        if (
            (cell.dug === false && cell.bomb === false) ||
            cell.detonated === true
        ) {
            return false;
        }
    }
    return true;
};
