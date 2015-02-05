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
 */  
 var Tile = function(name, spritePos, size) {
	this.name = name;
	this.spritePos = spritePos;
	this.size =  typeof size !== 'undefined' ? size : 32;
};


// Base Tile Size. Always 32x32...unless I change it.
Tile.tileSize = 32;


// Load the tileset image.
Tile.spriteSheet = new Image();
Tile.spriteSheet.src = 'static/images/tileset.png';


// ENUM for translating tile names to IDs.
/*Tile.NAMES = {
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
}*/


/** 
 * @desc Calculate the pixel Y offset of this tile on the tileset.
 * @return int - pixel Y offset of where this tile is.
 */ 
Tile.prototype.tileY = function() {
	return this.spritePos.y * Tile.tileSize;
};


/** 
 * @desc Calculate the pixel X offset of this tile on the tileset.
 * @return int - pixel X offset of where this tile is.
 */  
Tile.prototype.tileX = function() {
	return this.spritePos.x * Tile.tileSize;
};


Tile.prototype.rotatedRender = function(viewport, cX, cY, rad) {
	var scaledTile = viewport.scale * this.size;
	var ctr = V(viewport.width/2, viewport.height/2);
	viewport.ctx.save(); 
	var position = V(cX, cY);
	viewport.ctx.translate(	cX + (scaledTile / 2),
							cY + (scaledTile / 2)
	); 
	viewport.ctx.rotate(rad); 
	this.render(viewport, -(scaledTile)/2, -(scaledTile)/2);
	viewport.ctx.restore();
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
	this.preRender(viewport, cX, cY);
	viewport.ctx.drawImage(	Tile.spriteSheet, 
							this.tileX(),
							this.tileY(),
							this.size,
							this.size,
							cX,
							cY,
							scaledTile,
							scaledTile);
	this.renderCurve(viewport, cX, cY);
	this.postRender(viewport, cX, cY);
};


/** 
 * @desc Preform actions before rendering the tile.
 * @param Viewport viewport - the Viewport object containing the canvas info and context for rendering.
 * @param int cX - X offset on the canvas for where to render the tile
 * @param int cY - Y offset on the canvas for where to render the tile
 */ 
Tile.prototype.preRender = function(viewport, cX, cY) {
		
};


/** 
 * @desc Preform actions after rendering the tile.
 * @param Viewport viewport - the Viewport object containing the canvas info and context for rendering.
 * @param int cX - X offset on the canvas for where to render the tile
 * @param int cY - Y offset on the canvas for where to render the tile
 */ 
Tile.prototype.postRender = function(viewport, cX, cY) {
		
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
