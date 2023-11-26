var timeInterval = 60;
const first_button = document.querySelector(".open");

var BlobWorld = new function() {

	// The bounds of the world
	var worldRect = { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight };

	var canvas;
	var context;
	var blobs = [];

	var dragBlob;

	var screenX = window.screenX;
	var screenY = window.screenY;

	var mouseX = worldRect.width*0.5;
	var mouseY = worldRect.height*0.5;
	var mouseIsDown = false;
	var mouseDownTime = 0;

	// The world gravity, applied to all blobs
	var gravity = { x: 0, y: 1.2 };

	// A pair of blobs that should be merged
	var mergeQueue = { blobA: -1, blobB: -1 };

	var skinIndex = 0;
	var skins = [
       { fillStyle: 'rgba(0,200,250,1.0)', strokeStyle: '#ffffff', lineWidth: 5, backgroundColor: '#222222', debug: false },
       { fillStyle: '', strokeStyle: '', lineWidth: 0, backgroundColor: '#222222', debug: true },
	   { fillStyle: 'rgba(0,0,0,0.1)', strokeStyle: 'rgba(255,255,255,1.0)', lineWidth: 6, backgroundColor: '#222222', debug: false },
       { fillStyle: 'rgba(255,60,60,1.0)', strokeStyle: 'rgba(0,0,0,1.0)', lineWidth: 2, backgroundColor: '#222222', debug: false },
       { fillStyle: 'rgba(255,255,0,1.0)', strokeStyle: 'rgba(0,0,0,1.0)', lineWidth: 4, backgroundColor: '#222222', debug: false },
       { fillStyle: 'rgba(255,255,255,1.0)', strokeStyle: 'rgba(0,0,0,1.0)', lineWidth: 4, backgroundColor: '#000000', debug: false },
       { fillStyle: 'rgba(0,0,0,1.0)', strokeStyle: 'rgba(0,0,0,1.0)', lineWidth: 4, backgroundColor: '#ffffff', debug: false }
	];

	this.init = function() {

		canvas = document.getElementById( 'world' );

		if (canvas && canvas.getContext) {
			context = canvas.getContext('2d');

			// Register event listeners
			document.addEventListener('mousemove', documentMouseMoveHandler, false);
			canvas.addEventListener('mousedown', documentMouseDownHandler, false);
			canvas.addEventListener('dblclick', documentDoubleClickHandler, false);
			document.addEventListener('mouseup', documentMouseUpHandler, false);
			document.addEventListener('keydown', documentKeyDownHandler, false);
			canvas.addEventListener('touchstart', documentTouchStartHandler, false);
			canvas.addEventListener('touchmove', documentTouchMoveHandler, false);
			canvas.addEventListener('touchend', documentTouchEndHandler, false);
			window.addEventListener('resize', windowResizeHandler, false);

			document.getElementById( 'keyboardUp' ).addEventListener('click', keyboardUpHandler, false);
			document.getElementById( 'keyboardDown' ).addEventListener('click', keyboardDownHandler, false);
			document.getElementById( 'keyboardLeft' ).addEventListener('click', keyboardLeftHandler, false);
			document.getElementById( 'keyboardRight' ).addEventListener('click', keyboardRightHandler, false);

			createBlob( { x: worldRect.width*0.15, y: worldRect.height*(Math.random()*0.2) }, { x: worldRect.width*0.011, y: 0 }, first_button );
			// createBlob( { x: worldRect.width*0.85, y: worldRect.height*(Math.random()*0.2) }, { x: -worldRect.width*0.011, y: 0 } );

			windowResizeHandler();

			setInterval( loop, 1000 / timeInterval );
		}
	};

	function createBlob( position, velocity, div ) {
		var blob = new Blob(div);

		blob.position.x = position.x;
		blob.position.y = position.y;

		blob.velocity.x = velocity.x;
		blob.velocity.y = velocity.y;

		blob.generateNodes();

		blobs.push( blob );
	}

	function splitBlob( blob ) {
		if( blob.quality > 8 ) {
			blobs.push( blob.split() );
		}
	}

	function mergeBlobs( blobA, blobB ) {
		var t = getTime();

		if( !blobs[blobA] || !blobs[blobB] ) {
			return;
		}

		if( t - blobs[blobA].lastSplitTime > 500 && t - blobs[blobB].lastSplitTime > 500 ) {
			// Merge blobB with blobA
			blobs[blobA].merge( blobs[blobB] );

			// If the blobB was being dragged, make sure the merged blob
			// continues to be
			if( dragBlob == blobs[blobB] && mouseIsDown ) {
				dragBlob = blobs[blobA];
			}

			// Remove blobB since blobA will take over its body
			blobs.splice( blobB, 1 );
		}
	}

	function documentMouseMoveHandler(event) {
		mouseX = event.clientX - (window.innerWidth - worldRect.width) * .5;
		mouseY = event.clientY - (window.innerHeight - worldRect.height) * .5;
	}

	function documentMouseDownHandler(event) {
		event.preventDefault();

		mouseIsDown = true;

		handleDoubleMouseDown();
	}

	function documentMouseUpHandler(event) {
		mouseIsDown = false;

		if( dragBlob ) {
			dragBlob.dragNodeIndex = -1;
			dragBlob = null;
		}
	}

	function documentTouchStartHandler(event) {
		if(event.touches.length == 1) {
			event.preventDefault();

			mouseIsDown = true;

			mouseX = event.touches[0].pageX - (window.innerWidth - worldRect.width) * .5;
			mouseY = event.touches[0].pageY - (window.innerHeight - worldRect.height) * .5;

			if (new Date().getTime() - mouseDownTime < 300) {
				handleDoubleClick();
			}
			else {
				handleDoubleMouseDown();
			}

			mouseDownTime = new Date().getTime();
		}
	}

	function documentTouchMoveHandler(event) {
		if(event.touches.length == 1) {
			event.preventDefault();

			mouseX = event.touches[0].pageX - (window.innerWidth - worldRect.width) * .5;
			mouseY = event.touches[0].pageY - (window.innerHeight - worldRect.height) * .5;
		}
	}

	function documentTouchEndHandler(event) {
		mouseIsDown = false;

		if( dragBlob ) {
			dragBlob.dragNodeIndex = -1;
			dragBlob = null;
		}
	}

	function documentDoubleClickHandler(event) {
		handleDoubleClick();
	}

	function handleDoubleMouseDown() {
		dragBlob = blobs[ findClosestBody( blobs, { x: mouseX, y: mouseY } ) ];
		dragBlob.dragNodeIndex = findClosestBody( dragBlob.nodes, { x: mouseX, y: mouseY } );
	}

	function handleDoubleClick() {
		var mouse = { x: mouseX, y: mouseY };

		var blob = blobs[findClosestBody( blobs, mouse )];

		if( distanceBetween( blob.position, mouse ) < blob.radius + 30 ) {
			splitBlob( blob );
		}
	}

	function documentKeyDownHandler(event) {
		switch( event.keyCode ) {
			case 40:
				changeBlobRadius( -10 );
				event.preventDefault();
				break;
			case 38:
				changeBlobRadius( 10 );
				event.preventDefault();
				break;
			case 37:
				changeSkin( -1 );
				event.preventDefault();
				break;
			case 39:
				changeSkin( 1 );
				event.preventDefault();
				break;
		}
	}

	function keyboardUpHandler(event) {
		changeBlobRadius( 20 );
    }

	function keyboardDownHandler(event) {
		changeBlobRadius( -20 );
	}

	function keyboardLeftHandler(event) {
		changeSkin( -1 );
	}

	function keyboardRightHandler(event) {
		changeSkin( 1 );
	}

	function changeSkin( offset ) {
		skinIndex += offset;
		skinIndex = skinIndex < 0 ? skins.length-1 : skinIndex;
		skinIndex = skinIndex > skins.length-1 ? 0 : skinIndex;

		document.body.style.backgroundColor = skins[skinIndex].backgroundColor;
	}

	function changeBlobRadius( offset ) {
		for( var i = 0, len = blobs.length; i < len; i++ ) {
			blob = blobs[i];

			var oldRadius = blob.radius;

			blob.radius += offset;
			blob.radius = Math.max( 40, Math.min( blob.radius, 280 ) );

			if( blob.radius != oldRadius ) {
				blob.updateNormals();
			}
		}
	}

	function findClosestBody( bodies, position ) {
		var closestDistance = 9999;
		var currentDistance = 9999;
		var closestIndex = -1;

		for( var i = 0, len = bodies.length; i < len; i++ ) {
			var body = bodies[i];

			currentDistance = distanceBetween( body.position, { x: position.x, y: position.y } );

			if( currentDistance < closestDistance ) {
				closestDistance = currentDistance;
				closestIndex = i;
			}
		}

		return closestIndex;
	}

	function windowResizeHandler() {
		worldRect.width = window.innerWidth;
		worldRect.height = window.innerHeight;

		canvas.width = worldRect.width;
		canvas.height = worldRect.height;

		worldRect.x = 3;
		worldRect.y = 3;
		worldRect.width = worldRect.width-6;
		worldRect.height = worldRect.height-6;

		paint();
	}

	function loop() {

		var u1, u2, ulen, blob;

		// // If there is a merge queued, solve it now
		// if( mergeQueue.blobA != -1 && mergeQueue.blobB != -1 ) {
		// 	mergeBlobs( mergeQueue.blobA, mergeQueue.blobB );

		// 	mergeQueue.blobA = -1;
		// 	mergeQueue.blobB = -1;
		// }

		// // If the mouse is down, start adding the velocity needed to move
		// // towards the mouse position
		// if( dragBlob ) {
		// 	dragBlob.velocity.x += ( ( mouseX ) - dragBlob.position.x ) * 0.01;
		// 	dragBlob.velocity.y += ( ( mouseY + 100 ) - dragBlob.position.y ) * 0.01;
		// }

		for( u1 = 0, ulen = blobs.length; u1 < ulen; u1++ ) {
			blob = blobs[u1];
            let check_rect = blob.gravityCenter.getBoundingClientRect();
            let rect = blob.rect;
            if(rect.height != check_rect.height 
                || rect.width != check_rect.width 
                || rect.top != check_rect.top 
                || rect.left != check_rect.left){
                console.log("changed rect")
                // console.log("old ", blob.rect, "new ", rect);
                blob.rect = check_rect;
                blob.generateNodes();
            }
            let x_pos = rect.x + rect.width / 2;
            let y_pos = rect.y + rect.height / 2;
            blob.velocity.x += (x_pos - blob.position.x) * 0.03;
            blob.velocity.y += (y_pos - blob.position.y) * 0.03;

			// Check if this blob should be merged with any other blob
			for( u2 = 0; u2 < ulen; u2++ ) {
				var otherBlob = blobs[u2];

				if( otherBlob != blob ) {
					var distance = distanceBetween( { x: blob.position.x, y: blob.position.y }, { x: otherBlob.position.x, y: otherBlob.position.y } );

					if( distance < blob.radius + otherBlob.radius ) {
						mergeQueue.blobA = blob.position.x > otherBlob.position.x ? u1 : u2;
						mergeQueue.blobB = blob.position.x > otherBlob.position.x ? u2 : u1;
					}
				}
			}

			// Track window movement
			// blob.velocity.x += ( window.screenX - screenX ) * (0.04 + (Math.random()*0.1));
			// blob.velocity.y += ( window.screenY - screenY ) * (0.04 + (Math.random()*0.1));

			var friction = { x: 1.035, y: 1.035 };

			// Enforce horizontal world bounds
			if( blob.position.x > worldRect.x + worldRect.width ) {
				blob.velocity.x -= ( blob.position.x - worldRect.width ) * 0.04;
				friction.y += 0.035;
			}
			else if( blob.position.x < worldRect.x ) {
				blob.velocity.x += Math.abs( worldRect.x - blob.position.x ) * 0.04;
				friction.y += 0.035;
			}

			// Enforce vertical world bounds
			if( blob.position.y+(blob.radius*0.25) > worldRect.y + worldRect.height ) {
				blob.velocity.y -= ( blob.position.y+(blob.radius*0.25) - worldRect.height ) * 0.04;
				friction.x += 0.015;
			}
			else if( blob.position.y < worldRect.y ) {
				blob.velocity.y += Math.abs( worldRect.y - blob.position.y ) * 0.04;
				friction.x += 0.015;
			}

			// Gravity
			blob.velocity.x += gravity.x;
			blob.velocity.y += gravity.y;

			// Friction
			blob.velocity.x /= friction.x;
			blob.velocity.y /= friction.y;

			// Apply the velocity to the entire blob
			blob.position.x += blob.velocity.x;
			blob.position.y += blob.velocity.y;

			var i, j, len, node, joint, position;

			// Update all node ghosts (previous positions). All nodes need to be in sync
			// before the below calculation loop to avoid tearing between the end nodes
			for (i = 0, len = blob.nodes.length; i < len; i++) {
				node = blob.nodes[i];

				node.ghost.x = node.position.x;
				node.ghost.y = node.position.y;
			}

			var dragNode = blob.nodes[blob.dragNodeIndex];
			if( dragNode ) {
				blob.rotation.target = Math.atan2( mouseY - blob.position.y - ( blob.radius * 4 ), mouseX - blob.position.x ); // Get angle between blob & mouse
				blob.rotation.current += ( blob.rotation.target - blob.rotation.current ) * 0.2;

				blob.updateNormals();
			}

			// Calculation loop
			for (i = 0, len = blob.nodes.length; i < len; i++) {
				node = blob.nodes[i];

				// Move towards the normal target
				node.normal.x += ( node.normalTarget.x - node.normal.x ) * 0.05;
				node.normal.y += ( node.normalTarget.y - node.normal.y ) * 0.05;

				// This point will be used as the new position for this node,
				// after all factors have been applied
				position = { x: blob.position.x, y: blob.position.y };

				// Apply the joints
				for( j = 0; j < node.joints.length; j++ ) {
					joint = node.joints[j];

					// Determine the strain on the joints
					var strainX = ( (joint.node.ghost.x - node.ghost.x) - (joint.node.normal.x - node.normal.x) );
					var strainY = ( (joint.node.ghost.y - node.ghost.y) - (joint.node.normal.y - node.normal.y) );

					joint.strain.x += ( strainX - joint.strain.x ) * 0.3;
					joint.strain.y += ( strainY - joint.strain.y ) * 0.3;

					position.x += joint.strain.x * joint.strength;
					position.y += joint.strain.y * joint.strength;
				}

				// Offset by the normal
				position.x += node.normal.x;
				position.y += node.normal.y;

				// Previous and next drag node index
				var pdni = getArrayIndexByOffset( blob.nodes, blob.dragNodeIndex, -1 );
				var ndni = getArrayIndexByOffset( blob.nodes, blob.dragNodeIndex, 1 );

				// Apply the drag offset (if applicable)
				if( blob.dragNodeIndex != -1 && ( i == blob.dragNodeIndex || ( blob.nodes.length > 8 && ( i == pdni || i == ndni ) ) ) ) {
					var ps = i == blob.dragNodeIndex ? 0.7 : 0.5;

					position.x += ( mouseX - position.x ) * ps;
					position.y += ( mouseY - position.y ) * ps;
				}

				// Apply the calculated position to the node (with easing)
				node.position.x += ( position.x - node.position.x ) * 0.1;
				node.position.y += ( position.y - node.position.y ) * 0.1;

				// Limit the node position to screen bounds
                if (getTime() - blob.BoundTime > 1500) {
                    // console.log(getTime());
                    node.position.x = Math.max( Math.min( node.position.x, rect.x + rect.width ), rect.x );
                    node.position.y = Math.max( Math.min( node.position.y, rect.y + rect.height ), rect.y - 100 );
                    // console.log("enforced")
                    // blob.enforcedCNT += 1;
                    // blob.wasEnforced = true;
                }
				// Expand the dirty rect if needed
				blob.dirtyRegion.inflate( node.position.x, node.position.y );
			}
		}

		paint();

		screenX = window.screenX;
		screenY = window.screenY;
	}

	function paint() {

		var skin = skins[skinIndex];

		// The area around the dirty region to include in the clear
		var dirtySpread = 80;

		var u1, u2, ulen, blob;
        context.clearRect(0,0,canvas.width, canvas.height);
		// // Clear the dirty rects of all blobs
		// for( u1 = 0, ulen = blobs.length; u1 < ulen; u1++ ) {
		// 	blob = blobs[u1];

		// 	// Clear all pixels in the dirty region
		// 	context.clearRect(blob.dirtyRegion.left-dirtySpread,blob.dirtyRegion.top-dirtySpread,blob.dirtyRegion.right-blob.dirtyRegion.left+(dirtySpread*2),blob.dirtyRegion.bottom-blob.dirtyRegion.top+(dirtySpread*2));

		// 	// Reset the dirty region so that it can be expanded anew
		// 	blob.dirtyRegion.reset();
		// }

		for( u1 = 0, ulen = blobs.length; u1 < ulen; u1++ ) {
			blob = blobs[u1];

			var i, j, len, joint;

			if( !skin.debug ) {
		   		context.beginPath();
				context.fillStyle = skin.fillStyle;
				context.strokeStyle = skin.strokeStyle;
				context.lineWidth = skin.lineWidth;
			}

			var cn = getArrayElementByOffset( blob.nodes, 0, -1 ); // current node
			var nn = getArrayElementByOffset( blob.nodes, 0, 0 ); // next node

			// Move to the first anchor
			context.moveTo( cn.position.x + ( nn.position.x - cn.position.x ) / 2, cn.position.y + ( nn.position.y - cn.position.y ) / 2 );

			// Rendering loop
			for (i = 0, len = blob.nodes.length; i < len; i++ ) {

				cn = getArrayElementByOffset( blob.nodes, i, 0 );
				nn = getArrayElementByOffset( blob.nodes, i, 1 );

				if( skin.debug ) {
					context.beginPath();
					context.lineWidth = 1;
					context.strokeStyle = "#ababab";

					for( j = 0; j < cn.joints.length; j++ ) {
						joint = cn.joints[j];
						context.moveTo( cn.position.x, cn.position.y );
						context.lineTo( joint.node.position.x, joint.node.position.y );
					}

					context.stroke();

					context.beginPath();
					context.fillStyle = i == 0 ? "#00ff00" : (i == blob.dragNodeIndex ? "ff0000" : "#dddddd" );
					context.arc(cn.position.x, cn.position.y, 5, 0, Math.PI*2, true);
					context.fill();
				}
				else {
					context.quadraticCurveTo( cn.position.x, cn.position.y, cn.position.x + ( nn.position.x - cn.position.x ) / 2, cn.position.y + ( nn.position.y - cn.position.y ) / 2 );
				}
			}

			// Dirty regions
			if( skin.debug ) {
				// context.beginPath();
				// context.fillStyle = "rgba(100,255,100,0.3)";
				// context.fillRect(blob.dirtyRegion.left-dirtySpread,blob.dirtyRegion.top-dirtySpread,blob.dirtyRegion.right-blob.dirtyRegion.left+(dirtySpread*2),blob.dirtyRegion.bottom-blob.dirtyRegion.top+(dirtySpread*2));
				// context.fill();
			}

			context.stroke();
			context.fill();
		}
	}


};


