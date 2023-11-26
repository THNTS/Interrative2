var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
// const fullscreenBtn = document.getElementById('fullscreen-btn');

const canvasContainer = document.getElementById('canvas-container');

let currX, currY = 0;
let h = canvasContainer.clientHeight;
let w = canvasContainer.clientWidth;
canvas.width = w;
canvas.height = h;
function init() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    currX, currY = 0;  
    w = canvasContainer.clientWidth;
    h = canvasContainer.clientHeight;
    canvas.width = w;
    canvas.height = h;
    
    
    window.addEventListener("mousemove", function (e) {
      // getMousePosition('move', e)
      currX = e.clientX;
      currY = e.clientY;
      // console.log(currX, currY)
    }, false);
}

// window.onload = init();
window.addEventListener("load", function() {
    init();
    window.setInterval(update, 16);
 
    window.addEventListener('resize', resize, false);
});

function resize(){
  w = canvasContainer.clientWidth;
  h = canvasContainer.clientHeight;
  canvas.width = w;
  canvas.height = h;
}

var initMS = 0;
var pitwo = 2*Math.PI;
var sndrop = [];

function update(){
    initMS=initMS+1;
    //clear canvas
    context.fillStyle ='#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.beginPath()

    // create new drop 
    if(initMS%4 == 0){
        sndrop.push({posx:Math.random()*w,posy:-10,size:1+Math.floor(Math.abs(Math.sin(initMS*0.1))*10)})
    }

    context.fillStyle='#f0f0f0';

    sndrop.forEach(function(item,index){
        context.beginPath();
		context.arc(item.posx,item.posy,item.size,0,pitwo);
		item.posx += Math.sin(initMS*0.01) * item.size*0.15;
		item.posy += item.size*0.15;
		context.fill();

		if(item.posy > ((item.size*2)+h)){
            sndrop.splice( index, 1 );
		}
    });

    // make drop avoid mouse
    sndrop.forEach(function(item,index){
        var xdist = (item.posx - currX);
        var ydist = (item.posy - currY);
        var squaredDist = xdist * xdist + ydist * ydist;
        var incircl = (squaredDist < 50000);
        var invertCircle = (50000 - squaredDist)/50000;

        //if in range
        if(incircl){
            item.posx +=xdist * invertCircle * 0.05;
            item.posy +=ydist * invertCircle * 0.05;
        }
    });
}


const first_button = document.querySelector(".open");
var taskContainer = document.querySelector(".content");
var tasks = JSON.parse(localStorage.getItem("tasks"))
var len = 0;
var newButton;
let dirDiv = document.querySelector(".currentDir");
first_button.addEventListener('click', () => openChildren("Main"));
let curPath = "Main";
// let lvl = 0;
// let prevDict = tasks;
let curDict = tasks;
let filteredDict = tasks;
var newDiv;


var renderTiles = (Array) => {
    // remove current tiles
    taskContainer.innerHTML = "";
    if (Array) {
      // console.log(Array)
      let i = 0;
      Array.forEach((task) => {
        if (task.type == "Task") {
          const tileInnerHTML = `
          <button class="deleteButton fortask" id="${i}"><span>&#xD7;</span></button>
          <h1 class="task-name">${task.name}</h1>
          <p class="tile-desc">${task.desc}</p>
          <h2 class="tile-priority">Priority: ${task.priority}</h2>
          <div class="tile-due">Due date: ${task.dueDate}</div>`;

          const tile = document.createElement("div"); // create a <div> for the tile
          tile.className = "task";
          tile.name = task.name;
          tile.id = i;
          i++;
          tile.innerHTML = tileInnerHTML; // Add the tileInnerHTML created above to tile <div>
          let del = tile.firstElementChild;
          del.addEventListener("click", deleteTask)
          taskContainer.appendChild(tile); // Append the tile to the tileContainer
        } else {
          const tileInnerHTML = `
          <button class="deleteButton forgroup" id="${i}"><span>&#xD7;</span></button>
          <h1 class="group-name">${task.name}</h1>`;

          const tile = document.createElement("div"); // create a <div> for the tile
          tile.className = "group";
          tile.id = i;
          tile.name = task.name;
          i++;
          tile.innerHTML = tileInnerHTML; // Add the tileInnerHTML created above to tile <div>
          let del = tile.firstElementChild;
          let open = tile.lastElementChild;
          del.addEventListener("click", deleteTask)
          open.addEventListener("click", () => openChildren(task.name))
          taskContainer.appendChild(tile); // Append the tile to the tileContainer
        }
      })
    }
    let newDiv = document.createElement("div");
    newDiv.innerHTML = `<span>&#43;</span>`
    newDiv.className = "new";
    // newDiv.id = len;
    newButton = newDiv.firstElementChild;
    newDiv.addEventListener("click", openDialog);
    taskContainer.append(newDiv);
};
const isObjectEmpty = (objectName) => {
    return Object.keys(objectName).length === 0
}
console.log(tasks)
if (tasks !== null) {
  // renderTiles(tasks);
  len = tasks.length;
} else {
  tasks = []
}
// console.log(first_button.getBoundingClientRect())
// console.log(taskContainer)



