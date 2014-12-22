/**
 * Tile and tile types.
 *
 * @author Matthew Kaiser
 * @url http://mkaiser.io
 */
 
 
/** 
 * @constructor
 * @desc Tile object containing size, position, and curve info.
 * @param string name - Human readable tile name, only for dev/debug purposes.
 * @param Vector setPos - Vector containing x and y position of this tile on the tileset image.
 * @param int size - Square pixel size of tile. Normally 32px.
 * @param Curve curve - The SVG bezier curve path that trains follow along track tiles.
 */  
 var Tile = function(name, setPos, size, curve) {
	this.name = name;
	this.setPos = setPos;
	this.size =  typeof size !== 'undefined' ? size : 32;
	this.curve = curve;
};


// Base Tile Size. Always 32x32...unless I change it.
Tile.tileSize = 32;


// Load the tileset image.
Tile.tileSet = new Image();
Tile.tileSet.src = 'static/images/tileset.png';


// ENUM for translating tile names to IDs.
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
	
	TRACK_HORIZ_BOOST:	1000,
	TRACK_VERT_BOOST:	1001,
	TRACK_HORIZ_BRAKE:	1002,
	TRACK_VERT_BRAKE:	1003,
}


// The list of all tile objects.
Tile.tiles = {
	0: 		new Tile('air', 				V(0,	0) ),
	1: 		new Tile('grass', 				V(1,	0) ),
	2: 		new Tile('dirt',				V(2,	0) ),
	3: 		new Tile('vertical path',		V(3,	0) ),
	
	32: 	new Tile('grass2', 				V(0,	1) ),
	33: 	new Tile('grass3', 				V(1,	1) ),
	34: 	new Tile('grass4', 				V(2,	1) ),
	
	960:	new Tile('train',				V(0,	30) ),
	966:	new Tile('bottom left 2x2',		V(6,	30), 64, new Curve(V(0,16), V(48,64), V(24,16), V(48,40) ) ),
	
	992:	new Tile('vertical track',		V(0,	31), 32, new Curve(V(16,0), V(16,32) ) ),
	993:	new Tile('horizontal track',	V(1,	31), 32, new Curve(V(0,16), V(32,16) ) ),
	994:	new Tile('bottom right track',	V(2,	31), 32, new Curve(V(16,32), V(32,16), V(16,24), V(24,16) ) ),
	995:	new Tile('bottom left track',	V(3,	31), 32, new Curve(V(0,16), V(16,32),  V(8,16), V(16,24) ) ),
	996:	new Tile('top left track',		V(4,	31), 32, new Curve(V(16,0), V(0,16), V(16,8), V(8,16) ) ),
	997:	new Tile('top right track',		V(5,	31), 32, new Curve(V(16,0), V(32,16), V(16,8), V(24,16) ) ),
	998:	new Tile('horizontal station',	V(6,	31), 32, new Curve(V(0,16), V(32,16) ) ),
	
	1000:	new Tile('horizontal booster',	V(8,	31), 32, new Curve(V(0,16), V(32,16) ) ),
	1001:	new Tile('vertical booster',	V(9,	31), 32, new Curve(V(16,0), V(16,32) ) ),
	1002:	new Tile('horizontal brake',	V(10,	31), 32, new Curve(V(0,16), V(32,16) ) ),
	1003:	new Tile('vertical brake',		V(11,	31), 32, new Curve(V(16,0), V(16,32) ) ),
};


/** 
 * @desc Calculate the pixel Y offset of this tile on the tileset.
 * @return int - pixel Y offset of where this tile is.
 */ 
Tile.prototype.tileY = function() {
	return this.setPos.y * this.size;
};


/** 
 * @desc Calculate the pixel X offset of this tile on the tileset.
 * @return int - pixel X offset of where this tile is.
 */  
Tile.prototype.tileX = function() {
	return this.setPos.x * this.size;
};


/** 
 * @desc Render this tile object.
 * @param Viewport viewport - the Viewport object containing the canvas info and context for rendering.
 * @param int cX - X offset on the canvas for where to render the tile
 * @param int cY - Y offset on the canvas for where to render the tile
 */ 
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
	this.renderCurve(viewport, cX, cY);
};


/** 
 * @desc Render the curve on top of track, if setting is on.
 * @param Viewport viewport - the Viewport object containing the canvas info and context for rendering.
 * @param int cX - X offset on the canvas for where to render the curve
 * @param int cY - Y offset on the canvas for where to render the curve
 */ 
Tile.prototype.renderCurve = function(viewport, cX, cY) {
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
