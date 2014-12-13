var FrameCounter = function() {
	this.frames = 0;
	this.ticks = 0;
	this.lastUpdate = new Date().getTime();
	this.ellapsed = 0;
	this.fps = 0;
	this.ups = 0;
	this.now = 0;
	this.updateFrequency = 1000;
	console.log("Frame Counter started");
};

FrameCounter.prototype.tick = function() {
	this.ticks++;
	this.update();
};

FrameCounter.prototype.frame = function() {
	this.frames++;
};

FrameCounter.prototype.update = function() {
	this.now = new Date().getTime();
	this.ellapsed = this.now - this.lastUpdate;
	if(this.ellapsed > this.updateFrequency) {
		this.fps = parseInt((this.frames * 1000 / this.ellapsed), 10);
		this.ups = parseInt((this.ticks * 1000 / this.ellapsed), 10);
		this.frames = 0;
		this.ticks = 0;
		this.lastUpdate = this.now;
	}
};

FrameCounter.prototype.render = function(viewport) {
	viewport.ctx.font="14px Arial";
	viewport.ctx.fillText(this.ups + " ups - " + this.fps + " fps", 10, viewport.height - 20);
};