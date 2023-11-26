const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const fullscreenBtn = document.getElementById('fullscreen-btn');

// console.log(colorButton.value)
let currX, currY = 0;
let h = window.innerHeight;
let w = window.innerWidth;
canvas.width = 70/100*w;
canvas.height = canvas.width*10/16;
function init() {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    const fullscreenBtn = document.getElementById('fullscreen-btn');

    // const colorButton = document.getElementById("favcolor")
    // const widthSelector = document.getElementById("penWidth")
    // console.log(colorButton.value)
    currX, currY = 0;  
    h = window.innerHeight;
    w = window.innerWidth;
    canvas.width = (70/100)*w;
    canvas.height = canvas.width*10/16;
    
    
    canvas.addEventListener("mousemove", function (e) {
      getMousePosition('move', e)
    }, false);
    
    // canvas.addEventListener("mousedown", function (e) {
    //   getMousePosition('down', e)
    // }, false);
    // canvas.addEventListener("mouseup", function (e) {
    //   getMousePosition('up', e)
    // }, false);
    // canvas.addEventListener("mouseout", function (e) {
    //   getMousePosition('out', e)
    // }, false);
}

// window.onload = init();
window.addEventListener("load", function(){
    init();
    window.setInterval(update, 16);
 
    window.addEventListener('resize', resize, false);
    fullscreenBtn.addEventListener('click', () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            canvas.requestFullscreen();
        }
    });
 
    // when mouse  moves
    // onmousemove = function(e){ getMousePosition(e.x, e.y)} 
});

function resize(){
    h = window.innerHeight;
    w = window.innerWidth;
    canvas.width = (70/100)*w;
    canvas.height = canvas.width*10/16;
}

function save() {
    var dataURL = canvas.toDataURL();
}

function getMousePosition(res, e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;  // scaling factor for X
    const scaleY = canvas.height / rect.height;  // scaling factor for Y

    currX = (e.clientX - rect.left) * scaleX;
    currY = (e.clientY - rect.top) * scaleY;
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
		item.posy += item.size*0.15;    //add vertical motion
		context.fill(); // fill the drawn shape(works as endpath)

        // if item is off screen
		if(item.posy > ((item.size*2)+h)){
            sndrop.splice( index, 1 ); // removes element at index position
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