function Region() {
	this.left = 999999;
	this.top = 999999;
	this.right = 0;
	this.bottom = 0;
}
Region.prototype.reset = function() {
	this.left = 999999;
	this.top = 999999;
	this.right = 0;
	this.bottom = 0;
};
Region.prototype.inflate = function( x, y ) {
	this.left = Math.min(this.left, x);
	this.top = Math.min(this.top, y);
	this.right = Math.max(this.right, x);
	this.bottom = Math.max(this.bottom, y);
};

function Blob(div) {
	this.position = { x: 0, y: 0 };
	this.velocity = { x: 0, y: 0 };
	// this.radius = 85;
	this.nodes = [];
	this.rotation = { current: 0, target: 0 };

//	this.rotation = { current: -Math.PI*0.5, target: -Math.PI*0.5 };

	this.dragNodeIndex = -1;
	this.lastSplitTime = 0;
	this.quality = 10;

	this.dirtyRegion = new Region();
    this.BoundTime = getTime();
    this.enforcedCNT = 0;
    this.gravityCenter = div;
    this.rect = div.getBoundingClientRect();
    // console.log(this.rect)
    this.radius = 0;
}



Blob.prototype.generateNodes = function() {
	this.nodes = [];
    this.calcR();
    // console.log("new area is ", this.area, " new quality ", this.quality)
    this.quality = Math.floor(this.radius /10);
    console.log("new radius is ", this.radius, " new quality ", this.quality)
	var i, n;

	for (i = 0; i < this.quality; i++) {
		n = {
			normal: { x: 0, y: 0 },
			normalTarget: { x: 0, y: 0 },
			position: { x: this.position.x, y: this.position.y },
			ghost: { x: this.position.x, y: this.position.y },
			angle: 0
		};

		this.nodes.push( n );
	}

	this.updateJoints();
	this.updateNormals();
};

