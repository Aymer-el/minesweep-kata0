export type CellStatus = 'untouched' | 'flagged' | 'dug' | 'detonated';
export type CellAction = 'dig' | 'flag';

export class Cell {
    private _mine: boolean;
    private _flagged: boolean;
    private _dug: boolean;
    public surroundingMines: number = 0;

    static withMine(): Cell {
        return new Cell(true, false, false);
    }

    static withoutMine(): Cell {
        return new Cell(false, false, false);
    }

    constructor(withMine: boolean, flagged: boolean, dug: boolean) {
        this._mine = withMine;
        this._flagged = flagged;
        this._dug = dug;
    }

    flag(): Cell {
        if (this._dug === true) {
            throw new Error('This cell has already been dug');
        }
        return new Cell(this._mine, !this._flagged, this._dug);
    }

    dig(): Cell {
        return new Cell(this._mine, false, true);
    }

    get detonated(): boolean {
        return this._mine && this.dug;
    }

    get mine(): boolean {
        return this._mine;
    }

    get flagged(): boolean {
        return this._flagged;
    }

    get dug(): boolean {
        return this._dug;
    }

    get status(): CellStatus {
        if (this.detonated) {
            return 'detonated';
        }
        if (this.dug) {
            return 'dug';
        }
        if (this.flagged) {
            return 'flagged';
        }
        return 'untouched';
    }
}
