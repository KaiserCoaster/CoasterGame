var Curve = function(node1, node2, node1cp, node2cp) {
	this.node1 = node1;
	this.node2 = node2;
	this.node1cp = typeof node1cp !== 'undefined' ?  node1cp : node1.copy();	// Control Point 1
	this.node2cp = typeof node2cp !== 'undefined' ?  node2cp : node2.copy();		// Control Point 2
	this.pOffset = new Vector(0,0);
};

Curve.prototype.newCurveOrientedFrom = function(fromnode) {
	if(fromnode.x == this.node1.x && fromnode.y == this.node1.y) 
		return new Curve(this.node1.copy(), this.node2.copy(), this.node1cp.copy(), this.node2cp.copy());
	else if(fromnode.x == this.node2.x && fromnode.y == this.node2.y) 
		return new Curve(this.node2.copy(), this.node1.copy(), this.node2cp.copy(), this.node1cp.copy());
	else
		return false;
};