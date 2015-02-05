var TrackPiece = function(tileID, orientation, startNode) {
	this.tileID = tileID;
	this.orientation = orientation;	// Rotation 0, 1, 2, 3
	this.startNode = startNode;		// First node for train to traverse. 0=nodeA, 1=nodeB
};

TrackPiece.prototype.render = function(viewport, pos) {
	// rotate & render piece
	var viewportPos = viewport.mapToViewportCoordinates( pos );
	var rad = this.orientation * (Math.PI / 2);
	Tile.tiles[this.tileID].rotatedRender(viewport, viewportPos.x, viewportPos.y, rad);
	this.renderSpline(viewport, viewportPos);
};

TrackPiece.prototype.getCurve = function() {
	// return curve based on startNode
	var curve = Tile.tiles[this.tileID].curve;
	if(this.orientation != 0)
		curve = curve.newRotatedCurve(this.orientation, Tile.tiles[this.tileID].size);
	if(this.startNode != 0)
		curve = curve.newCurveOrientedFrom(curve.node2);
	return curve;
};

TrackPiece.prototype.renderSpline = function(viewport, pos) {
	var curve = this.getCurve();
	viewport.ctx.fillStyle = viewport.gui.path.nodeColor;
	viewport.ctx.strokeStyle = viewport.gui.path.lineColor;
	viewport.ctx.lineWidth = viewport.gui.path.lineWidth * viewport.scale;
	viewport.ctx.beginPath();
	viewport.ctx.moveTo((curve.node1.x * viewport.scale) + pos.x, (curve.node1.y * viewport.scale) + pos.y);
	viewport.ctx.bezierCurveTo(	(curve.node1cp.x * viewport.scale) + pos.x, (curve.node1cp.y * viewport.scale) + pos.y,
								(curve.node2cp.x * viewport.scale) + pos.x, (curve.node2cp.y * viewport.scale) + pos.y,
								(curve.node2.x * viewport.scale) + pos.x, (curve.node2.y * viewport.scale) + pos.y);
	viewport.ctx.stroke();
	// Node 1
	viewport.ctx.fillStyle = "#00f";
	viewport.ctx.beginPath();
	viewport.ctx.arc(	(curve.node1.x * viewport.scale) + pos.x,
						(curve.node1.y * viewport.scale) + pos.y,
						viewport.gui.path.nodeSize * viewport.scale, 0, 2 * Math.PI, false);
	viewport.ctx.fill();
	// Node 2
	viewport.ctx.fillStyle = "#f00";
	viewport.ctx.beginPath();
	viewport.ctx.arc(	(curve.node2.x * viewport.scale) + pos.x,
						(curve.node2.y * viewport.scale) + pos.y,
						viewport.gui.path.nodeSize * viewport.scale, 0, 2 * Math.PI, false);
	viewport.ctx.fill();
};
