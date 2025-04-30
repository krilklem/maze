"use strict";

let stack = [];
let cells = undefined;
let n = 16;

document.addEventListener("DOMContentLoaded", () => {
    const maze = document.querySelector("#maze");

    // draw complete maze
    drawMaze(maze);

    // initialise game variables
    let level = 1;
    let escaped = false;
    let player = cells[0];
    player.classList.add("player");

    // initialise escape cell
    let exit = cells[n * n - 1];
    exit.classList.add("exit");

    // 
    document.addEventListener("keydown", (event) => {
        let key = event.key.toLowerCase();
        switch ( key ) {
            case "arrowup":
            case "w":
                [player, escaped] = move(player, "top");
                break;
            case "arrowright":
            case "d":
                [player, escaped] = move(player, "right");
                break;
            case "arrowdown":
            case "s":
                [player, escaped] = move(player, "bottom");
                break;
            case "arrowleft":
            case "a":
                [player, escaped] = move(player, "left");
                break;
        }

        if ( escaped ) 
        {
            console.log("you won!...time for a new map"); ///
            // TO DO: add score to backlog
            // TO DO: restart timer
            level += 1;
            n += 2;

            drawMaze(maze);

            escaped = false;
            player = cells[0];
            player.classList.add("player");

            // initialise escape cell
            exit = cells[n * n - 1];
            exit.classList.add("exit");
        }
    });
    
});

// draw maze
function drawMaze(maze) {
    // draw maze grid
    drawGrid(maze);
    cells = maze.childNodes;

    // draw maze
    let current = cells[0]; // start at [i, j] = [0, 0]
    visit(current);

    // add random cycles
    for ( let i = 0; i < n * 2; i ++ ) {
        let randomCell = cells[Math.floor(Math.random() * n * n)];
        let indices = allNeighbours(randomCell);
        
        let neighbours = [];
        indices.forEach( index => cells[index] ? neighbours.push(cells[index]) : null );

        removeWalls(randomCell, neighbours[Math.floor(Math.random() * neighbours.length)]);
    }
}

// populate maze <div> with cell <div>'s
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

// return the indices of all cells  that neighbour the argument cell
function allNeighbours(cell) {
    return [index(Number(cell.dataset.i) - 1, Number(cell.dataset.j)    , n),  // top
            index(Number(cell.dataset.i),     Number(cell.dataset.j) + 1, n),  // right
            index(Number(cell.dataset.i) + 1, Number(cell.dataset.j)    , n),  // bottom
            index(Number(cell.dataset.i),     Number(cell.dataset.j) - 1, n)]; // left
}

// returns a random unvisited neighbour
function randomNeighbour(cell) {
    let indices = allNeighbours(cell);
    console.log(indices);

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

// remove borders between traversed cells
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

// move player cell if there is not a wall in the direction of the input
function move(player, direction) {
    let wall = player.style[`border-${direction}`];
    let escaped = false;
    if ( wall === "none") {
        player.classList.remove("player");
        switch ( direction ) {
            case "top":
                player = cells[index(Number(player.dataset.i) - 1, Number(player.dataset.j)    )];
                break;
            case "right":
                player = cells[index(Number(player.dataset.i)    , Number(player.dataset.j) + 1)];
                break;
            case "bottom":
                player = cells[index(Number(player.dataset.i) + 1, Number(player.dataset.j)    )];
                break;
            case "left":
                player = cells[index(Number(player.dataset.i)    , Number(player.dataset.j) - 1)];
                break;
        }
        if ( player.classList.contains("exit") ) {
            escaped = true;
            player.classList.remove("exit"); // a bit redundant as CSS class is overwritten
            player.classList.add("escaped");
        }
        player.classList.add("player");
    }
    return [player, escaped];
}