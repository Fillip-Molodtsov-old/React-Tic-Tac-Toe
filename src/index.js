import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


class Square extends React.Component {

    render() {
        return (
            <button
                className={this.props.isWinningSquare ? 'square win-square' : 'square'}
                onClick={
                    () => this.props.onClick()
                }>

                {this.props.value}
            </button>
        );
    }
}

class Board extends React.Component {
    renderSquare(i) {
        let isWinningSquare = false;
        if (this.props.winningLines) {
            isWinningSquare = this.props.winningLines.indexOf(i) !== -1;
        }

        return (
            <Square
                key={i}
                isWinningSquare={isWinningSquare}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                {
                    range(0, 3).map((_, idx) => {
                        return (
                            <div
                                className="board-row"
                                key={idx}
                            >
                                {
                                    range(0, 3).map((_1, idx1) => {
                                        return this.renderSquare(idx * 3 + idx1);
                                    })
                                }
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                index: null,
            }],
            stepNumber: 0,
            xIsNext: true,
            descendingOrderMoves: false,
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) return;
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares,
                index: i,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        })
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: this.isXNext(step),
        });
    }

    isXNext(step) {
        return (step % 2) === 0;
    }

    toggleSortMoves() {
        this.setState({
            descendingOrderMoves: !this.state.descendingOrderMoves,
        });
        this.render();
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        let draw = false;
        let winningLines = null;
        if (!winner) draw = current.squares.indexOf(null) === -1;
        else winningLines = getWinningLine(current.squares);
        const isDescendingSortMoves = this.state.descendingOrderMoves;

        const moves = history.map((step, moveIdx) => {
            const symbol = this.isXNext(moveIdx - 1) ? 'X' : 'O';
            const col = Math.floor(step.index / 3);
            const row = Math.floor(step.index % 3);
            const desc = moveIdx ?
                `Go to move # ${moveIdx} (${symbol} : col = ${col}; row= ${row} )`
                :
                'Go to game start';
            let descX = desc;
            if (moveIdx === history.length - 1) descX = <b>{desc}</b>;
            return (
                <li key={moveIdx}>
                    <button onClick={() => this.jumpTo(moveIdx)}>{descX}</button>
                </li>
            );
        });

        if (isDescendingSortMoves) moves.reverse();

        let status;
        if (winner) {
            status = `Winner: ${winner}`;

        } else {
            if (draw) {
                status = 'It\'s a draw';
            } else {
                status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
            }
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        winningLines={winningLines}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button onClick={() => this.toggleSortMoves()}>ascending</button>
                    <button onClick={() => this.toggleSortMoves()}>descending</button>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

function calculateWinner(squares) {

    for (let i = 0; i < lines.length; i++) {

        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

function getWinningLine(squares) {

    for (let i = 0; i < lines.length; i++) {

        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return lines[i];
        }
    }
    return null;
}

const range = (start, end) => Array.from({length: end}, (_, i) => start + i);

// ========================================

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);