Blob.prototype.calcR = function() {
    let height = this.rect.height;
    let width = this.rect.width;
    let area = height * width;
    this.radius = Math.sqrt(area*2 / Math.PI);
    console.log("area is ", area, " and radius is ", this.radius);
}

Blob.prototype.updateJoints = function() {
	var s = 0.4;

	for (var i = 0; i < this.quality; i++) {
		var n = this.nodes[i];

		n.joints = [];

		n.joints.push( new Joint( getArrayElementByOffset( this.nodes, i, -1 ), s ) );
		n.joints.push( new Joint( getArrayElementByOffset( this.nodes, i, 1 ), s ) );

		if( this.quality > 4 ) {
			n.joints.push( new Joint( getArrayElementByOffset( this.nodes, i, -2 ), s ) );
			n.joints.push( new Joint( getArrayElementByOffset( this.nodes, i, 2 ), s ) );
		}

		if( this.quality > 8 ) {
			n.joints.push( new Joint( getArrayElementByOffset( this.nodes, i, -3 ), s ) );
			n.joints.push( new Joint( getArrayElementByOffset( this.nodes, i, 3 ), s ) );
		}
	}
};

Blob.prototype.updateNormals = function() {
	var i, j, n;

	for (i = 0; i < this.quality; i++) {

		var n = this.nodes[i];

		// TODO: Fix the not very pretty solution below.

		if( this.dragNodeIndex != -1 ) {
			j = i - Math.round(this.dragNodeIndex);
			j = j < 0 ? this.quality + j : j;
		}
		else {
			j = i;
		}

		n.angle = ( ( j / this.quality ) * Math.PI * 2 ) + this.rotation.target;

		n.normalTarget.x = Math.cos( n.angle ) * this.radius;
		n.normalTarget.y = Math.sin( n.angle ) * this.radius;

		if( n.normal.x == 0 && n.normal.y == 0 ) {
			n.normal.x = n.normalTarget.x;
			n.normal.y = n.normalTarget.y;
		}
	}
};

