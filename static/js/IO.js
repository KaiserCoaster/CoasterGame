var IO = function() {
	this.startListeners();
	console.log("IO listeners started.");
};

IO.KEYS = {
	UP: 38,
	DOWN: 40,
	LEFT: 37,
	RIGHT: 39,
}

IO.keyStates = [];


IO.prototype.startListeners = function() {
	document.addEventListener("mousewheel", this.mousewheel);
	document.addEventListener("keydown", this.key);
	document.addEventListener("keyup", this.key);
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
	console.log(	"delta: " + delta + 
					"; oldScale: " + oldScale +
					"; proposedScale: " + proposedScale + 
					"; newScale: " + $game.viewport.scale +
					"; scalePercentage: " +scalePercentage);
	e.preventDefault();
};

IO.prototype.key = function(e) {
    e = e || window.event;
    IO.keyStates[e.keyCode] = (e.type == 'keydown');
    e.preventDefault();
};

IO.prototype.process = function(viewport) {
    if (IO.keyStates[IO.KEYS.UP])
	    viewport.offset.y = Math.max(0, viewport.offset.y - viewport.movementSpeed);
    else if (IO.keyStates[IO.KEYS.DOWN]) 
        viewport.offset.y = Math.max(0, viewport.offset.y + viewport.movementSpeed);
    if (IO.keyStates[IO.KEYS.LEFT]) 
        viewport.offset.x = Math.max(0, viewport.offset.x - viewport.movementSpeed);
    else if (IO.keyStates[IO.KEYS.RIGHT])
        viewport.offset.x = Math.max(0, viewport.offset.x + viewport.movementSpeed);
};