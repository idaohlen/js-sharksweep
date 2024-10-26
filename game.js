const grid = document.querySelector(".grid");
const gridSizeLabel = document.querySelector(".options__grid-size");
const playBtn = document.querySelector(".play-btn");

let gridSize = 5;
let minesAmount = 3;
let field = [];
let mines = [];
let clearedCells = 0;

let playing = true;

function renderGrid() {
  // Create field grid
  grid.innerHTML = "";
  field = new Array(gridSize);

  grid.style.gridTemplateColumns = "repeat(" + gridSize + ", 1fr)";
  grid.style.gridTemplateRows = "repeat(" + gridSize + ", 1fr)";

  // Rows: x
  for (let x = 0; x < gridSize; x++) {
    field[x] = new Array(gridSize);
    // Columns: y
    for (let y = 0; y < gridSize; y++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.addEventListener("click", () => pickCell(x, y));

      grid.appendChild(cell);

      field[x][y] = { element: cell, mine: false, adjacentMines: 0 };
    }
  }

  gridSizeLabel.textContent = `${gridSize} x ${gridSize}`;
}

function randomizeMines(count) {
  mines = [];
  let i = 0;

  while (i < count) {
    const x = Math.floor(Math.random() * gridSize);
    const y = Math.floor(Math.random() * gridSize);

    if (!field[x][y].mine) {
      field[x][y].mine = true;
      mines.push({x, y});
      i++;
    }
  }
}

function getNeighborsOfCell(x, y) {
  return {
    north:     field?.[x - 1]?.[y],
    northEast: field?.[x - 1]?.[y + 1],
    east:      field?.[x]?.[y + 1],
    southEast: field?.[x + 1]?.[y + 1],
    south:     field?.[x + 1]?.[y],
    southWest: field?.[x + 1]?.[y - 1],
    west:      field?.[x]?.[y - 1],
    northWest: field?.[x - 1]?.[y - 1]
  }
}

function placeMines() {
  mines.forEach(mine => {
    const neighbors = getNeighborsOfCell(mine.x, mine.y);

    for (const neighbor of Object.values(neighbors)) {
      if (neighbor) {
        neighbor.adjacentMines++;
      }
    }
  });
}

function revealField() {
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      const cell = field[x][y];
      styleCell(cell);

      if (cell.mine) {
        cell.element.textContent = "🔴";
      } else {
        cell.element.textContent = cell.adjacentMines;
      }
    }
  }
}

function fillNeighbours(neighbors) {
  for (const neighbor of Object.values(neighbors)) {
    if (neighbor && !neighbor.mine && !neighbor.cleared) {
      neighbor.cleared = true;
      clearedCells++;
      styleCell(neighbor);
      neighbor.element.textContent = neighbor.adjacentMines;
    }
  }
}

function styleCell(cell) {
  if (cell.mine) {
    cell.element.classList.add("mine");
    cell.element.textContent = "🔴";
  } else {
    cell.element.textContent = cell.adjacentMines;

    switch (cell.adjacentMines) {
      case 0:
        cell.element.classList.add("empty");
      case 1:
        cell.element.classList.add("close");
        break;
      case 2:
        cell.element.classList.add("warning");
        break;
      case 3:
        cell.element.classList.add("danger");
        break;
      default: break;
    }
  }
}

function pickCell(x, y) {
  if (playing) {
    const cell = field[x][y];

    // Game over is the cell is a mine
    if (cell.mine) {
      gameOver();
    }
    // Cell is not a mine
    else {
      if(!cell.cleared) {
        clearedCells++;

        // Check if cell does not have adjacent mines
        if (cell.adjacentMines === 0) {
          console.log("No adjacent mines");
          const neighbors = getNeighborsOfCell(x, y);
          fillNeighbours(neighbors);
        }
      }
    }
    styleCell(cell);

    if (clearedCells == (gridSize * gridSize) - minesAmount) {
      win();
    }
  }
}

function play() {
  mines = [];
  clearedCells = 0;
  playing = true;

  renderGrid();
  randomizeMines(minesAmount);
  placeMines();
}

function win() {
  playing = false;
  revealField();
  console.log("You win!");
}

function gameOver() {
  playing = false;
  revealField();
  console.log("You lose...");
}

playBtn.addEventListener("click", play);

// Init
renderGrid();
play();