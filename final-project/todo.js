// import * as BlFn from './blob.js';
var taskContainer = document.querySelector(".content");
var tasks = JSON.parse(localStorage.getItem("tasks"))
var len = 0;
var timeInterval = 60;

// for (let i=0; i<4; i++) {
//     BlFn.createBlob( { x: 10, y: 20 }, blobs );
//     await new Promise(r => setTimeout(r, 3000));
// }

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


console.log(taskContainer)
// BlFn.gravity(taskContainer.firstChild, blobs);



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
        children[i].id = children[i].id - 1;
        let del = children[i].firstElementChild;
        del.id = del.id - 1;
        // Do stuff
    }
    localStorage.setItem("tasks", JSON.stringify(tasks))

}

/**
 * https://lab.hakim.se/blob/03/
 */
let BlobWorld = new function () {

    var SCREEN_WIDTH = window.innerWidth;
    var SCREEN_HEIGHT = window.innerHeight;

    var canvas;
    var context;
    var blobs = [];

    var dragBlob;
    var gameMode = false;

    var screenX = window.screenX;
    var screenY = window.screenY;

    var mouseX = (window.innerWidth - SCREEN_WIDTH);
    var mouseY = (window.innerHeight - SCREEN_HEIGHT);
    var mouseIsDown = false;
    var mouseDownOffset = {
        x: 0,
        y: 0
    };

    // The bounds of the world
    var worldRect = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    };

    // The world gravity, applied to all blobs
    var gravity = {
        x: 0,
        y: 0.4
    };

    // A pair of blobs that should be merged
    var mergeQueue = {
        blobA: -1,
        blobB: -1
    };

    var skinIndex = 1;
    var skins = [{
            fillStyle: 'rgba(0,200,250,1.0)',
            strokeStyle: '#ffffff',
            lineWidth: 5,
            debug: false
        },
        {
            fillStyle: '',
            strokeStyle: '',
            lineWidth: 0,
            debug: true
        },
        {
            fillStyle: 'rgba(0,0,0,0.1)',
            strokeStyle: 'rgba(255,255,255,1.0)',
            lineWidth: 6,
            debug: false
        },
        {
            fillStyle: 'rgba(0,230,110,1.0)',
            strokeStyle: 'rgba(0,0,0,1.0)',
            lineWidth: 2,
            debug: false
        },
        {
            fillStyle: 'rgba(255,255,0,1.0)',
            strokeStyle: 'rgba(0,0,0,1.0)',
            lineWidth: 4,
            debug: false
        },
        {
            fillStyle: 'rgba(255,255,255,1.0)',
            strokeStyle: 'rgba(0,0,0,1.0)',
            lineWidth: 4,
            debug: false
        }
    ];

    this.init = function () {
        //   blobs = list;
        canvas = document.getElementById('world');

        if (canvas && canvas.getContext) {
            context = canvas.getContext('2d');

            // Register event listeners
            window.addEventListener('mousemove', documentMouseMoveHandler, false);
            canvas.addEventListener('mousedown', documentMouseDownHandler, false);
            canvas.addEventListener('dblclick', documentDoubleClickHandler, false);
            window.addEventListener('mouseup', documentMouseUpHandler, false);
            document.addEventListener('touchstart', documentTouchStartHandler, false);
            document.addEventListener('touchmove', documentTouchMoveHandler, false);
            document.addEventListener('touchend', documentTouchEndHandler, false);
            document.addEventListener('keydown', documentKeyDownHandler, false);
            window.addEventListener('resize', windowResizeHandler, false);

            document.getElementById('keyboardUp').addEventListener('click', keyboardUpHandler, false);
            document.getElementById('keyboardDown').addEventListener('click', keyboardDownHandler, false);
            document.getElementById('keyboardLeft').addEventListener('click', keyboardLeftHandler, false);
            document.getElementById('keyboardRight').addEventListener('click', keyboardRightHandler, false);

            createBlob({
                x: SCREEN_WIDTH * 0.5,
                y: SCREEN_HEIGHT * 0.1
            }, document.querySelector(".open"));

            windowResizeHandler();

            setInterval(loop, 1000 / timeInterval);
        }
    };


    function createBlob(position, center = null) {
        // console.log(center);
        var blob = new Blob(center);

        blob.position.x = position.x;
        blob.position.y = position.y;

        blob.generateNodes();
        if (center) {
            blob.gravityCenter = center;
        }

        blobs.push(blob);
    }

    function documentMouseMoveHandler(event) {
        mouseX = event.clientX - (window.innerWidth - SCREEN_WIDTH) * .5;
        mouseY = event.clientY - (window.innerHeight - SCREEN_HEIGHT) * .5;
    }

    function documentMouseDownHandler(event) {
        event.preventDefault();

        mouseIsDown = true;

        dragBlob = blobs[findClosestBody(blobs, {
            x: mouseX,
            y: mouseY
        })];
        var closestNodeIndex = findClosestBody(dragBlob.nodes, {
            x: mouseX,
            y: mouseY
        });
        dragBlob.dragNodeIndex = closestNodeIndex;

        // mouseDownOffset.y = 100;
    }

    function documentMouseUpHandler(event) {
        mouseIsDown = false;

        if (dragBlob) {
            dragBlob.dragNodeIndex = -1;
            dragBlob = null;
        }
    }

    function documentTouchStartHandler(event) {
        if (event.touches.length == 1) {
            event.preventDefault();

            mouseIsDown = true;

            mouseX = event.touches[0].pageX - (window.innerWidth - SCREEN_WIDTH) * .5;
            mouseY = event.touches[0].pageY - (window.innerHeight - SCREEN_HEIGHT) * .5;

            dragBlob = blobs[findClosestBody(blobs, {
                x: mouseX,
                y: mouseY
            })];
            var closestNodeIndex = findClosestBody(dragBlob.nodes, {
                x: mouseX,
                y: mouseY
            });
            dragBlob.dragNodeIndex = closestNodeIndex;

            // mouseDownOffset.y = 100;
        }
    }

    function documentTouchMoveHandler(event) {
        if (event.touches.length == 1) {
            event.preventDefault();

            mouseX = event.touches[0].pageX - (window.innerWidth - SCREEN_WIDTH) * .5;
            mouseY = event.touches[0].pageY - (window.innerHeight - SCREEN_HEIGHT) * .5;
        }
    }

    function documentTouchEndHandler(event) {
        mouseIsDown = false;

        if (dragBlob) {
            dragBlob.dragNodeIndex = -1;
            dragBlob = null;
        }
    }

    function documentDoubleClickHandler(event) {
        var mouse = {
            x: mouseX,
            y: mouseY
        };

        var blob = blobs[findClosestBody(blobs, mouse)];

        if (distanceBetween(blob.position, mouse) < blob.radius + 30) {
            splitBlob(blob);
        }
    }

    function documentKeyDownHandler(event) {
        switch (event.keyCode) {
            case 40:
                changeBlobRadius(-10);
                event.preventDefault();
                break;
            case 38:
                changeBlobRadius(10);
                event.preventDefault();
                break;
            case 37:
                changeSkin(-1);
                event.preventDefault();
                break;
            case 39:
                changeSkin(1);
                event.preventDefault();
                break;
        }
    }

    function keyboardUpHandler(event) {
        event.preventDefault();
        changeBlobRadius(20);
    }

    function keyboardDownHandler(event) {
        event.preventDefault();
        changeBlobRadius(-20);
    }

    function keyboardLeftHandler(event) {
        event.preventDefault();
        changeSkin(-1);
    }

    function keyboardRightHandler(event) {
        event.preventDefault();
        changeSkin(1);
    }

    function changeSkin(offset) {
        skinIndex += offset;
        skinIndex = skinIndex < 0 ? skins.length - 1 : skinIndex;
        skinIndex = skinIndex > skins.length - 1 ? 0 : skinIndex;
    }

    function changeBlobRadius(offset) {
        for (var i = 0, len = blobs.length; i < len; i++) {
            let blob = blobs[i];

            var oldRadius = blob.radius;

            blob.radius += offset;
            blob.radius = Math.max(40, Math.min(blob.radius, 280));

            if (blob.radius != oldRadius) {
                blob.updateNormals();
            }
        }
    }



    function windowResizeHandler() {
        SCREEN_WIDTH = window.innerWidth;
        SCREEN_HEIGHT = window.innerHeight;

        canvas.width = SCREEN_WIDTH;
        canvas.height = SCREEN_HEIGHT;

        worldRect.x = 3;
        worldRect.y = 3;
        worldRect.width = SCREEN_WIDTH - 6;
        worldRect.height = SCREEN_HEIGHT - 160;
    }

    function loop() {

        var skin = skins[skinIndex];

        // The area around the dirty region to include in the clear
        var dirtySpread = 80;

        var u1, u2, ulen, blob;

        // Clear the dirty rects of all blobs
        for (u1 = 0, ulen = blobs.length; u1 < ulen; u1++) {
            blob = blobs[u1];

            // Clear all pixels in the dirty region
            context.clearRect(blob.dirtyRegion.left - dirtySpread, blob.dirtyRegion.top - dirtySpread, blob.dirtyRegion.right - blob.dirtyRegion.left + (dirtySpread * 2), blob.dirtyRegion.bottom - blob.dirtyRegion.top + (dirtySpread * 2));

            // Reset the dirty region so that it can be expanded anew
            blob.dirtyRegion = {
                left: worldRect.x + worldRect.width,
                top: worldRect.y + worldRect.height,
                right: 0,
                bottom: 0
            };
        }

        // If there is a merge queued, solve it now
        // if (mergeQueue.blobA != -1 && mergeQueue.blobB != -1) {
        //     mergeBlobs(mergeQueue.blobA, mergeQueue.blobB, blobs);

        //     mergeQueue.blobA = -1;
        //     mergeQueue.blobB = -1;
        // }

        // If the mouse is down, start adding the velocity needed to move towards the mouse position
        // if( dragBlob ) {
        //   dragBlob.velocity.x += ( ( mouseX + mouseDownOffset.x ) - dragBlob.position.x ) * 0.01;
        //   dragBlob.velocity.y += ( ( mouseY + mouseDownOffset.y ) - dragBlob.position.y ) * 0.01;
        // } else  {
        //   dragBlob.velocity.x += ( ( mouseX + mouseDownOffset.x ) - dragBlob.position.x ) * 0.01;
        //   dragBlob.velocity.y += ( ( mouseY + mouseDownOffset.y ) - dragBlob.position.y ) * 0.01;
        // }
        for (u1 = 0, ulen = blobs.length; u1 < ulen; u1++) {
            let bl = blobs[u1]
            //   console.log(blobs[u1]);
            if (bl.gravityCenter) {
                // console.log("blobs center is ", bl.gravityCenter)
                let rect = bl.gravityCenter.getBoundingClientRect();
                let x_pos = rect.x + rect.width / 2;
                let y_pos = rect.y + rect.height / 2;
                bl.velocity.x += (x_pos - bl.position.x) * 0.03;
                bl.velocity.y += (y_pos - bl.position.y) * 0.03;
            }
        }

        for (u1 = 0, ulen = blobs.length; u1 < ulen; u1++) {
            blob = blobs[u1];
            //   Merging queue update
            //   for( u2 = 0; u2 < ulen; u2++ ) {
            //     var otherBlob = blobs[u2];

            //     if( otherBlob != blob ) {
            //       var distance = distanceBetween( { x: blob.position.x, y: blob.position.y }, { x: otherBlob.position.x, y: otherBlob.position.y } );

            //       if( distance < blob.radius + otherBlob.radius ) {
            //         mergeQueue.blobA = u1;
            //         mergeQueue.blobB = u2;
            //       }
            //     }
            //   }

            let rect = blob.gravityCenter.getBoundingClientRect();

            // Track window movement
            blob.velocity.x += (window.screenX - screenX) * (0.04 + (Math.random() * 0.1));
            blob.velocity.y += (window.screenY - screenY) * (0.04 + (Math.random() * 0.1));

            var friction = {
                x: 1.035,
                y: 1.035
            };
            // Enforce horizontal world bounds

            // if (!blob.wasEnforced && (getTime() - blob.lastBoundTime > 1500)) {
                if (blob.position.x > rect.x + rect.width) {
                    blob.velocity.x -= (blob.position.x - rect.width) * 0.05;
                    friction.y = 1.07;
                    // console.log()
                } else if (blob.position.x < rect.x) {
                    blob.velocity.x += Math.abs(rect.x - blob.position.x) * 0.05;
                    friction.y = 1.07;
                }

                // Enforce vertical world bounds
                if (blob.position.y > rect.y + rect.height) {
                    blob.velocity.y -= (blob.position.y - rect.height) * 0.05;
                    friction.x = 1.07;
                } else if (blob.position.y < rect.y) {
                    blob.velocity.y += Math.abs(rect.y - blob.position.y) * 0.05;
                    friction.x = 1.07;
                }
            // }

            if (!blob.wasEnforced && (getTime() - blob.lastBoundTime > 1200)){
            // Gravity
                blob.velocity.x = 0;
                blob.velocity.y = 0;
            } else {
                blob.velocity.x += gravity.x;
                blob.velocity.y += gravity.y;
            }

            // Friction
            blob.velocity.x /= friction.x;
            blob.velocity.y /= friction.y;

            // Apply the velocity to the entire blob
            blob.position.x += blob.velocity.x;
            blob.position.y += blob.velocity.y;

            var i, j, len, node, joint, position;

            // Update all node ghosts (previous positions). All nodes need to be synced before the below
            // calculation loop to avoid tearing between the first nodes
            for (i = 0, len = blob.nodes.length; i < len; i++) {
                node = blob.nodes[i];

                node.ghost.x = node.position.x;
                node.ghost.y = node.position.y;
            }

            var dragNode = blob.nodes[blob.dragNodeIndex];
            if (dragNode) {
                var angle = Math.atan2(mouseY - (blob.position.y - 80), mouseX - blob.position.x);

                blob.rotation += (angle - blob.rotation) * 0.03;
                blob.updateNormals();
            }

            // Calculation loop
            for (i = 0, len = blob.nodes.length; i < len; i++) {
                node = blob.nodes[i];

                // Move towards the normal target
                node.normal.x += (node.normalTarget.x - node.normal.x) * 0.05;
                node.normal.y += (node.normalTarget.y - node.normal.y) * 0.05;

                // This point will be used as the new position for this node, after all factors have been applied
                position = {
                    x: blob.position.x,
                    y: blob.position.y
                };

                // Apply the joints
                for (j = 0; j < node.joints.length; j++) {
                    joint = node.joints[j];

                    // Determine the strain on the joints
                    var strainX = ((joint.node.ghost.x - node.ghost.x) - (joint.node.normal.x - node.normal.x));
                    var strainY = ((joint.node.ghost.y - node.ghost.y) - (joint.node.normal.y - node.normal.y));

                    position.x += strainX * joint.strength;
                    position.y += strainY * joint.strength;
                }

                // Offset by the normal
                position.x += node.normal.x;
                position.y += node.normal.y;

                // Apply the drag offset (if applicable)
                if (i == blob.dragNodeIndex) {
                    position.x += (mouseX - position.x) * 0.98;
                    position.y += (mouseY - position.y) * 0.98;
                }

                // Apply the calculated position to the node (with easing)
                node.position.x += (position.x - node.position.x) * 0.1;
                node.position.y += (position.y - node.position.y) * 0.1;
                if ( (getTime() - blob.lastBoundTime > 1000)) {
                    // Limit the node position to screen bounds
                    node.position.x = Math.max(Math.min(node.position.x, rect.x + rect.width), rect.x);
                    node.position.y = Math.max(Math.min(node.position.y, rect.y + rect.height), rect.y);
                    blob.lastBoundTime = getTime();
                    blob.wasEnforced = true;
                    blob.velocity.x = 0;
                    blob.velocity.y = 0;
                    console.log("enforced")
                }
                // Expand the dirty rect if needed
                blob.dirtyRegion.left = Math.min(blob.dirtyRegion.left, node.position.x);
                blob.dirtyRegion.top = Math.min(blob.dirtyRegion.top, node.position.y);
                blob.dirtyRegion.right = Math.max(blob.dirtyRegion.right, node.position.x);
                blob.dirtyRegion.bottom = Math.max(blob.dirtyRegion.bottom, node.position.y);
            }

            if (!skin.debug) {
                context.beginPath();
                context.fillStyle = skin.fillStyle;
                context.strokeStyle = skin.strokeStyle;
                context.lineWidth = skin.lineWidth;
            }

            var cn = getArrayElementByOffset(blob.nodes, 0, -1); // current node
            var nn = getArrayElementByOffset(blob.nodes, 0, 0); // next node

            // Move to the first anchor
            context.moveTo(cn.position.x + (nn.position.x - cn.position.x) / 2, cn.position.y + (nn.position.y - cn.position.y) / 2);

            // Rendering loop
            for (i = 0, len = blob.nodes.length; i < len; i++) {
                cn = getArrayElementByOffset(blob.nodes, i, 0);
                nn = getArrayElementByOffset(blob.nodes, i, 1);

                if (skin.debug) {
                    context.beginPath();
                    context.lineWidth = 1;
                    context.strokeStyle = "#ababab";

                    for (j = 0; j < cn.joints.length; j++) {
                        joint = cn.joints[j];
                        context.moveTo(cn.position.x, cn.position.y);
                        context.lineTo(joint.node.position.x, joint.node.position.y);
                    }

                    context.stroke();
                    context.beginPath();
                    var cent = blob.position;
                    // console.log("blob", blob.position)
                    // console.log(cent);
                    context.moveTo(cent.x, cent.y);
                    context.arc(cent.x, cent.y, 5, 0, Math.PI * 2, true);
                    context.fill();
                    context.beginPath();
                    context.fillStyle = i == 0 ? "#00ff00" : "#dddddd";
                    context.arc(cn.position.x, cn.position.y, 5, 0, Math.PI * 2, true);
                    context.fill();
                } else {
                    context.quadraticCurveTo(cn.position.x, cn.position.y, cn.position.x + (nn.position.x - cn.position.x) / 2, cn.position.y + (nn.position.y - cn.position.y) / 2);
                }
            }

            if (skin.debug) {
                //        context.beginPath();
                //        context.fillStyle = "rgba(100,255,100,0.3)";
                //        context.fillRect(blob.dirtyRegion.left-dirtySpread,blob.dirtyRegion.top-dirtySpread,blob.dirtyRegion.right-blob.dirtyRegion.left+(dirtySpread*2),blob.dirtyRegion.bottom-blob.dirtyRegion.top+(dirtySpread*2));
                //        context.fill();
            }

            context.stroke();
            context.fill();
        }

        screenX = window.screenX;
        screenY = window.screenY;
    }


};



