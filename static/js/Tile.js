var Tile = function(name, y, x, size, curve) {
	this.name = name;
	this.setPos = new Vector(x, y);
	this.size =  typeof size !== 'undefined' ? size : 32;
	this.curve = curve;
};

Tile.tileSize = 32;

Tile.tileSet = new Image();
Tile.tileSet.src = 'static/images/tileset.png';

Tile.NAMES = {
	AIR: 				0,
	GRASS:				1,
	DIRT:				2,
	VERTICAL_PATH:		3,
	
	GRASS2:				32,
	GRASS3:				33,
	GRASS4:				34,
	
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
	
	32: 	new Tile('grass2', 				1, 	0),
	33: 	new Tile('grass3', 				1, 	1),
	34: 	new Tile('grass4', 				1, 	2),
	
	960:	new Tile('train',				30,	0),
	966:	new Tile('bottom left 2x2',		30,	6, 64, new Curve(V(0,16), V(48,64), V(24,16), V(48,40) ) ),
	
	992:	new Tile('vertical track',		31,	0, 32, new Curve(V(16,0), V(16,32) ) ),
	993:	new Tile('horizontal track',	31,	1, 32, new Curve(V(0,16), V(32,16) ) ),
	994:	new Tile('bottom right track',	31,	2, 32, new Curve(V(16,32), V(32,16), V(16,24), V(24,16) ) ),
	995:	new Tile('bottom left track',	31,	3, 32, new Curve(V(0,16), V(16,32),  V(8,16), V(16,24) ) ),
	996:	new Tile('top left track',		31,	4, 32, new Curve(V(16,0), V(0,16), V(16,8), V(8,16) ) ),
	997:	new Tile('top right track',		31,	5, 32, new Curve(V(16,0), V(32,16), V(16,8), V(24,16) ) ),
	998:	new Tile('horizontal station',	31,	6, 32, new Curve(V(0,16), V(32,16) ) ),
};

Tile.prototype.tileY = function() {
	return this.setPos.y * this.size;
};

Tile.prototype.tileX = function() {
	return this.setPos.x * this.size;
};

Tile.prototype.render = function(viewport, cX, cY) {
	var scaledTile = Math.ceil(this.size * viewport.scale);
	cX = Math.ceil(cX);
	cY = Math.ceil(cY);
	viewport.ctx.drawImage(	Tile.tileSet, 
							this.tileX(),
							this.tileY(),
							this.size,
							this.size,
							cX,
							cY,
							scaledTile,
							scaledTile);
	if(this.curve && viewport.gui.path.rendering) {
		viewport.ctx.fillStyle = viewport.gui.path.nodeColor;
		viewport.ctx.strokeStyle = viewport.gui.path.lineColor;
		viewport.ctx.lineWidth = viewport.gui.path.lineWidth * viewport.scale;
		viewport.ctx.beginPath();
		viewport.ctx.moveTo((this.curve.node1.x * viewport.scale) + cX, (this.curve.node1.y * viewport.scale) + cY);
		viewport.ctx.bezierCurveTo(	(this.curve.node1cp.x * viewport.scale) + cX, (this.curve.node1cp.y * viewport.scale) + cY,
									(this.curve.node2cp.x * viewport.scale) + cX, (this.curve.node2cp.y * viewport.scale) + cY,
									(this.curve.node2.x * viewport.scale) + cX, (this.curve.node2.y * viewport.scale) + cY);
		viewport.ctx.stroke();
		// Node 1
		viewport.ctx.beginPath();
		viewport.ctx.arc(	(this.curve.node1.x * viewport.scale) + cX,
							(this.curve.node1.y * viewport.scale) + cY,
							viewport.gui.path.nodeSize * viewport.scale, 0, 2 * Math.PI, false);
		viewport.ctx.fill();
		// Node 2
		viewport.ctx.beginPath();
		viewport.ctx.arc(	(this.curve.node2.x * viewport.scale) + cX,
							(this.curve.node2.y * viewport.scale) + cY,
							viewport.gui.path.nodeSize * viewport.scale, 0, 2 * Math.PI, false);
		viewport.ctx.fill();
		
	}
};