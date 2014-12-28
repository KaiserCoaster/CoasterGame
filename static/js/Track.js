/**
 * Track object for coasters. 
 * The track is built upon map load by starting at a station tile
 * and following tracks, adding each tile's curve to an SVG path.
 *
 * @author Matthew Kaiser
 * @url http://mkaiser.io
 */
 
 
/** 
 * @constructor
 * @desc Track Object.
 * @param int x - tile x coordinate of station.
 * @param int y - tile y coordinate of station.
 */ 
var Track = function(x, y) {
	// Tile coordinates of station.
	this.station = V(x, y);
	// Array of curves in this coaster.
	this.curves = [];
	// SVG path.
	this.path = document.createElementNS('http://www.w3.org/2000/svg','path');
	// SVG path string.
	this.pathString;
	// The train on this track - init onto the station tile.
	this.train = new Train(this, x, y);
	// Track length in pixels.
	this.length = 0;
	// Friction. This value is applied to the speed every tick to slow the train.
	this.friction = .05;
};


/**
 * @desc Track update tick. (Just update train logic.)
 */
Track.prototype.update = function() {
	// Update train's progression, position, rotation, speed, etc.
	this.train.update();
};


/**
 * @desc Track render/draw. (Just render the train. Track is rendered as part of the mapObjects.)
 * @param Viewport viewport - the viewport containing the canvas context for rendering.
 */
Track.prototype.render = function(viewport) {
	// Render train
	this.train.render(viewport);
	// Render actual svg path
	//var path = new Path2D(this.pathString);
	//viewport.ctx.stroke(path);
};


/**
 * @desc Used to build the path that the train follows.
 * @param int[][] map - The mapObjects 2D array that holds tiles such as the tracks
 */
Track.prototype.build = function(map) {
	
	var tileOffset = new Vector(this.station.x, this.station.y);
	
	// Init station curve
	var tType = map[tileOffset.y][tileOffset.x];
	var t = Tile.tiles[tType];
	var curve = new Curve(t.curve.node1.copy(), t.curve.node2.copy(), t.curve.node1cp.copy(), t.curve.node2cp.copy());
	curve.pOffset.set(Tile.tileSize * tileOffset.x, Tile.tileSize * tileOffset.y);
	this.curves.push( curve );
	tileOffset.x++;
	// set current node to the end station node
	var currentNode = t.curve.node2;
	
	while(true) {
		tType = map[tileOffset.y][tileOffset.x];
		// if not a track or station track
		if(typeof tType === 'undefined' || tType < 992 || tType > 1003 || tType == Tile.NAMES.STATION_HORIZONTAL)
			break;
		t = Tile.tiles[tType];
		
		var reflectedNode = Track.reflect(currentNode, Tile.tileSize);
			
		var curve = t.curve.newCurveOrientedFrom(reflectedNode);
		// Nodes don't match
		if(curve == false)
			break;
		curve.pOffset.set(Tile.tileSize * tileOffset.x, Tile.tileSize * tileOffset.y);
		
		this.curves.push( curve );
		
		currentNode = curve.node2;
		
		// Move to next track piece
		var deltaTiles = t.size / Tile.tileSize;
		if(currentNode.x == 16 && currentNode.y  == 32) // Going Down
			tileOffset.y+=deltaTiles;
		else if(currentNode.x == 16 && currentNode.y  == 0) // Going Up
			tileOffset.y-=deltaTiles;
		else if(currentNode.x == 0 && currentNode.y  == 16) // Going Left
			tileOffset.x-=deltaTiles;
		else if(currentNode.x == 32 && currentNode.y  == 16) // Going Right
			tileOffset.x+=deltaTiles;
	}
	
	// build SVG path string
	// move to starting node
	var path = "M" + (this.curves[0].node1.x + this.curves[0].pOffset.x) + " " + (this.curves[0].node1.y + this.curves[0].pOffset.y);
	// add each curve
	for(var i = 0; i < this.curves.length; i++) {
		var c = this.curves[i];
		path += " C" + (c.node1cp.x + c.pOffset.x) + " " + (c.node1cp.y + c.pOffset.y);
		path += ", " + (c.node2cp.x + c.pOffset.x) + " " + (c.node2cp.y + c.pOffset.y);
		path += ", " + (c.node2.x + c.pOffset.x) +   " " + (c.node2.y + c.pOffset.y);
	}

	this.pathString = path;
	this.path.setAttribute('d',	path);
	
	this.length = this.path.getTotalLength()
	
};


/**
 * @desc Given the exit node, reflect the point to where the next track piece will need to start.
 * @param Vector node - the exit node for a tile.
 * @param int tileSize - the size of the tile.
 * return Vector - the node that the next track piece should start at.
 */
Track.reflect = function(node, tileSize) {
	var nx = node.x;
	var ny = node.y;
	if(nx == 0) nx = 32;
	else if(node.x == 32) nx = 0;
	if(ny == 0) ny = 32;
	else if(node.y == 32) ny = 0;
	return V(nx, ny);
};