function findClosestBody(bodies, position) {
    var closestDistance = 9999;
    var currentDistance = 9999;
    var closestIndex = -1;

    for (var i = 0, len = bodies.length; i < len; i++) {
        var body = bodies[i];

        currentDistance = distanceBetween(body.position, {
            x: position.x,
            y: position.y
        });

        if (currentDistance < closestDistance) {
            closestDistance = currentDistance;
            closestIndex = i;
        }
    }

    return closestIndex;
}

function splitBlob(blob) {
    if (blob.quality > 8) {
        blobs.push(blob.split());
    }
}

function mergeBlobs(blobA, blobB, blobs) {
    var t = getTime();

    if (!blobs[blobA] || !blobs[blobB]) {
        return;
    }

    if (t - blobs[blobA].lastSplitTime > 500 && t - blobs[blobB].lastSplitTime > 500) {
        // Merge blobB with blobA
        blobs[blobA].merge(blobs[blobB]);

        // Remove blobB since blobA will take over its body
        blobs.splice(blobB, 1);
    }
}


function Blob(div) {
    this.position = {
        x: 0,
        y: 0
    };
    this.velocity = {
        x: 0,
        y: 0
    };
    this.quality = 8;
    this.nodes = [];
    this.rotation = -Math.PI * 0.5;
    this.dragNodeIndex = -1;
    this.dirtyRegion = {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
    };
    this.lastSplitTime = 0;
    this.lastBoundTime = getTime();
    this.wasEnforced = false;
    this.center = {
        x: 0,
        y: 0
    }
    this.gravityCenter = div;
    let rect = div.getBoundingClientRect();
    let height = rect.height;
    let width = rect.width;
    let area = height * width - 200;
    this.radius = Math.sqrt(area / Math.PI);
    console.log("area is", area, " and radius is ", this.radius)

    this.generateNodes = function () {
        this.nodes = [];

        var i, n;

        for (i = 0; i < this.quality; i++) {
            n = {
                normal: {
                    x: 0,
                    y: 0
                },
                normalTarget: {
                    x: 0,
                    y: 0
                },
                position: {
                    x: this.position.x,
                    y: this.position.y
                },
                ghost: {
                    x: this.position.x,
                    y: this.position.y
                },
                angle: 0
            };

            this.nodes.push(n);
        }

        this.updateJoints();

        this.updateNormals();
        // this.updateCenter();
    };

    this.updateJoints = function () {
        for (var i = 0; i < this.quality; i++) {
            var n = this.nodes[i];

            n.joints = [{
                    node: getArrayElementByOffset(this.nodes, i, -1),
                    strength: 1.8
                },
                {
                    node: getArrayElementByOffset(this.nodes, i, 1),
                    strength: 1.8
                }
            ];

            n.joints.push({
                node: getArrayElementByOffset(this.nodes, i, -2),
                strength: 1.8
            });

            n.joints.push({
                node: getArrayElementByOffset(this.nodes, i, 2),
                strength: 1.8
            });

        }
    };

    this.updateNormals = function () {
        var i, j, n;

        for (i = 0; i < this.quality; i++) {

            var n = this.nodes[i];

            if (this.dragNodeIndex != -1) {
                j = i - this.dragNodeIndex;
                j = j < 0 ? this.quality + j : j;
            } else {
                j = i;
            }

            n.angle = ((j / this.quality) * Math.PI * 2) + this.rotation;

            n.normalTarget.x = Math.cos(n.angle) * this.radius;
            n.normalTarget.y = Math.sin(n.angle) * this.radius;

            if (n.normal.x == 0 && n.normal.y == 0) {
                n.normal.x = n.normalTarget.x;
                n.normal.y = n.normalTarget.y;
            }
        }
    };

    this.split = function () {

        var velocitySpread = this.radius / 10;
        var nodeSpread = Math.round(this.nodes.length * 0.5);
        var radiusSpread = this.radius * 0.5;

        var sibling = new Blob();

        sibling.position.x = this.position.x;
        sibling.position.y = this.position.y;

        sibling.velocity.x = velocitySpread;
        sibling.velocity.y = this.velocity.y;

        sibling.nodes = [];

        var i = 0;
        while (i++ < nodeSpread) {
            sibling.nodes.push(this.nodes.shift());
        }

        sibling.radius = radiusSpread;
        sibling.quality = sibling.nodes.length;

        this.velocity.x = -velocitySpread;
        this.radius = radiusSpread;
        this.quality = this.nodes.length;

        this.dragNodeIndex = -1;
        this.updateJoints();
        this.updateNormals();

        sibling.dragNodeIndex = -1;
        sibling.updateJoints();
        sibling.updateNormals();

        sibling.lastSplitTime = getTime();
        this.lastSplitTime = getTime();

        return sibling;

    };

    this.merge = function (sibling) {
        this.velocity.x *= 0.5;
        this.velocity.y *= 0.5;

        this.velocity.x += sibling.velocity.x * 0.5;
        this.velocity.y += sibling.velocity.y * 0.5;

        while (sibling.nodes.length) {
            this.nodes.push(sibling.nodes.shift());
        }

        this.quality = this.nodes.length;
        this.radius += sibling.radius;

        this.dragNodeIndex = -1;

        this.updateNormals();
        this.organizeNodesByProximity();
        this.updateJoints();
    };

    this.organizeNodesByProximity = function () {
        var i, j, outer, inner;

        var closestDistance, currentDistance, closestIndex;

        var newNodes = this.nodes.concat();
        var blackListed = [];

        for (i = 0; i < this.quality; i++) {
            outer = newNodes[i];

            currentDistance = 9999;
            closestDistance = 9999;
            closestIndex = -1;

            for (j = 0; j < this.quality; j++) {
                inner = newNodes[j];

                currentDistance = distanceBetween(inner.position, outer.position);

                if (currentDistance < closestDistance && blackListed.indexOf(inner) === -1) {
                    closestDistance = currentDistance;
                    closestIndex = j;
                }
            }

            this.nodes[i] = newNodes[closestIndex];
        }

    };
}

function getArrayElementByOffset(array, index, offset) {
    if (array[index + offset]) {
        return array[index + offset];
    }

    if (index + offset > array.length - 1) {
        return array[index - array.length + offset];
    }

    if (index + offset < 0) {
        return array[array.length + (index + offset)];
    }
}

function sortByField(list, field) {
    var sortOnField = function (a, b) {
        return a[field] - b[field];
    };

    list.sort(sortOnField);
}

function getTime() {
    return new Date().getTime();
}

function distanceBetween(p1, p2) {
    var dx = p2.x - p1.x;
    var dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
}

//  function gravity(elem, blobs) {
//   // event.preventDefault();
//   var rect = elem.getBoundingClientRect();
//   var centerX = rect.x+rect.width/2, centerY = rect.y+rect.height/2;
//   let dragBlob = blobs[ findClosestBody( blobs, { x: centerX, y: centerY } ) ];
//   var closestNodeIndex = findClosestBody( dragBlob.nodes, { x: centerX, y: centerY } );
//   dragBlob.dragNodeIndex = closestNodeIndex;

//   // mouseDownOffset.y = 100;
// }


BlobWorld.init();