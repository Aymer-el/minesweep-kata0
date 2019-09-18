export type CellStatus = 'untouched' | 'flagged' | 'dug' | 'detonated';
export type CellAction = 'dig' | 'flag';

export class Cell {
    private _bomb: boolean;
    private _flagged: boolean;
    private _dug: boolean;
    private _minesAround: number = 0;

    static withBomb(): Cell {
        const cell = new Cell(true, false, false);
        cell.incMinesAround();
        return cell;
    }

    static withoutBomb(): Cell {
        return new Cell(false, false, false);
    }

    constructor(withBomb: boolean, flagged: boolean, dug: boolean) {
        this._bomb = withBomb;
        this._flagged = flagged;
        this._dug = dug;
    }

    flag(): Cell {
        if (this._dug === true) {
            throw new Error('This cell has already been dug');
        }
        return new Cell(this._bomb, !this._flagged, this._dug);
    }

    dig(): Cell {
        return new Cell(this._bomb, false, true);
    }

    get detonated(): boolean {
        return this._bomb && this.dug;
    }

    get bomb(): boolean {
        if (!this.minesAround() && this._bomb) {
            this.incMinesAround();
        }
        return this._bomb;
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

    incMinesAround(): number {
        this._minesAround += 1;
        return this._minesAround;
    }

    minesAround(): number {
        return this._minesAround;
    }

    addMinesAround(incNumber: number): number {
        this._minesAround = incNumber;
        return this._minesAround;
    }
}
