var taskContainer = document.querySelector(".content");
var tasks = JSON.parse(localStorage.getItem("tasks"))
var len = 0;

var renderTiles = (Array) => {
  // remove current tiles
  taskContainer.innerHTML = "";
  console.log(Array)
  let i = 0;
  Array.forEach((task) => {
    const tileInnerHTML = `
      <button class="deleteButton" id="${i}"><span>&#xD7;</span></button>
      <h1 class="tile-name">${task.name}</h1>
      <p class="tile-desc">${task.desc}</p>
      <h2 class="tile-priority">Priority:${task.priority}</h2>
      <div class="tile-due">Due date:${task.dueDate}</div>`;

    const tile = document.createElement("div"); // create a <div> for the tile
    tile.className = "task";
    tile.id = i;
    i++;
    tile.innerHTML = tileInnerHTML; // Add the tileInnerHTML created above to tile <div>
    let del = tile.firstElementChild;
    del.addEventListener("click", deleteTask)
    taskContainer.appendChild(tile); // Append the tile to the tileContainer
  });
};

const isObjectEmpty = (objectName) => {
  return Object.keys(objectName).length === 0
}


if (tasks !== null) {
  renderTiles(tasks);
  len = tasks.length;
} else {
  tasks = []
}


  

// initially renders all robots
// renderRobotTiles(currentRobots);

// const submitButton = document.getElementById("submitButton");
const taskForm = document.getElementById("inputs")
const submitButton = document.getElementById("submitButton")
const Name = document.getElementById("task_name");
const Desc = document.getElementById("desc");
const Priority = document.getElementById("priorities");
const dueDate = document.getElementById("due_date");


taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (Name.value !== '' && Desc.value !== '' && dueDate.value !== '') {
      let taskJson = {
        name: `${Name.value}`,
        desc: `${Desc.value}`,
        priority: `${Priority.value}`,
        dueDate: `${dueDate.value}`,
      }
      tasks.push(taskJson);
      localStorage.setItem("tasks", JSON.stringify(tasks))
      const newTask = document.createElement("div");
      newTask.innerHTML = `
              <button class="deleteButton" id="${len}"><span>&#xD7;</span></button>
              <h1 class="tile-name">${Name.value}</h1>
              <p class="tile-desc">${Desc.value}</p>
              <h2 class="tile-priority">Priority:${Priority.value}</h2>
              <div class="tile-due">Due date:${dueDate.value}</div>`;
      newTask.className = "task";
      newTask.id = len;
      let del = newTask.firstElementChild;
      del.addEventListener("click", deleteTask)
      taskContainer.append(newTask);
      len++;
      taskForm.reset();
    }
});

function deleteTask(clicked) {
  let deleteID = this.id;
  console.log(deleteID)
  // const index = tasks.indexOf(deleteID);
  // let deleteChild = taskContainer.querySelector()
  let index = -1;
  console.log(index)
  if (index > -1) { // only splice array when item is found
    tasks.splice(index, 1); // 2nd parameter means remove one item only
    // renderTiles(tasks);
    len--;
  }
  tasks.splice(deleteID, 1)
  console.log(tasks);
  taskContainer.removeChild(taskContainer.children[deleteID]);
  var children = taskContainer.children;
  for (var i = deleteID; i < children.length; i++) {
    children[i].id = children[i].id-1;
    let del = children[i].firstElementChild;
    del.id = del.id - 1;
    // Do stuff
  }
  localStorage.setItem("tasks", JSON.stringify(tasks))

}