// initially renders all robots
// renderRobotTiles(currentRobots);

// const submitButton = document.getElementById("submitButton");
const taskForm = document.querySelector(".form#tasks")
const groupForm = document.querySelector(".form#groups")
const submitGroupButton = document.getElementById("submitGroupButton")
const submitTaskButton = document.getElementById("submitTaskButton")
const Name = document.getElementById("task_name");
const Desc = document.getElementById("desc");
const Priority = document.getElementById("priorities");
const dueDate = document.getElementById("due_date");
const dialog = document.querySelector(".chooseType");
const newGroupBtn = document.getElementById("newGroup");
const newTaskBtn = document.getElementById("newTask");
const groupName = document.getElementById("group_name");
const closeDialog = document.getElementsByClassName("close");
var keysList = [];

for (const elem of closeDialog){
  elem.addEventListener('click', closeDial)
}
// const groupName = document.getElementById("group_name");

// taskForm.addEventListener('submit', (event) => {
//     event.preventDefault();
//     if (Name.value !== '' && Desc.value !== '' && dueDate.value !== '') {
//         let taskJson = {
//             name: `${Name.value}`,
//             desc: `${Desc.value}`,
//             priority: `${Priority.value}`,
//             dueDate: `${dueDate.value}`,
//         }
//         tasks.push(taskJson);
//         localStorage.setItem("tasks", JSON.stringify(tasks))
//         const newTask = document.createElement("div");
//         newTask.innerHTML = `
//               <button class="deleteButton" id="${len}"><span>&#xD7;</span></button>
//               <h1 class="tile-name">${Name.value}</h1>
//               <p class="tile-desc">${Desc.value}</p>
//               <h2 class="tile-priority">Priority:${Priority.value}</h2>
//               <div class="tile-due">Due date:${dueDate.value}</div>`;
//         newTask.className = "task";
//         newTask.id = len;
//         let del = newTask.firstElementChild;
//         del.addEventListener("click", deleteTask);
//         taskContainer.append(newTask);
//         len++;
//         taskForm.reset();
//     }
// });

function deleteTask(clicked) {
    // event.stopPropagation();
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
        children[i].id = children[i].id - 1;
        let del = children[i].firstElementChild;
        del.id = del.id - 1;
        // Do stuff
    }
    localStorage.setItem("tasks", JSON.stringify(tasks))

}

const backButton = document.querySelector("#backButton");
const directions = document.querySelector(".directions");
const filters = document.querySelector(".filtering");
// var newDiv


function openChildren(name="Main") {
    console.log("Opening ", name)
    if (name != "Main") {
      console.log("Subdir")
      curPath += `/${name}`;
      curDict = curDict[name];
      filteredDict = curDict;
      keysList.push(name);
      renderTiles(curDict);
    } else {
      console.log("first time)")
      dirDiv.style["opacity"] = "1";
      first_button.style["opacity"] = '0';
      first_button.style["top"] = "-50%";
      directions.style["opacity"] = "1";
      filters.style["opacity"] = "1";
      renderTiles(tasks);
    }
    dirDiv.firstChild.innerHTML = curPath;
}

function openDialog() {
    dialog.classList.add("active");
    dialog.style["opacity"] = "1";
    dialog.style["top"] = "50%";

    newGroupBtn.addEventListener('click', newGroup);
    newTaskBtn.addEventListener('click', newTask);
}

function closeDial() {
  console.log("closing dialog")
  let curDial = document.querySelector(".active");
  curDial.style["opacity"] = "0";
  curDial.style["top"] = "-50%";
}

function newGroup() {
    dialog.style["opacity"] = "0";
    dialog.style["top"] = "-50%";

    groupForm.style["opacity"] = "1";
    groupForm.style["top"] = "50%";
    newGroupBtn.removeEventListener('click', newGroup);
    newTaskBtn.removeEventListener('click', newTask);
    groupForm.style["opacity"] = "1";
    submitGroupButton.addEventListener('click',  addGroup)
}