Blob.prototype.split = function() {

	var velocitySpread = this.radius / 10;
	var nodeSpread = Math.round( this.nodes.length * 0.5 );
	var radiusSpread = this.radius * 0.5;

	var sibling = new Blob();

	sibling.position.x = this.position.x;
	sibling.position.y = this.position.y;

	sibling.nodes = [];

	var i = 0;
	while( i++ < nodeSpread ) {
		sibling.nodes.push( this.nodes.shift() );
	}

	var thisCombinedX = 0;
	var siblingCombinedX = 0;

	for( i = 0; i < this.nodes.length; i++ ) {
		thisCombinedX += this.nodes[i].position.x;
	}
	for( i = 0; i < sibling.nodes.length; i++ ) {
		siblingCombinedX += sibling.nodes[i].position.x;
	}

	sibling.velocity.x = siblingCombinedX > thisCombinedX ? velocitySpread : -velocitySpread;
	sibling.velocity.y = this.velocity.y;

	sibling.radius = radiusSpread;
	sibling.quality = sibling.nodes.length;

	this.velocity.x = thisCombinedX > siblingCombinedX ? velocitySpread : -velocitySpread;
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

Blob.prototype.merge = function( sibling ) {
	this.velocity.x *= 0.5;
	this.velocity.y *= 0.5;

	this.velocity.x += sibling.velocity.x * 0.5;
	this.velocity.y += sibling.velocity.y * 0.5;

	while( sibling.nodes.length ) {
		this.nodes.push( sibling.nodes.shift() );
	}

	this.quality = this.nodes.length;
	this.radius += sibling.radius;

	this.dragNodeIndex = sibling.dragNodeIndex != -1 ? sibling.dragNodeIndex : this.dragNodeIndex;

	this.updateNormals();
	this.updateJoints();
};

function Joint( node, strength ) {
	this.node = node;
	this.strength = strength;
	this.strain = { x: 0, y: 0 };
}

function getArrayIndexByOffset( array, index, offset ) {
	if( array[index+offset] ) {
		return index+offset;
	}

	if( index+offset > array.length-1 ) {
		return index - array.length + offset;
	}

	if( index+offset < 0 ) {
		return array.length + ( index + offset );
	}
}

function getArrayElementByOffset( array, index, offset ) {
	return array[getArrayIndexByOffset( array, index, offset )];
}

function getTime() {
	return new Date().getTime();
}

function distanceBetween(p1,p2) {
	var dx = p2.x-p1.x;
	var dy = p2.y-p1.y;
	return Math.sqrt(dx*dx + dy*dy);
}


BlobWorld.init();



var taskContainer = document.querySelector(".content");
var tasks = JSON.parse(localStorage.getItem("tasks"))
var len = 0;
var newButton;

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

// console.log(first_button.getBoundingClientRect())
// console.log(taskContainer)



// initially renders all robots
// renderRobotTiles(currentRobots);

// const submitButton = document.getElementById("submitButton");
const taskForm = document.querySelector(".form#tasks")
const groupForm = document.querySelector(".form#groups")
const submitButton = document.getElementById("submitButton")
const Name = document.getElementById("task_name");
const Desc = document.getElementById("desc");
const Priority = document.getElementById("priorities");
const dueDate = document.getElementById("due_date");
const dialog = document.querySelector(".chooseType");
const newGroupBtn = document.getElementById("newGroup");
const newTaskBtn = document.getElementById("newTask");
const groupName = document.getElementById("group_name");
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

first_button.addEventListener('click', openChildren);

function openChildren() {
    this.style["top"] = "10%";
    this.style["width"] = "80%";
    var newDiv = document.createElement("div");
    newDiv.innerHTML = `
        <button class="newButton"><span>&#x2B;</span></button>`
    newDiv.className = "new";
    // newDiv.id = len;
    newButton = newDiv.firstElementChild;
    newButton.addEventListener("click", openDialog);
    taskContainer.append(newDiv);
    // if (tasks !== null) {

    // }
}

function openDialog() {
    dialog.style["opacity"] = "1";
    newGroupBtn.addEventListener('click', newGroup);
    newTaskBtn.addEventListener('click', newTask);
}

function newGroup() {
    dialog.style["opacity"] = "0";
    newGroupBtn.removeEventListener('click', newGroup);
    newTaskBtn.removeEventListener('click', newTask);
    groupForm.style["opacity"] = "1";
    groupForm.addEventListener('submit',  addGroup)
    groupForm.style["opacity"] = "1";
    groupForm.removeEventListener('submit', addGroup);
}

function addGroup(event) {
    event.preventDefault();
    if (groupName.value !== '') {
        let groupJson = {
            type: "group",
            name: `${Name.value}`,
            children: []
        }
        tasks.push(groupJson);
        localStorage.setItem("tasks", JSON.stringify(tasks))
        const newTask = document.createElement("div");
        newTask.innerHTML = `
                <button class="deleteButton" id="${len}"><span>&#xD7;</span></button>
                <h1 class="tile-name">${groupName.value}</h1>`;
        newTask.className = "group";
        newTask.id = len;
        // let del = newTask.firstElementChild;
        // del.addEventListener("click", deleteTask);
        taskContainer.append(newTask);
        len++;
        taskForm.reset();
    }
};

function newTask() {dialog.style["opacity"] = "0";
    newGroupBtn.removeEventListener('click', newGroup);
    newTaskBtn.removeEventListener('click', newTask);
    taskForm.style["opacity"] = "1";
    taskForm.addEventListener('submit', addTask);
    taskForm.style["opacity"] = "1";
    taskForm.removeEventListener('submit', addTask);
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
            <button class="deleteButton" id="${len}"><span>&#xD7;</span></button>
            <h1 class="tile-name">${Name.value}</h1>
            <p class="tile-desc">${Desc.value}</p>
            <h2 class="tile-priority">Priority:${Priority.value}</h2>
            <div class="tile-due">Due date:${dueDate.value}</div>`;
        newTask.className = "task";
        newTask.id = len;
        let del = newTask.firstElementChild;
        del.addEventListener("click", deleteTask);
        taskContainer.append(newTask);
        len++;
        // taskForm.reset();
    }
    return false;
}

backButton.addEventListener('click', close);

function close() {

}