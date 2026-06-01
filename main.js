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

    generateMines() {
        const used = new Set();
        const minesCount = Math.min(10, this.cells.length);

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
        this.findMines();

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
const counter = document.getElementById('count');

const cellContainer = document.getElementById('cells-list');

let count = 0;

function createGrid() {
    count = 0;
    backend.isfailed = false;

    const totalCells = parseInt(field_size.value);
    const gridSize = Math.round(Math.sqrt(totalCells));

    backend.clearCells();
    cellContainer.style.setProperty('--size', gridSize);
    backend.generateSoftField(parseInt(field_size.value))
    renderCells();
}

function renderCells() {
    counter.innerText = count;
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
                        button.innerText = '💥';
                        button.style.backgroundColor = 'red';
                        button.style.color = 'white';
                    }
                    else {
                        button.innerText = '🚩';
                        button.style.backgroundColor = 'lightgreen';
                        button.style.color = 'white';
                    }
                }
                else {
                    if (!allCells[i].isFlagged) {
                        button.innerText = '💣';
                        button.style.backgroundColor = 'orange';
                        button.style.color = 'white';
                    }
                    else {
                        button.innerText = '🚩';
                        button.style.backgroundColor = 'lightgreen';
                        button.style.color = 'white';
                    }
                }

            } else {
                button.innerText = allCells[i].value === 0 ? '' : allCells[i].value;
                button.style.backgroundColor = 'green';
                button.style.color = 'white';
            }
        }
        else {
            if (allCells[i].isFlagged) {
                button.innerText = '🚩';
                button.style.backgroundColor = 'yellow'
            }
            else {
                button.innerText = '';
                button.style.backgroundColor = '';
            }
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

    if (!backend.isfailed) {
        if (count === 0) {
            backend.generateNoMinesSpot(index);
            backend.generateMines();
        }

        backend.openCell(index);
        count++;
        renderCells();
    }
}

function clickToFlag(index) {
    if (!backend.isfailed) {
        backend.setFlag(index);
        renderCells();
    }
}

create_field.onclick = createGrid;