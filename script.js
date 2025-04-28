"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const maze = document.querySelector("#maze");

    drawGrid(maze, 16);
});

function drawGrid(maze, n) {
    maze.textContent = "";
    const cellWidth = (maze?.clientWidth) / n;

    for ( let i = 0; i < n; i++ ) {
        for ( let j = 0; j < n; j++ ) {
            const cell = document.createElement("div");
            cell.setAttribute("class", "cell");
            cell.setAttribute("i", i);
            cell.setAttribute("j", j);
            cell.style["width"] = cellWidth + "px";
            maze.appendChild(cell);
        }  
    }
}