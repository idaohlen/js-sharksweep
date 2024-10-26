const grid = document.querySelector(".grid");
const gridSizeLabel = document.querySelector(".options__grid-size");

let gridSize = 10;
let minesAmount = 2;


gridSizeLabel.textContent = `${gridSize} x ${gridSize}`;

// Create field grid

let field = new Array(gridSize);

grid.style.gridTemplateColumns = "repeat(" + gridSize + ", 1fr)";
grid.style.gridTemplateRows = "repeat(" + gridSize + ", 1fr)";

// Rows: x
for (let i = 0; i < gridSize; i++) {
  field[i] = new Array(gridSize);
  // Columns: y
  for (let j = 0; j < gridSize; j++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    grid.appendChild(cell);

    field[i][j] = { element: cell, mine: false, adjacentMines: 0 };
  }
}

const mines = [
  { x: 3, y: 3 },
  { x: 6, y: 7 },
  { x: 8, y: 5 },
  { x: 9, y: 9 },
];

mines.forEach(mine => {
  field[mine.x][mine.y].element.innerHTML = "🔴";

  const neighbors = {
    north:     field?.[mine.x - 1]?.[mine.y],
    northEast: field?.[mine.x - 1]?.[mine.y + 1],
    east:      field?.[mine.x]?.[mine.y + 1],
    southEast: field?.[mine.x + 1]?.[mine.y + 1],
    south:     field?.[mine.x + 1]?.[mine.y],
    southWest: field?.[mine.x + 1]?.[mine.y - 1],
    west:      field?.[mine.x]?.[mine.y - 1],
    northWest: field?.[mine.x - 1]?.[mine.y - 1]
  }

  for (const neighbor of Object.values(neighbors)) {
    if (neighbor) {
      neighbor.adjacentMines++;
      neighbor.element.innerHTML = neighbor.adjacentMines;
    }
  }
});