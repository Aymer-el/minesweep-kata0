import React from 'react';
import { CellStatus } from '../Domain/Cell';

type CellProps = {
    status: CellStatus;
    onclick: Function;
    isCellOddColor: boolean;
    surroundingMines: number;
};

const emojis = {
    untouched: '',
    dug: '',
    flagged: '🚩',
    detonated: '💥',
};

const setCellBackgroundColor = (
    status: CellStatus,
    isCellOddColor: boolean
) => {
    // impaire(odd) correspondant à la case (0, 0), pair(even) correspondant à la case (0, 1)
    // Condition valide si la case n'a pas été creusée
    if (status === 'untouched' || status === 'flagged') {
        if (isCellOddColor) {
            // Light green
            return '#a9d750';
        } else {
            // Dark green
            return '#a2d148';
        }
    } else {
        if (isCellOddColor) {
            // Light marron
            return '#e5c29e';
        } else {
            // Dark marron
            return '#d7b899';
        }
    }
};

const cellStyle = (
    status: CellStatus,
    isCellOddColor: boolean
): React.CSSProperties => ({
    width: '40px',
    height: '40px',
    textAlign: 'center',
    lineHeight: '40px',
    border: '1px solid black',
    boxSizing: 'border-box',
    cursor: 'pointer',
    backgroundColor: setCellBackgroundColor(status, isCellOddColor),
});

export const Cell: React.FunctionComponent<CellProps> = props => {
    return (
        <div
            onClick={ev => {
                ev.preventDefault();
                props.onclick(ev);
            }}
            onContextMenu={ev => {
                ev.preventDefault();
                props.onclick(ev);
            }}
            style={cellStyle(props.status, props.isCellOddColor)}
        >
            {emojis[props.status]}
            {props.status === 'dug' ? props.surroundingMines : ''}
            { props.surroundingMines}

        </div>
    );
};
