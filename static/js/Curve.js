/**
 * Bezier Curve object to hold path for track pieces.
 *
 * @author Matthew Kaiser
 * @url http://mkaiser.io
 */
 
 
/** 
 * @constructor
 * @desc Curve Object.
 * @param Vector node1 - the starting node of this bezier curve
 * @param Vector node2 - the ending node of this bezier curve
 * @param Vector node1cp - Control point for starting node of bezier curve
 * @param Vector node2cp - Control point for ending node of bezier curve
 */ 
 var Curve = function(node1, node2, node1cp, node2cp) {
	this.node1 = node1;
	this.node2 = node2;
	this.node1cp = typeof node1cp !== 'undefined' ?  node1cp : node1.copy();	// Control Point 1
	this.node2cp = typeof node2cp !== 'undefined' ?  node2cp : node2.copy();		// Control Point 2
	this.pOffset = new Vector(0,0);
};


/**
 * @desc Create a new curve object based on the current node. Orient the curve such that the starting node is fromnode.
 * @param Vector fromnode - node from which the new path should start.
 * @return Curve - essentially a copy of the curve but in a specified direction.
 * @return False - if fromnode doesn't match the curve's starting or ending node.
 */
Curve.prototype.newCurveOrientedFrom = function(fromnode) {
	if(fromnode.x == this.node1.x && fromnode.y == this.node1.y) 
		return new Curve(this.node1.copy(), this.node2.copy(), this.node1cp.copy(), this.node2cp.copy());
	else if(fromnode.x == this.node2.x && fromnode.y == this.node2.y) 
		return new Curve(this.node2.copy(), this.node1.copy(), this.node2cp.copy(), this.node1cp.copy());
	else
		return false;
};