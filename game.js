const grid = document.querySelector(".grid");
const gridSizeLabel = document.querySelector(".options__grid-size");

let gridSize = 10;
let minesAmount = 5;
let field = [];
const mines = [];

function renderGrid(size) {
  // Create field grid
  field = new Array(gridSize);

  grid.style.gridTemplateColumns = "repeat(" + gridSize + ", 1fr)";
  grid.style.gridTemplateRows = "repeat(" + gridSize + ", 1fr)";

  // Rows: x
  for (let i = 0; i < size; i++) {
    field[i] = new Array(size);
    // Columns: y
    for (let j = 0; j < size; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      grid.appendChild(cell);

      field[i][j] = { element: cell, mine: false, adjacentMines: 0 };
    }
  }

  gridSizeLabel.textContent = `${gridSize} x ${gridSize}`;
}

function randomizeMines(count, gridSize) {
  let i = 0;

  while (i < count) {
    const x = Math.floor(Math.random() * gridSize);
    const y = Math.floor(Math.random() * gridSize);

    console.log(x, y);

    if (!field[x][y].mine) {
      field[x][y].mine = true;
      mines.push({x, y});
      i++;
    }
  }
}

function displayMines() {
  console.log(mines);

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
        if (!neighbor.mine) {
          neighbor.element.innerHTML = neighbor.adjacentMines;
        }
      }
    }
  });
}

renderGrid(gridSize);
randomizeMines(minesAmount, gridSize);
displayMines();