"use strict";

let stack = [];
let cells = undefined;
let n = 4;

document.addEventListener("DOMContentLoaded", () => {
    const maze = document.querySelector("#maze");

    // draw maze grid
    drawGrid(maze);
    cells = maze.childNodes;

    // draw maze
    let current = cells[0]; // start at [i, j] = [0, 0]
    visit(current);

    // initialise level counter
    let level = 1;
    let player = cells[0];
    player.style["background-color"] = "#DC3C18";

    let exit = cells[n * n - 1];
    exit.style["background-color"] = "#DDDDDD";
});

function drawGrid(maze) {
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
function visit(cell) {
    // mark current cell as visited
    cell.dataset.visited = true;

    // choose a random unvisted neighbour
    let neighbour = randomNeighbour(cell); // = undefined if no such neighbours exist
    if ( neighbour ) {
        // remove border between current cell and neighbouring cell
        removeWalls(cell, neighbour);

        // push cell to stack
        stack.push(cell);

        // recursively visit neighbour/next cell
        visit(neighbour);
    } else {
        // pop from stack and visit recursively
        if ( stack.length ) visit(stack.pop());
    }
}

// converts 2D coordinates to 1D index
function index(i, j) {
    if ( i < 0 || j < 0 || i > n - 1 || j > n- 1 ) {
        return -1;
    }
    return n * i + j;
}

// returns a random unvisited neighbour
function randomNeighbour(cell) {
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

function removeWalls(cell, neighbour) {
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
}