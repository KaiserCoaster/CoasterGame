var Track = function(x, y) {
	this.station = new Vector(x, y);
	this.curves = [];
	this.path = document.createElementNS('http://www.w3.org/2000/svg','path');
	this.pathString;
	this.train = new Train(x, y);
	this.progress = 0;
	this.length = 0;
};

Track.prototype.update = function() {
	// Calculate how much "track progression percentage" to increase based on train's speed.
	var delta = (this.train.speed / this.length / 60);
	this.progress+= delta;
	if(this.progress >= 1)
		this.progress = 0;
	var point = this.path.getPointAtLength(this.length * this.progress);
	this.train.position.set(point.x, point.y);
	var p1p = (this.progress > .01) ? (this.progress - .01) : 0;
	var p2p = (this.progress < .99) ? (this.progress + .01) : 1;
	var p1 = this.path.getPointAtLength(this.length * p1p);
	var p2 = this.path.getPointAtLength(this.length * p2p);
	this.train.angle = Math.atan2(p2.y-p1.y,p2.x-p1.x);
};

Track.prototype.render = function(viewport) {
	// Render train
	this.train.render(viewport);
	// Render actual svg path
	//var path = new Path2D(this.pathString);
	//viewport.ctx.stroke(path);
};

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
		// if not a track
		if(tType < 992 || tType > 997)
			break;
		t = Tile.tiles[tType];
		
		var reflectedNode = Track.reflect(currentNode, t.tileSize);
			
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

Track.reflect = function(node, tileSize) {
	var nx = node.x;
	var ny = node.y;
	if(nx == 0) nx = 32;
	else if(node.x == 32) nx = 0;
	if(ny == 0) ny = 32;
	else if(node.y == 32) ny = 0;
	return new Vector(nx, ny);
};
