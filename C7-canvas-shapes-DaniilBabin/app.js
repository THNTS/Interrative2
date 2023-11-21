const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const colorButton = document.getElementById("favcolor");
const widthSelector = document.getElementById("penWidth");
const resetButton = document.getElementById("reset");
// console.log(colorButton.value)
var downFlag = false,
    prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0,
    firstDot = false;
var color = "black";
var width = 2;
canvas.width = 700;
canvas.height = 700;
function init() {
    // const canvas = document.getElementById("canvas");
    // const context = canvas.getContext("2d");
    // const colorButton = document.getElementById("favcolor")
    // const widthSelector = document.getElementById("penWidth")
    // console.log(colorButton.value)
     downFlag = false,
        prevX = 0,
        currX = 0,
        prevY = 0,
        currY = 0,
        firstDot = false;
        colorButton.value = color = "#000000";
    widthSelector.value = width = 2;
    canvas.width = 700;
    canvas.height = 700;
    
    
    canvas.addEventListener("mousemove", function (e) {
      getMousePosition('move', e)
    }, false);
    canvas.addEventListener("mousedown", function (e) {
      getMousePosition('down', e)
    }, false);
    canvas.addEventListener("mouseup", function (e) {
      getMousePosition('up', e)
    }, false);
    canvas.addEventListener("mouseout", function (e) {
      getMousePosition('out', e)
    }, false);
}

window.onload = init();

// canvas.addEventListener("mousemove", function (e) {
//   getMousePosition('move', e)
// }, false);
// canvas.addEventListener("mousedown", function (e) {
//   getMousePosition('down', e)
// }, false);
// canvas.addEventListener("mouseup", function (e) {
//   getMousePosition('up', e)
// }, false);
// canvas.addEventListener("mouseout", function (e) {
//   getMousePosition('out', e)
// }, false);

// init();

function draw() {
  context.beginPath();
  context.moveTo(prevX, prevY);
  context.lineTo(currX, currY);
  context.strokeStyle = color;
  context.lineWidth = width;
  context.stroke();
  context.closePath();
}

function save() {
    var dataURL = canvas.toDataURL();
}

function getMousePosition(res, e) {
    const rect = canvas.getBoundingClientRect();
    if (res == 'down') {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - rect.left;
        currY = e.clientY - rect.top;

        downFlag = true;
        firstDot = true;
        if (firstDot) {
            context.beginPath();
            context.fillStyle = color;
            context.fillRect(currX, currY, 2, 2);
            context.closePath();
            firstDot = false;
        }
    }
    if (res == 'up' || res == "out") {
        downFlag = false;
    }
    if (res == 'move') {
        if (downFlag) {
            prevX = currX;
            prevY = currY;
            currX = e.clientX - rect.left;
            currY = e.clientY - rect.top;
            draw();
        }
    }
}

colorButton.addEventListener("input", () => {
    // TODO
    console.log("new value is ", colorButton.value)
    color = colorButton.value;
   }, false)
   
widthSelector.addEventListener("input", () => {
    width = widthSelector.value;
   }, false)
   
resetButton.addEventListener("click",() => {
    context.reset();
    init();
})