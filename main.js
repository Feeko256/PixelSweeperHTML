class CellModel {
    constructor(isMine, isOpened, isDetonaited, isCellNoMines) {
        this.isMine = isMine;
        this.isOpened = isOpened;
        this.isDetonaited = isDetonaited;
        this.isCellNoMines = isCellNoMines;

    }
}

class SweeperBackend {
    constructor() {
        this.cells = [];
    }

    addCell(cell) {
        if (cell instanceof CellModel) {
            this.cells.push(cell);
        }
    }

    getCells() {
        return this.cells;
    }

    clearCells() {
        this.cells = [];
    }

    generateMines() {
        const used = new Set();

        const minesCount = Math.min(10, this.cells.length);

        while (used.size < minesCount) {
            const index = Math.floor(Math.random() * this.cells.length);
            used.add(index);
        }

        used.forEach(index => {
            this.cells[index].isMine = true;
        });

        this.isFieldContainsMines = true;
    }

}


const backend = new SweeperBackend();

const create_field = document.getElementById('create-grid-btn');
const generate_mines = document.getElementById('generate-mines');

const field_size = document.getElementById('field-size');

const cellContainer = document.getElementById('cells-list');

function createGrid() {
    backend.clearCells();
    const totalCells = parseInt(field_size.value);
    const gridSize = Math.round(Math.sqrt(totalCells));

    cellContainer.style.setProperty('--size', gridSize);

    for (let i = 0; i < totalCells; i++) {
        const emptyCell = new CellModel(false, false, false, true);
        backend.addCell(emptyCell);
    }

    renderCells();
}

function renderCells() {
    const allCells = backend.getCells();

    cellContainer.innerHTML = '';


    for (let i = 0; i < allCells.length; i++) {
        const button = document.createElement('button');

        button.classList.add('cell-btn');
        button.innerText = allCells[i].isMine ? 'Да' : 'Нет';

        cellContainer.appendChild(button)
    }
}

function generateMines() {
    backend.generateMines();
    renderCells(); 
}

create_field.onclick = createGrid;
generate_mines.onclick = generateMines;