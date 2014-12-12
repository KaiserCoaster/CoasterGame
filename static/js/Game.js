var Game = function() {

	$game = this;
	
	this.running = false;

	this.baseURL = 'http://mkaiser.io/projects/coaster/';
	
	this.player;
	
	this.viewport;
	
	this.IO;
	
	this.map;
	
	this.update = function() {
		$game.IO.process($game.viewport);
	}
	
	this.render = function() {
		$game.viewport.wipe();
		$game.map.render($game.viewport);
		$game.framecounter.render($game.viewport);
		$game.viewport.renderGUI();
	}
	
	this.framecounter;
	this.loopInterval;
	this.loop = function() {
		$game.running = true;
		$game.framesTime = new Date().getTime();
		console.log("Starting game loop.");
		$game.loopInterval = window.setInterval(function() { $game.loopLogic(); }, 0);
	}
	this.r = {
		ups: 60,
		skipTicks: 1000 / 60,
		nextTick: (new Date).getTime(),
		maxFrameSkip: 10,
		updates: 0,
	}
	this.loopLogic = function() {
		$game.r.updates = 0;
		while((new Date).getTime() > $game.r.nextTick && $game.r.updates < $game.r.maxFrameSkip) {
			$game.update();
			$game.r.nextTick += $game.r.skipTicks;
			$game.r.updates++;
			$game.framecounter.tick();
		}
		$game.render();
		$game.framecounter.frame();
	}
	this.stop = function() {
		$game.running = false;
		clearInterval($game.loopInterval);
		console.log("Game loop stopped.");
	}
	
	this.start = function() {
		$game.loop();
	}
	
	this.init = function() {
		$game.player = new Player();
		$game.player.login();
		$game.viewport = new Viewport();
		$game.map = new Map();
		$game.framecounter = new FrameCounter();
		$game.IO = new IO();
	}

};