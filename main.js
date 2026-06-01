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
}


const backend = new SweeperBackend();
let cellCounter = 1;

const button = document.getElementById('add-cell-btn');
const cellContainer = document.getElementById('cells-list');

function addCell() {
    const emptyCell = new CellModel(false, false, false, true);
    backend.addCell(emptyCell);
    renderCells();
}

function renderCells() {
    const allCells = backend.getCells();

    cellContainer.innerHTML = '';


        for(let i =0; i < allCells.length; i++){
            const button = document.createElement('button');

            button.classList.add('cell-btn');
            button.innerText = allCells[i].isMine ? 'Да' : 'Нет';

            cellContainer.appendChild(button)
        }
}

addCell();
button.onclick = addCell;