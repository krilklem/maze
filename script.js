"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const maze = document.querySelector("#maze");

    // initialise level counter and maze grid
    let level = 1;
    let n = 8;
    drawGrid(maze, n);
    const cells = maze.childNodes;

    // create maze
    let current = cells[0]; // start at [i, j] = [0, 0]
    visit(cells, current, n);
});

function drawGrid(maze, n) {
    maze.textContent = "";
    const cellWidth = (maze?.clientWidth) / n;

    for ( let i = 0; i < n; i++ ) {
        for ( let j = 0; j < n; j++ ) {
            const cell = document.createElement("div");

            cell.setAttribute("class", "cell");
            cell.style["width"] = cellWidth + "px";

            cell.dataset.i = i;
            cell.dataset.j = j;
            cell.dataset.visited = false;
            
            maze.appendChild(cell);
        }  
    }
}

// recursively visit cells and create maze
function visit(cells, cell, n) {
    // mark current cell as visited
    cell.dataset.visited = true;
    cell.style["background-color"] = "#1789fc";/////////////////////////// just here for debugging

    let neighbour = randomNeighbour(cells, cell, n);
    if ( neighbour ) {

        // remove border between current cell and neighbouring cell
        if ( Number(neighbour.dataset.i) === Number(cell.dataset.i) - 1 &&
             Number(neighbour.dataset.j) === Number(cell.dataset.j) ) { // top
            cell.style["border-top"] = "none";
            neighbour.style["border-bottom"] = "none";
        } else if ( Number(neighbour.dataset.i) === Number(cell.dataset.i) &&
                    Number(neighbour.dataset.j) === Number(cell.dataset.j) + 1 ) { // right
            cell.style["border-right"] = "none";
            neighbour.style["border-left"] = "none";
        } else if ( Number(neighbour.dataset.i) === Number(cell.dataset.i) + 1 &&
                    Number(neighbour.dataset.j) === Number(cell.dataset.j) ) { // bottom
            cell.style["border-bottom"] = "none";
            neighbour.style["border-top"] = "none";
        } else { // left
            cell.style["border-left"] = "none";
            neighbour.style["border-right"] = "none";
        }

        // recursively visit neighbour/next cell
        visit(cells, neighbour, n);
    }
}

// converts 2D coordinates to 1D index
function index(i, j, n) {
    if ( i < 0 || j < 0 || i > n - 1 || j > n- 1 ) {
        return -1;
    }
    return n * i + j;
}

// returns a random unvisited neighbour
function randomNeighbour(cells, cell, n) {
    let indices = [ index(Number(cell.dataset.i) - 1, Number(cell.dataset.j)    , n),  // top
                    index(Number(cell.dataset.i),     Number(cell.dataset.j) + 1, n),  // right
                    index(Number(cell.dataset.i) + 1, Number(cell.dataset.j)    , n),  // bottom
                    index(Number(cell.dataset.i),     Number(cell.dataset.j) - 1, n)]; // left

    let unvisited = [];
    indices.forEach( index => {
        if ( cells[index] ? !(cells[index].dataset.visited === "true") : false ) {
            unvisited.push(cells[index]);
        }
    });

    if ( unvisited.length > 0 ) {
        return unvisited[Math.floor(Math.random() * unvisited.length)];
    }
    return undefined; // no unvisited neighbours to return
}