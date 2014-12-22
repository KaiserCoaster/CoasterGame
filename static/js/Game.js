/**
 * Game Object and Initialization.
 *
 * @author Matthew Kaiser
 * @url http://mkaiser.io
 */


/** 
 * @constructor
 * @desc An game instance.
 */ 
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


/** 
 * @desc Game Update Tick, called 60 times per second.
 */  
Game.prototype.update = function() {
	this.IO.process(this.viewport);
	this.map.update();
};


/** 
 * @desc Game render/draw.
 */  
Game.prototype.render = function() {
	this.viewport.wipe();
	this.map.render(this.viewport);
	this.framecounter.render(this.viewport);
	this.viewport.renderGUI();
};


/** 
 * @desc The game loop. 
 */ 
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


/** 
 * @desc Starts game loop.
 */ 
Game.prototype.start = function() {
	this.running = true;
	console.log("Starting game loop.");
	this.r.nextTick = (new Date).getTime();
	this.intervalID = window.setInterval(function() { $game.loop(); }, 0);
};


/** 
 * @desc Stops game loop.
 */ 
Game.prototype.stop = function() {
	this.running = false;
	clearInterval(this.intervalID);
	console.log("Game loop stopped.");
};


/** 
 * @desc Initializes game objects and game state.
 */ 
Game.prototype.init = function() {
	this.player = new Player();
	this.player.login();
	this.viewport = new Viewport();
	this.map = new Map();
	this.framecounter = new FrameCounter();
	this.IO = new IO();
	var placeable = [0, 992, 993, 994, 995, 996, 997, 998, 1000, 1001, 1002, 1003];
	for(t in placeable) {
		var tid = placeable[t];
		var tt = $("<li />")
			.data('tile',tid)
			.data('name',Tile.tiles[tid].name)
			.css({	'background-image': 'url(static/images/tileset.png)',
					'background-position': '-' + (Tile.tiles[tid].setPos.x * Tile.tileSize) + 'px -' + (Tile.tiles[tid].setPos.y * Tile.tileSize) + 'px',
			}
		);
		$("#tilePicker").append(tt);
	}
};

