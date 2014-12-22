var Viewport = function() {
	this.canvas;
	this.width;
	this.height;
	this.ctx;
	this.offset = new Vector(0, 0);
	this.movementSpeed = 15;
	this.scale = 2;
	this.gui = {
		crosshair: {
			length: 20,
			width: 2,
		},
		path: {
			rendering: false,
			lineColor: "#0F0",
			lineWidth: 2,
			nodeColor: "#0F0",
			nodeSize: 2,
		},
		selector: {
			lineColor: 'rgba(255,255,255,.3)',
			lineWidth: 0,
			lineScale: true,
			fillColor: 'rgba(255,255,255,.3)',
		}
	}
	this.init();
};

Viewport.prototype.init = function() {
	this.canvas = document.getElementById('game');
	this.width = window.innerWidth;
	this.height = window.innerHeight;
	this.ctx = this.canvas.getContext("2d");
	this.canvas.width = this.width;
	this.canvas.height = this.height;
	this.offset.set(this.width/2, this.height/2);
	this.ctx.imageSmoothingEnabled = false;
	console.log("Viewport initialized.");
};

Viewport.prototype.moveUp = function(delta) {
	delta = typeof genSize !== 'undefined' ?  delta : this.movementSpeed;
	this.offset.y = Math.max(0, this.offset.y - delta);
};

Viewport.prototype.moveLeft = function(delta) {
	delta = typeof genSize !== 'undefined' ?  delta : this.movementSpeed;
	this.offset.x = Math.max(0, this.offset.x - delta);
};

Viewport.prototype.moveRight = function(delta) {
	delta = typeof genSize !== 'undefined' ?  delta : this.movementSpeed;
	this.offset.x = Math.max(0, this.offset.x + delta);
};

Viewport.prototype.moveDown = function(delta) {
	delta = typeof genSize !== 'undefined' ?  delta : this.movementSpeed;
	this.offset.y = Math.max(0, this.offset.y + delta);
};

Viewport.prototype.wipe = function() {
	this.ctx.fillStyle="black";
	this.ctx.fillRect (0, 0, this.width, this.height);
};

Viewport.prototype.renderGUI = function() {
	
	// Crosshairs
	var ctr = new Vector(this.width / 2, this.height / 2);
	this.ctx.fillStyle = 'black';
	// Horizontal line
	this.ctx.fillRect(	ctr.x - this.gui.crosshair.length/2,
						ctr.y - this.gui.crosshair.width/2,
						this.gui.crosshair.length,
						this.gui.crosshair.width);
	// Vertical Line
	this.ctx.fillRect(	ctr.x - this.gui.crosshair.width/2,
						ctr.y - this.gui.crosshair.length/2,
						this.gui.crosshair.width,
						this.gui.crosshair.length);
};

//Viewport.prototype.view