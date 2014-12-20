var IO = function() {
	IO.mousePos = new Vector(100, 100);
	this.startListeners();
	console.log("IO listeners started.");
};

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

IO.keyStates = [];

IO.mousePos;

IO.mouseDistance = 20;


IO.prototype.startListeners = function() {
	document.addEventListener("mousewheel", this.mousewheel);
	document.addEventListener("keydown", this.key);
	document.addEventListener("keyup", this.key);
	//document.addEventListener("mousemove", this.mouse)
};

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

IO.prototype.key = function(e) {
    e = e || window.event;
    IO.keyStates[e.keyCode] = (e.type == 'keydown');
    e.preventDefault();
};

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
}

IO.prototype.process = function(viewport) {
	
	// Process key presses
	if (IO.keyStates[IO.KEYS.UP])
		viewport.moveUp();
	else if (IO.keyStates[IO.KEYS.DOWN]) 
		viewport.moveDown();
	if (IO.keyStates[IO.KEYS.LEFT]) 
		viewport.moveLeft();
	else if (IO.keyStates[IO.KEYS.RIGHT])
		viewport.moveRight();
		
	// Process mouse offset movements
	if(IO.mousePos.y >= 0 && IO.mousePos.y <= IO.mouseDistance)
		viewport.moveUp();
	else if(IO.mousePos.y >= (viewport.height - IO.mouseDistance) && IO.mousePos.y <= viewport.height)
		viewport.moveDown();
	else if(IO.mousePos.x >= 0 && IO.mousePos.x <= IO.mouseDistance)
		viewport.moveLeft();
	else if(IO.mousePos.x >= (viewport.width - IO.mouseDistance) && IO.mousePos.x <= viewport.width)
		viewport.moveRight();
	
};