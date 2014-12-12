var Viewport = function() {
	this.canvas;
	this.width;
	this.height;
	this.ctx;
	this.offsetY = 0;
	this.offsetX = 0;
	this.movementSpeed = 10;
	this.init();
};

Viewport.prototype.init = function() {
	this.canvas = document.getElementById('game');
	this.width = window.innerWidth;
	this.height = window.innerHeight;
	this.ctx = this.canvas.getContext("2d");
	this.canvas.width = this.width;
	this.canvas.height = this.height;
}

Viewport.prototype.wipe = function() {
	this.ctx.clearRect (0, 0, this.width, this.height);
}