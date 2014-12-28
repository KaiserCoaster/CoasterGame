/**
 * IO (Input/Output) handles keyboard and mouse actions.
 *
 * @author Matthew Kaiser
 * @url http://mkaiser.io
 */
 
 
/** 
 * @constructor
 * @desc IO Object.
 */ 
var IO = function() {
	// Init mouse position to 100,100
	IO.mousePos = V(100, 100);
	// Start key and mouse listeners
	this.startListeners();
	console.log("IO listeners started.");
};


// ENUM mapping keyboard keys/names to their event IDs.
IO.KEYS = {
	UP: 38,
	DOWN: 40,
	LEFT: 37,
	RIGHT: 39,
	W: 87,
	A: 65,
	S: 83,
	D: 68,
}

// Stores state of each key. (True if held down, false otherwise).
IO.keyStates = [];

// Vector holding mouse position within window.
IO.mousePos;

// For moving the map using the mouse. This is the width of the border area near the screen edges that causes the map to move.
IO.mouseDistance = 20;


/**
 * @desc Initiates event listeners for keyboard and mouse.
 */
IO.prototype.startListeners = function() {
	document.addEventListener("mousewheel", this.mousewheel);
	document.addEventListener("keydown", this.key);
	document.addEventListener("keyup", this.key);
	document.addEventListener("mousemove", this.mouse)
};


/**
 * @desc Event handler for mousewheel. Scrolling causes map to zoom.
 * @param Event e - the event information.
 */
IO.prototype.mousewheel = function(e) {
	var e = window.event || e;
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
	var oldScale = $game.viewport.scale;
	var proposedScale = ($game.viewport.scale * 10) + (-1 * delta);
	$game.viewport.scale = Math.max(5, Math.min(40, proposedScale)) / 10;
	var scalePercentage = $game.viewport.scale / oldScale;
	$game.viewport.offset.x = Math.floor($game.viewport.offset.x * scalePercentage);
	$game.viewport.offset.y = Math.floor($game.viewport.offset.y * scalePercentage);
	/*console.log(	"delta: " + delta + 
					"; oldScale: " + oldScale +
					"; proposedScale: " + proposedScale + 
					"; newScale: " + $game.viewport.scale +
					"; scalePercentage: " +scalePercentage);*/
	e.preventDefault();
};


/**
 * @desc Event handler for key presses. Updates state in keyState array. (true = down, false = up)
 * @param Event e - the event information.
 */
IO.prototype.key = function(e) {
    e = e || window.event;
    IO.keyStates[e.keyCode] = (e.type == 'keydown');
    e.preventDefault();
};


/**
 * @desc Event handler for mouse movement. Updates mousePos position.
 * @param Event e - the event information.
 */
IO.prototype.mouse = function(e) {
	var dot, eventDoc, doc, body, pageX, pageY;
	e = e || window.event; // IE-ism
	// If pageX/Y aren't available and clientX/Y are,
	// calculate pageX/Y - logic taken from jQuery.
	// (This is to support old IE)
	if (e.pageX == null && e.clientX != null) {
		eventDoc = (e.target && e.target.ownerDocument) || document;
		doc = eventDoc.documentElement;
		body = eventDoc.body;
		
		e.pageX = e.clientX +
			(doc && doc.scrollLeft || body && body.scrollLeft || 0) -
			(doc && doc.clientLeft || body && body.clientLeft || 0);
		e.pageY = e.clientY +
			(doc && doc.scrollTop  || body && body.scrollTop  || 0) -
			(doc && doc.clientTop  || body && body.clientTop  || 0 );
	}
	
	IO.mousePos.x = e.pageX;
	IO.mousePos.y = e.pageY;
};


/**
 * @desc Tick update to process the key presses.
 * @param Viewport viewport - Viewport object, used to move the map viewport offset via key presses.
 */
IO.prototype.process = function(viewport) {
	
	// Process key presses
	if (IO.keyStates[IO.KEYS.UP] || IO.keyStates[IO.KEYS.W])
		viewport.moveUp();
	else if (IO.keyStates[IO.KEYS.DOWN] || IO.keyStates[IO.KEYS.S]) 
		viewport.moveDown();
	if (IO.keyStates[IO.KEYS.LEFT] || IO.keyStates[IO.KEYS.A]) 
		viewport.moveLeft();
	else if (IO.keyStates[IO.KEYS.RIGHT] || IO.keyStates[IO.KEYS.D])
		viewport.moveRight();
		
	// Process mouse offset movements
	/*if(IO.mousePos.y >= 0 && IO.mousePos.y <= IO.mouseDistance)
		viewport.moveUp();
	else if(IO.mousePos.y >= (viewport.height - IO.mouseDistance) && IO.mousePos.y <= viewport.height)
		viewport.moveDown();
	else if(IO.mousePos.x >= 0 && IO.mousePos.x <= IO.mouseDistance)
		viewport.moveLeft();
	else if(IO.mousePos.x >= (viewport.width - IO.mouseDistance) && IO.mousePos.x <= viewport.width)
		viewport.moveRight();*/
	
};