const grid = document.querySelector(".grid");

let gridSize = 10;
let minesAmount = 2;

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

    field[i][j] = { element: cell, mine: false };
    
  }
}

const mines = [
  { x: 3, y: 3 },
  { x: 6, y: 7 },
  { x: 8, y: 5 },
];

mines.forEach(mine => {
  field[mine.x][mine.y].element.innerHTML = "🔴";
});

console.log(field);