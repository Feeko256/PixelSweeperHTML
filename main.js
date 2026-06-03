class CellModel {
    constructor(isMine, isOpened, isDetonaited, isFirstCell, isFlagged, value, xPos, yPos) {
        this.isMine = isMine;
        this.isOpened = isOpened;
        this.isDetonaited = isDetonaited;
        this.isFirstCell = isFirstCell;
        this.isFlagged = isFlagged;
        this.value = value;
        this.xPos = xPos;
        this.yPos = yPos;
    }
}

class SweeperBackend {
    constructor() {
        this.cells = [];
        this.isfailed = false;
        this.win = false;
        this.oppendNoMines = 0;
        this.totalOppend = 0;
        this.minesCount = 0;
        this.minesFlagged = 0;
    }

    generateSoftField(size) {
        const gridSize = Math.sqrt(size);

        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const emptyCell = new CellModel(false, false, false, false, false, 0, i, j);
                this.cells.push(emptyCell);
            }
        }
    }

    getCells() {
        return this.cells;
    }

    clearCells() {
        this.cells = [];
    }

    generateNoMinesSpot(index) {
        this.cells[index].isFirstCell = true;
    }

    generateMines(mines) {
        const used = new Set();
        const minesCount = Math.min(mines.value, this.cells.length - 1);
        this.minesCount = minesCount;

        while (used.size < minesCount) {
            const index = Math.floor(Math.random() * this.cells.length);

            if (this.cells[index].isFirstCell) {
                continue;
            }

            used.add(index);
        }

        used.forEach(index => {
            this.cells[index].isMine = true;
        });
    }

    openCell(index) {
        switch (this.cells[index].isMine) {
            case true: {
                this.isfailed = true;
                this.cells.forEach((cell, idx) => {
                    if (cell.isMine) {
                        cell.isOpened = true;
                        cell.isDetonaited = (idx === index);
                    }
                });
                break;
            }
            case false: {
                this.openFreeCells(index);
                if (this.oppendNoMines === (this.cells.length - this.minesCount)) {
                    this.win = true;
                }
                break;
            }
        }
    }

    findMines() {
        this.cells.forEach(cell => {
            let counter = 0;
            if (!cell.isMine) {
                let x = cell.xPos;
                let y = cell.yPos;

                let dx = [-1, 0, 1];
                let dy = [-1, 0, 1];

                dx.forEach(_dx => {
                    dy.forEach(_dy => {
                        if (_dx === 0 && _dy === 0) return;

                        const neighbor = this.cells.find(c => c.xPos === x + _dx && c.yPos === y + _dy);
                        if (neighbor && neighbor.isMine)
                            counter++;
                    });

                });
                cell.value = counter;
            }
        });
    }

    openFreeCells(index) {
        const cell = this.cells[index];
        if (cell.isOpened || cell.isMine) return;
        cell.isOpened = true;
        this.oppendNoMines++;
        this.totalOppend++;

        if (cell.value != 0) return;


        let x = cell.xPos;
        let y = cell.yPos;

        let dx = [-1, 0, 1];
        let dy = [-1, 0, 1];

        dx.forEach(_dx => {
            dy.forEach(_dy => {
                if (_dx === 0 && _dy === 0) return;

                const neighborIndex = this.cells.findIndex(c => c.xPos === x + _dx && c.yPos === y + _dy);

                if (neighborIndex !== -1) {
                    const neighbor = this.cells[neighborIndex];

                    if (!neighbor.isMine && !neighbor.isOpened) {
                        this.openFreeCells(neighborIndex);
                    }
                }
            });

        });
    }

    setFlag(index) {
        const cell = this.cells[index];

        if (!cell.isOpened) {
            cell.isFlagged = !cell.isFlagged;
        }
    }

}


const backend = new SweeperBackend();

const create_field = document.getElementById('create-grid-btn');
const generate_mines = document.getElementById('generate-mines');

