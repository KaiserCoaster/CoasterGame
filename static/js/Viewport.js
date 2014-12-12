var Viewport = function() {
	this.canvas;
	this.width;
	this.height;
	this.ctx;
	this.offset = new Point(0, 0);
	this.movementSpeed = 15;
	this.scale = 2;
	this.gui = {
		crosshair: {
			length: 20,
			width: 2,
		},
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
	this.offset.set(this.height/2, this.width/2);
	this.ctx.imageSmoothingEnabled = false;
};

Viewport.prototype.wipe = function() {
	this.ctx.fillStyle="black";
	this.ctx.fillRect (0, 0, this.width, this.height);
};

Viewport.prototype.renderGUI = function() {
	
	// Crosshairs
	var ctr = new Point(this.height / 2, this.width / 2);
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