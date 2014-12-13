var Game = function() {

	$game = this;
	
	this.running = false;

	this.baseURL = 'http://mkaiser.io/projects/coaster/';
	
	this.player;
	
	this.viewport;
	
	this.IO;
	
	this.map;
	
	this.framecounter;
	
	this.intervalID;
	
	this.r = {
		ups: 60,
		skipTicks: 1000 / 60,
		nextTick: 0,
		maxFrameSkip: 10,
		updates: 0,
	}
	
};
	
Game.prototype.update = function() {
	this.IO.process(this.viewport);
	this.map.update();
};
	
Game.prototype.render = function() {
	this.viewport.wipe();
	this.map.render(this.viewport);
	this.framecounter.render(this.viewport);
	this.viewport.renderGUI();
};

Game.prototype.loop = function() {
	this.r.updates = 0;
	while((new Date).getTime() > this.r.nextTick && this.r.updates < this.r.maxFrameSkip) {
		this.update();
		this.r.nextTick += this.r.skipTicks;
		this.r.updates++;
		this.framecounter.tick();
	}
	this.render();
	this.framecounter.frame();
};

Game.prototype.start = function() {
	this.running = true;
	console.log("Starting game loop.");
	this.r.nextTick = (new Date).getTime();
	this.intervalID = window.setInterval(function() { $game.loop(); }, 0);
};

Game.prototype.stop = function() {
	this.running = false;
	clearInterval(this.intervalID);
	console.log("Game loop stopped.");
};

Game.prototype.init = function() {
	this.player = new Player();
	this.player.login();
	this.viewport = new Viewport();
	this.map = new Map();
	this.framecounter = new FrameCounter();
	this.IO = new IO();
};

