var Tile = function(name, y, x, size) {
	this.name = name;
	this.setPos = new Point(y, x);
	this.size =  typeof size !== 'undefined' ? size : 32;
};

Tile.tileSize = 32;

Tile.tileSet = new Image();
Tile.tileSet.src = 'static/images/tileset.png';

Tile.tiles = {
	0: 		new Tile('air', 				0, 	0),
	1: 		new Tile('grass', 				0, 	1),
	2: 		new Tile('dirt',				0,	2),
	3: 		new Tile('vertical path',		0,	3),

	992:	new Tile('vertical track',		31,	0),
	993:	new Tile('horizontal track',	31,	1),
	994:	new Tile('bottom right track',	31,	2),
	995:	new Tile('bottom left track',	31,	3),
	996:	new Tile('top left track',		31,	4),
	997:	new Tile('top right track',		31,	5),
};

Tile.prototype.tileY = function() {
	return this.setPos.y * this.size;
};

Tile.prototype.tileX = function() {
	return this.setPos.x * this.size;
};

Tile.prototype.render = function(viewport, cY, cX) {
	viewport.ctx.drawImage(	Tile.tileSet, 
							this.tileX(),
							this.tileY(),
							this.size,
							this.size,
							cX,
							cY,
							this.size * viewport.scale,
							this.size * viewport.scale);
};