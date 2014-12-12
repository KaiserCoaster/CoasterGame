var Game = function() {

	$game = this;
	
	this.running = false;

	this.baseURL = 'http://mkaiser.io/projects/coaster/';
	
	this.player;
	
	this.viewport;
	
	this.map;

	this.render = function() {
		$game.viewport.wipe();
		$game.map.render($game.viewport);
	}

	

	this.windowMovementSpeed = 20;
	this.keyStates = [];
	document.onkeydown = document.onkeyup = function(e) {
	    e = e || window.event;
	    $game.keyStates[e.keyCode] = e.type == 'keydown';
	    e.preventDefault();
	}
	this.keys = function() {
	    if (this.keyStates[38]) { // up arrow
	        $game.viewport.offsetY -= $game.viewport.movementSpeed;
	    }
	    else if (this.keyStates[40]) { // down arrow
	        $game.viewport.offsetY += $game.viewport.movementSpeed;
	    }
	    if (this.keyStates[37]) { // left arrow
	        $game.viewport.offsetX -= $game.viewport.movementSpeed;
	    }
	    else if (this.keyStates[39]) { // right arrow
	        $game.viewport.offsetX += $game.viewport.movementSpeed;
	    }
	    
	    if($game.viewport.offsetX < 0) $game.viewport.offsetX = 0;
	    if($game.viewport.offsetY < 0) $game.viewport.offsetY = 0;
	};

	this.loopInterval;
	this.loop = function() {
		$game.running = true;
		$game.framesTime = new Date().getTime();
		console.log("Starting game loop.");
		$game.loopInterval = window.setInterval(function() { $game.loopLogic(); }, 30);
	}
	this.loopLogic = function() {
		$game.keys();
		$game.render();
		$game.framecounter();
	}
	this.frames = 0;
	this.framesTime = 0;
	this.fps = 0;
	this.framecounter = function() {
		$game.frames++;
		if($game.frames >= 30) {
			now = new Date().getTime();
			ellapsed = (now - $game.framesTime) / 1000;
			$game.fps = parseInt(($game.frames / ellapsed), 10);
			$game.frames = 0;
			$game.framesTime = now;
		}
		$game.viewport.ctx.font="14px Arial";
		$game.viewport.ctx.fillText($game.fps + " fps",10, $game.viewport.height - 20);
	}
	this.stop = function() {
		$game.running = false;
		clearInterval($game.loopInterval);
		console.log("Game loop stopped.");
	}
	
	this.start = function() {
		$game.player = new Player();
		$game.player.login();
		$game.viewport = new Viewport();
		$game.map = new Map();
		$game.loop();
	}
	
	

};