function addGroup(event) {
    event.preventDefault();
    if (groupName.value !== '') {
        let groupJson = {
            type: "group",
            name: `${groupName.value}`,
            children: []
        }
        tasks.push(groupJson);
        localStorage.setItem("tasks", JSON.stringify(tasks))
        const newTask = document.createElement("div");
        newTask.innerHTML = `
                <button class="deleteButton forgroup" id="${len}"><span>&#xD7;</span></button>
                <h1 class="tile-name">${groupName.value}</h1>`;
        newTask.className = "group";
        newTask.id = len;
        // let del = newTask.firstElementChild;
        // del.addEventListener("click", deleteTask);
        taskContainer.insertBefore(newTask, newDiv);
        newTask.addEventListener("click", openChildren)
        len++;
        // taskForm.reset();
    }
    groupForm.style["opacity"] = "0";
    groupForm.style["top"] = "-50%";
    groupForm.removeEventListener('click', addGroup);
};

function newTask() {
    dialog.style["opacity"] = "0";
    dialog.style["top"] = "-50%";
    taskForm.style["opacity"] = "1";
    taskForm.style["top"] = "50%";
    newGroupBtn.removeEventListener('click', newGroup);
    newTaskBtn.removeEventListener('click', newTask);
    taskForm.style["opacity"] = "1";
    submitTaskButton.addEventListener('click', addTask);
}

function addTask(event) {
    event.preventDefault();
    if (Name.value !== '' && Desc.value !== '' && dueDate.value !== '') {
        let taskJson = {
            type: "Task",
            name: `${Name.value}`,
            desc: `${Desc.value}`,
            priority: `${Priority.value}`,
            dueDate: `${dueDate.value}`,
        }
        tasks.push(taskJson);
        localStorage.setItem("tasks", JSON.stringify(tasks))
        const newTask = document.createElement("div");
        newTask.innerHTML = `
            <button class="deleteButton fortask" id="${len}"><span>&#xD7;</span></button>
            <h1 class="tile-name">${Name.value}</h1>
            <p class="tile-desc">${Desc.value}</p>
            <h2 class="tile-priority">Priority: ${Priority.value}</h2>
            <div class="tile-due">Due date: ${dueDate.value}</div>`;
        newTask.className = "task";
        newTask.id = len;
        let del = newTask.firstElementChild;
        del.addEventListener("click", deleteTask);
        taskContainer.insertBefore(newTask, newDiv);
        len++;
        // taskForm.reset();
    }
    taskForm.style["opacity"] = "0";
    taskForm.style["top"] = "-50%";
    taskForm.removeEventListener('click', addTask);
}

backButton.addEventListener('click', goBack);

function goBack() {
  console.log("going Back Doc")
  curDict = tasks;
  curPath = "Main";
  console.log("current keys ",keysList)
  if (keysList.length > 1) {
    let last = keysList[-2];
    for (var i=0; i < keysList.length-2; i++) {
      curDict = curDict[keysList[i]];
      curPath += `/${keysList[i]}`;
    }
    keysList=keysList.splice(-1)
    console.log("prev keylist", keysList)
    openChildren(last);
  } else {
    keysList = []
    openChildren("Main");
  }
}

const searchBar = document.getElementById("search");

searchBar.addEventListener("input", (e) => {
   let value = e.target.value
    console.log(value)
    if (value && value.trim().length > 0){
        value = value.trim().toLowerCase()
        //  console.log(cuteRobots.filter((robot) => robot.name.toLowerCase().includes(value)))
        filteredDict = filteredDict.filter((tile) => tile.name.toLowerCase().includes(value))
    } else {
      filteredDict = curDict;
    }
    renderTiles(filteredDict);
})

const sortButton = document.getElementById("sort")


sortButton.addEventListener("click", () => {
    // console.log(currentRobots)
    const sortedDict = filteredDict.slice().sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
    });

    // Render the sorted robot tiles
    renderTiles(sortedDict);
});

const filterButton = document.getElementById("filter");

let cur_filter = null;

filterButton.addEventListener("click", () => {
    let inner = "Sort by Group/Tasks";
    console.log("current filter is: ", cur_filter)
    switch (cur_filter) {
      case "task":
        cur_filter = null;
        console.log("filter was tasks: ", cur_filter)
        break;
      case "group":
        cur_filter = "task";
        inner = "Showing tasks"
        console.log("filter was gruops: ", cur_filter)
        break;
      default:
        cur_filter = "group";
        inner = "Showing groups"
        console.log("filter was null: ", cur_filter)

    }
    if (cur_filter){
        //  console.log(cuteRobots.filter((robot) => robot.name.toLowerCase().includes(value)))
        filteredDict = curDict.filter((tile) => tile.type.toLowerCase().includes(cur_filter))
    } else {
      filteredDict = curDict;
    }
    filterButton.innerHTML = inner;
    renderTiles(filteredDict);
})