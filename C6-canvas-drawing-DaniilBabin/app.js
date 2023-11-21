const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const colorButton = document.getElementById("favcolor");
const widthSelector = document.getElementById("penWidth");
const resetButton = document.getElementById("reset");
const shapes = document.getElementById("shapes");
const shapeButtons = shapes.children;
let line = true;

for (let i = 0; i < shapeButtons.length; i++) {
    shapeButtons[i].addEventListener("click", changeShape);
} 
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
let drawingMethod = drawLine;
function init() {
    // const canvas = document.getElementById("canvas");
    // const context = canvas.getContext("2d");
    // const colorButton = document.getElementById("favcolor")
    // const widthSelector = document.getElementById("penWidth")
    // console.log(colorButton.value)
    drawingMethod = drawLine;
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
    drawingMethod();
}

function drawLine() {
  context.beginPath();
  context.moveTo(prevX, prevY);
  context.lineTo(currX, currY);
  context.strokeStyle = color;
  context.lineWidth = width;
  context.stroke();
  context.closePath();
}

function drawCircle() {
    context.beginPath();
    context.strokeStyle = color;
    context.lineWidth = width;
    context.arc(currX, currY, 40, 0, 2 * Math.PI);
    context.stroke(); 
    context.closePath();
}

function drawTriangle() {
    context.beginPath();
    let r = 10;
    let pi = Math.PI
    var x_pos = (angle) => r*Math.cos(angle) + currX;
    var y_pos = (angle) => r*Math.sin(angle) + currY;
    context.moveTo(x_pos(0), y_pos(0));
    context.lineTo(x_pos((1./3)*(2*pi)), y_pos((1./3)*(2*pi)));
    context.lineTo(x_pos((2./3)*(2*pi)), y_pos((2./3)*(2*pi)));
    context.lineTo(x_pos(0), y_pos(0));
    context.strokeStyle = color;
    context.lineWidth = width;
    context.stroke();
    context.closePath();

}

function drawSquare() {
    context.beginPath();
    context.moveTo(currX-10, currY-10);
    context.lineTo(currX+10, currY-10);
    context.lineTo(currX+10, currY+10);
    context.lineTo(currX-10, currY+10);
    context.lineTo(currX-10, currY-10);
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
            if (line) {
                context.beginPath();
                context.fillStyle = color;
                context.fillRect(currX, currY, 2, 2);
                context.closePath();
            } else {
                prevX = currX;
                prevY = currY;
                currX = e.clientX - rect.left;
                currY = e.clientY - rect.top;
                draw();
            }
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
    init();в
})

function changeShape(clicked) {
    let currentStyle =  shapes.getElementsByClassName("selected-style")[0];
    
    let newStyle = this;
    newStyle.classList.add("selected-style");
    currentStyle.classList.remove("selected-style");
    switch (newStyle.getAttribute("func")) {
        case 'drawLine':
            line=true;
            drawingMethod=drawLine;
            break;
        case 'drawCircle':
            line=false;
            drawingMethod=drawCircle;
            break;
        case 'drawSquare':
            line=false;
            drawingMethod=drawSquare;
            break;
        case 'drawTriangle':
            line=false;
            drawingMethod=drawTriangle;
            break;
    }
    // drawingMethod=newStyle.getAttribute("func")
}