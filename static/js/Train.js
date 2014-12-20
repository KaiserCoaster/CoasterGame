var Train = function(x, y) {
	this.angle = 2 * Math.PI;
	this.speed = 20;
	this.tile = Tile.tiles[Tile.NAMES.TRAIN];
	this.position = new Vector( (x*Tile.tileSize)+16, (y*Tile.tileSize)+16 );
};

Train.prototype.render = function(viewport) {
	var scaledTile = viewport.scale * Tile.tileSize;
	var ctr = new Vector(viewport.width/2, viewport.height/2);
	viewport.ctx.save(); 
	viewport.ctx.translate(	Math.ceil(ctr.x - viewport.offset.x + (this.position.x * viewport.scale)),
							Math.ceil(ctr.y - viewport.offset.y + (this.position.y * viewport.scale))
	); 
	viewport.ctx.rotate(this.angle); 
	this.tile.render(viewport, -(this.tile.size * viewport.scale)/2, -(this.tile.size * viewport.scale)/2);
	viewport.ctx.restore();
};