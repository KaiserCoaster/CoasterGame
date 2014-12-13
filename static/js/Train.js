var Train = function(x, y) {
	this.onTile = new Vector(x, y);
	this.offset = new Vector(16, 16);
	this.angle = 2 * Math.PI;
	this.speed = 20;
	this.tile = Tile.tiles[Tile.NAMES.TRAIN];
	this.tileProgression=0;
};

Train.prototype.rotate = function(rad) {
	this.rotateTo(this.angle+rad);
};

Train.prototype.rotateTo = function(rad) {
	rad = rad % (2 * Math.PI);
	rad = rad == 0 ? (2 * Math.PI) : rad;
	this.angle = rad;
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
	var onTile = $game.map.mapObjects[this.onTile.y][this.onTile.x];
	
	switch(onTile) {
		case Tile.NAMES.TRACK_HORIZONTAL:
		case Tile.NAMES.STATION_HORIZONTAL:
			this.trackHorizontal();
			break;
		case Tile.NAMES.TRACK_VERTICAL:
		case Tile.NAMES.STATION_VERTICAL:
			this.trackVertical();
			break;
		case Tile.NAMES.TRACK_BOTTOM_LEFT:
			this.trackBottomLeft();
			break;
		case Tile.NAMES.TRACK_BOTTOM_RIGHT:
			this.trackBottomRight();
			break;
		case Tile.NAMES.TRACK_TOP_LEFT:
			this.trackTopLeft();
			break;
		case Tile.NAMES.TRACK_TOP_RIGHT:
			this.trackTopRight();
			break;
	}

};

Train.accuracy = function(actual, expected) {
	var error = (Math.abs((actual - expected) / expected) * 100);
	//console.log(error);
	if(error < 10)
		return true;
	else
		return false;
};

Train.prototype.trackHorizontal = function() {
	if(Train.accuracy(this.angle, 2 * Math.PI)) { // Moving Right
		this.rotateTo(0);
		this.offset.y = 16;
		this.offset.x++;
		if(this.offset.x >= Tile.tileSize) {
			this.offset.x = 0;
			this.onTile.x++;
		}
	}
	else if(Train.accuracy(this.angle, Math.PI)) { // Moving Left
		this.rotateTo(Math.PI);
		this.offset.y = 16;
		this.offset.x--;
		if(this.offset.x <= 0) {
			this.offset.x = 32;
			this.onTile.x--;
		}
	}
};

Train.prototype.trackVertical = function() {
	if(Train.accuracy(this.angle, Math.PI / 2)) { // Moving Down
		this.rotateTo(Math.PI / 2);
		this.offset.x = 16;
		this.offset.y++;
		if(this.offset.y >= Tile.tileSize) {
			this.offset.y = 0;
			this.onTile.y++;
		}
	}
	else if(Train.accuracy(this.angle, 3 * Math.PI / 2)) { // Moving Up
		this.rotateTo(3 * Math.PI / 2);
		this.offset.x = 16;
		this.offset.y--;
		if(this.offset.y <= 0) {
			this.offset.y = 32;
			this.onTile.y--;
		}
	}
};

Train.prototype.trackBottomLeft = function() {
	this.rotateTo(Math.PI / 2);
	this.offset.y++
	this.offset.x++;
	if(this.offset.y >= Tile.tileSize) {
		this.rotateTo(Math.PI / 2);
		this.offset.y = 0;
		this.onTile.y++;
	}
};

Train.prototype.trackBottomRight = function() {
	this.rotateTo(0);
	this.offset.y--;
	this.offset.x++;
	if(this.offset.x >= Tile.tileSize) {
		this.offset.x = 0;
		this.onTile.x++;
	}
};

Train.prototype.trackTopLeft = function() {
	this.rotateTo(Math.toRad(180));
	this.offset.y++
	this.offset.x--;
	if(this.offset.x < 0) {
		this.offset.x = 32;
		this.onTile.x--;
	}
};

Train.prototype.trackTopRight = function() {
	this.rotateTo(Math.toRad(270));
	this.offset.y--
	this.offset.x--;
	if(this.offset.y < 0) {
		this.offset.y = 32;
		this.onTile.y--;
	}
};