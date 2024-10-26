const fieldElement = document.querySelector(".field");
const gridSizeLabel = document.querySelector(".options__grid-size");
const playBtn = document.querySelector(".play-btn");

let gridSize = 10;
let minesAmount = 10;

let field = [];
let mines = [];
let clearedCells = 0;

let playing = true;

// Render the field grid
function renderField() {
  fieldElement.innerHTML = "";
  fieldElement.style.gridTemplateColumns = "repeat(" + gridSize + ", 1fr)";
  fieldElement.style.gridTemplateRows = "repeat(" + gridSize + ", 1fr)";

  field = new Array(gridSize);

  // Rows: x
  for (let x = 0; x < gridSize; x++) {
    field[x] = new Array(gridSize);

    // Columns: y
    for (let y = 0; y < gridSize; y++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.addEventListener("click", () => clearCell(x, y));

      fieldElement.appendChild(cell);

      field[x][y] = {
        x,
        y,
        element: cell,
        isMine: false,
        isCleared: false,
        adjacentMines: 0
      };
    }
  }

  gridSizeLabel.textContent = `${gridSize} x ${gridSize}`;
}

// Randomize the mine placements and add them to the field data
function randomizeMines(count) {
  mines = [];
  let i = 0;

  while (i < count) {
    const x = Math.floor(Math.random() * gridSize);
    const y = Math.floor(Math.random() * gridSize);

    if (!field[x][y].isMine) {
      field[x][y].isMine = true;
      mines.push({x, y});
      i++;
    }
  }
}

// Get the data of all the adjacent tiles of a cell
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

// Inform cells adjacent to a mine that it is next to it
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

      if (cell.isMine) {
        cell.element.textContent = "🔴";
      } else {
        cell.element.textContent = cell.adjacentMines;
      }
    }
  }
}

// Add styling classes to a cell
function styleCell(cell) {
  if (cell.isMine) {
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

function clearCell(x, y) {
  // Cell does not exist
  if (x >= gridSize || x < 0 || y >= gridSize || y < 0) return;

  const cell = field[x][y];

  // Game over if the cell is a mine
  if (cell.isMine) {
    gameOver();
    return;
  }

  // Cell is already cleared, quit the loop
  if (cell.isCleared) return;

  cell.isCleared = true;
  clearedCells++;
  styleCell(cell);

  if (cell.adjacentMines === 0) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        // Check if all cells have been cleared -> win the game
        clearCell(x + i, y + j);
      }
    }
  }

  if (clearedCells === (gridSize * gridSize) - minesAmount) {
    win();
    return;
  }
}

// Start playing the game
function play() {
  mines = [];
  clearedCells = 0;
  playing = true;

  renderField();
  randomizeMines(minesAmount);
  placeMines();
}

// Won the game
function win() {
  playing = false;
  revealField();
  console.log("You win!");
}

// Lost the game
function gameOver() {
  playing = false;
  revealField();
  console.log("You lose...");
}

// Click the play button
playBtn.addEventListener("click", play);

// Init
renderField();
play();