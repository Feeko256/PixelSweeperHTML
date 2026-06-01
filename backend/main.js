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

    cellContainer.innerHTML = `
        <tr>
            <th>Номер</th>
            <th>Мина</th>
            <th>Открыта</th>
        </tr>
    `;

    allCells.forEach((cell, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>Ячейка №${index + 1}</td>
            <td>${cell.isMine ? 'Да' : 'Нет'}</td>
            <td>${cell.isOpened ? 'Да' : 'Нет'}</td>
        `;

        cellContainer.appendChild(row);
    });
}