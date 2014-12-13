var Train = function(x, y) {
	this.onTile = new Vector(x, y);
	this.offset = new Vector(16, 0);
	this.angle = 0;
	this.speed = 20;
	this.tile = Tile.tiles[960];
	this.tileProgression=0;
};

Train.prototype.render = function(viewport) {
	var scaledTile = viewport.scale * Tile.tileSize;
	var ctr = new Vector(viewport.width/2, viewport.height/2);
	viewport.ctx.save(); 
	viewport.ctx.translate(	ctr.x - viewport.offset.x + (this.onTile.x * scaledTile) + (this.offset.x * viewport.scale),
							ctr.y - viewport.offset.y + (this.onTile.y * scaledTile) + (this.offset.y * viewport.scale)
	); 
	viewport.ctx.rotate(this.angle); 
	this.tile.render(viewport, -(this.tile.size * viewport.scale)/2, -(this.tile.size * viewport.scale)/2);
	viewport.ctx.restore();
};

Train.prototype.progress = function() {
	//this.angle = 0;
	this.offset.y = 16;
	//this.offset.x++;
	if(this.offset.x >= Tile.tileSize) {
		this.offset.x = 0;
		this.onTile.x++;
	}
};