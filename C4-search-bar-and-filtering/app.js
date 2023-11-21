import  cuteRobots from "./robots.js";

// get the TileContainer we have created in index.html
var tileContainer = document.querySelector(".content");
let currentRobots = cuteRobots;

var renderRobotTiles = (cuteRobotsArray) => {
    // remove current tiles
    tileContainer.innerHTML = "";
    console.log(cuteRobotsArray)
    cuteRobotsArray.forEach((robot) => {
      const tileInnerHTML = `<div class="tile-container">
              <div class="grid-element">
                  <img class="tile-image" src="${robot.imageUrl}"></img>
                  <h2 class="tile-title">${robot.name}</h2>
                  <p>"${robot.description}"</p>
              </div>
          <div>`;
  
      const tile = document.createElement("div"); // create a <div> for the tile
      tile.innerHTML = tileInnerHTML; // Add the tileInnerHTML created above to tile <div>
      tileContainer.appendChild(tile); // Append the tile to the tileContainer
    });
  };
  

// initially renders all robots
renderRobotTiles(currentRobots);

const searchBar = document.getElementById("search");

searchBar.addEventListener("input", (e) => {
   let value = e.target.value
    console.log(value)
    if (value && value.trim().length > 0){
        value = value.trim().toLowerCase()
        //  console.log(cuteRobots.filter((robot) => robot.name.toLowerCase().includes(value)))
        currentRobots = cuteRobots.filter((robot) => robot.name.toLowerCase().includes(value))
    } else {
        currentRobots = cuteRobots;
    }
    renderRobotTiles(currentRobots)
})

const sortButton = document.getElementById("sort")


sortButton.addEventListener("click", () => {
    // console.log(currentRobots)
    const sortedRobots = currentRobots.slice().sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
    });

    // Render the sorted robot tiles
    renderRobotTiles(sortedRobots);
});
