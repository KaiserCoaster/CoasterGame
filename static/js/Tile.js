var Tile = function(name, y, x, size) {
	this.name = name;
	this.setPos = new Vector(x, y);
	this.size =  typeof size !== 'undefined' ? size : 32;
};

Tile.tileSize = 32;

Tile.tileSet = new Image();
Tile.tileSet.src = 'static/images/tileset.png';

Tile.NAMES = {
	AIR: 				0,
	GRASS:				1,
	DIRT:				2,
	VERTICAL_PATH:		3,
	
	TRAIN:				960,
	
	TRACK_VERTICAL:		992,
	TRACK_HORIZONTAL:	993,
	TRACK_BOTTOM_RIGHT:	994,
	TRACK_BOTTOM_LEFT:	995,
	TRACK_TOP_LEFT:		996,
	TRACK_TOP_RIGHT:	997,
	STATION_HORIZONTAL:	998,
}

Tile.tiles = {
	0: 		new Tile('air', 				0, 	0),
	1: 		new Tile('grass', 				0, 	1),
	2: 		new Tile('dirt',				0,	2),
	3: 		new Tile('vertical path',		0,	3),
	
	960:	new Tile('train',				30,	0),
	
	992:	new Tile('vertical track',		31,	0),
	993:	new Tile('horizontal track',	31,	1),
	994:	new Tile('bottom right track',	31,	2),
	995:	new Tile('bottom left track',	31,	3),
	996:	new Tile('top left track',		31,	4),
	997:	new Tile('top right track',		31,	5),
	998:	new Tile('horizontal station',	31,	6),
};

Tile.names = {
	
}

Tile.prototype.tileY = function() {
	return this.setPos.y * this.size;
};

Tile.prototype.tileX = function() {
	return this.setPos.x * this.size;
};

Tile.prototype.render = function(viewport, cX, cY) {
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