const field_size = document.getElementById('field-size');
const mines_count = document.getElementById('mines-count');
const counter = document.getElementById('click-counter');
const win_info = document.getElementById('win-info');
const timer_label = document.getElementById('timer');

const cellContainer = document.getElementById('cells-list');

let seconds = 0;
let timer = null;

function createGrid() {
    backend.isfailed = false;
    backend.win = false;
    backend.oppendNoMines = 0;
    backend.totalOppend = 0;
    win_info.innerText = 'Состояние: игра';

    const totalCells = parseInt(field_size.value);
    const gridSize = Math.round(Math.sqrt(totalCells));

    backend.clearCells();
    cellContainer.style.setProperty('--size', gridSize);
    backend.generateSoftField(parseInt(field_size.value))
    renderCells();
}

function renderCells() {
    counter.innerText = `Открыто ячеек: ${backend.totalOppend}`;;
    const allCells = backend.getCells();

    cellContainer.innerHTML = '';

    for (let i = 0; i < allCells.length; i++) {
        const button = document.createElement('button');
        button.classList.add('cell-btn');

        if (allCells[i].isOpened) {
            button.disabled = true;

            if (allCells[i].isMine) {
                if (allCells[i].isDetonaited) {

                    if (!allCells[i].isFlagged) {

                        button.classList.add('cell-btn-open-bomb-detonaited');
                        button.innerText = '💥';

                    }
                    else {
                        button.classList.add('cell-btn-open-bomb-flagged');
                        button.innerText = '🚩';
                    }
                }
                else {
                    if (!allCells[i].isFlagged) {
                        button.classList.add('cell-btn-open-bomb');
                        button.innerText = '💣';
                    }
                    else {
                        button.classList.add('cell-btn-open-bomb-flagged');
                        button.innerText = '🚩';
                    }
                }

            } else {
                button.classList.add('cell-btn-open-clear');
                button.innerText = allCells[i].value === 0 ? '' : allCells[i].value;
            }
        }
        else {
            if (backend.win && allCells[i].isMine && !allCells[i].isFlagged) {
                button.classList.add('cell-btn-open-bomb-flagged');
                button.innerText = '💣';

            }
            else if (allCells[i].isFlagged) {
                if (backend.win) {
                    button.classList.add('cell-btn-open-bomb-flagged');
                } else {
                    button.classList.add('cell-btn-open-flagged');
                }
                button.innerText = '🚩';
            }
            else {
                button.innerText = '';
                button.style.backgroundColor = '';
            }


        }

        if (backend.win) {
            win_info.innerText = 'Состояние: Победа';
            stopTimer();
        }
        if (backend.isfailed) {
            win_info.innerText = 'Состояние: Проиграл';
            stopTimer();
        }

        button.onclick = () => clickOnCell(i);
        button.oncontextmenu = (event) => {
            event.preventDefault();
            clickToFlag(i)
        }

        cellContainer.appendChild(button)
    }
}

function clickOnCell(index) {

    if (!backend.isfailed && !backend.getCells()[index].isFlagged && !backend.getCells()[index].isOpened && backend.win === false) {
        if (backend.totalOppend === 0) {
            resetTimer();
            backend.generateNoMinesSpot(index);
            backend.generateMines(mines_count);
            backend.findMines();
            startTimer();
        }

        backend.openCell(index);
        renderCells();
    }
}

function clickToFlag(index) {
    if (!backend.isfailed && !backend.win) {
        backend.setFlag(index);
        renderCells();
    }
}

function startTimer() {
    if (!timer) {
        timer = setInterval(() => {
            seconds++;
            timer_label.innerText = `Время: ${seconds} сек.`;
        }, 1000)
    }
}

function stopTimer() {
    clearInterval(timer);
    timer = null;
}

function resetTimer() {
    stopTimer();
    seconds = 0;
    timer_label.innerText = `Время: ${seconds} сек.`;
}

create_field.onclick = createGrid;