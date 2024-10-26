const grid = document.querySelector(".grid");
const gridSizeLabel = document.querySelector(".options__grid-size");
const playBtn = document.querySelector(".play-btn");

let gridSize = 3;
let minesAmount = 1;
let field = [];
let mines = [];
let clearedCells = 0;

let playing = false;

function renderGrid(size) {
  // Create field grid
  grid.innerHTML = "";
  field = new Array(gridSize);

  grid.style.gridTemplateColumns = "repeat(" + gridSize + ", 1fr)";
  grid.style.gridTemplateRows = "repeat(" + gridSize + ", 1fr)";

  // Rows: x
  for (let x = 0; x < size; x++) {
    field[x] = new Array(size);
    // Columns: y
    for (let y = 0; y < size; y++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.addEventListener("click", () => pickCell(x, y));

      grid.appendChild(cell);

      field[x][y] = { element: cell, mine: false, adjacentMines: 0 };
    }
  }

  gridSizeLabel.textContent = `${gridSize} x ${gridSize}`;
}

function randomizeMines(count, gridSize) {
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

function placeMines() {
  mines.forEach(mine => {
    // Debug: Display mines
    // field[mine.x][mine.y].element.innerHTML = "🔴";

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

        // Debug: Display adjacent mines count
        // if (!neighbor.mine) {
        //   neighbor.element.innerHTML = neighbor.adjacentMines;
        // }
      }
    }
  });
}

function pickCell(x, y) {
  if (playing) {
    const cell = field[x][y];

    if (cell.mine) {
      cell.element.textContent = "🔴";
      gameOver();
    } else {
      clearedCells++;
      cell.element.textContent = cell.adjacentMines;
    }

    if (clearedCells == (gridSize * gridSize) - minesAmount) {
      win();
    }
  }
}

function play() {
  mines = [];
  clearedCells = 0;

  playing = true;
  renderGrid(gridSize);
  randomizeMines(minesAmount, gridSize);
  placeMines();
}

function win() {
  playing = false;
  console.log("You win!");
}

function gameOver() {
  playing = false;
  console.log("You lose...");
}

playBtn.addEventListener("click", play);

// Init
renderGrid(gridSize);
