/**
 * Vector object for an x and y coordinate.
 *
 * @author Matthew Kaiser
 * @url http://mkaiser.io
 */
 

/** 
 * @constructor
 * @desc Vector object.
 * @param int x - x coordinate.
 * @param int y - y coordinate.
 */ 
var Vector = function(x, y) {
	this.x = x;
	this.y = y;
};


/** 
 * @desc Sets x and y coordinate values.
 * @param int x - x coordinate.
 * @param int y - y coordinate.
 */ 
Vector.prototype.set = function(x, y) {
	this.x = x;
	this.y = y;
};


/** 
 * @desc Duplicates the current vector object.
 * @return Vector - new Vector with same x and y coordinates as original vector.
 */ 
Vector.prototype.copy = function() {
	return V(this.x, this.y);
};


/** 
 * @desc Rotates vector point around origin
 * @param int rad - radians to rotate the point.
 * @return Vector - new Vector with rotated x and y coordinates.
 */ 
Vector.prototype.rotate = function(rad) {
	var x = (this.x * Math.cos(rad)) - (this.y * Math.sin(rad));
	var y = (this.x * Math.sin(rad)) + (this.y * Math.cos(rad));
	return V(x, y);
};


/** 
 * @desc Rotates vector point around a supplied point
 * @param int rad - radians to rotate the point.
 * @param int around - another vector to rotate the point around.
 * @return Vector - new Vector with rotated x and y coordinates.
 */ 
Vector.prototype.rotateAround = function(rad, around) {
	var np = V(this.x - around.x, this.y - around.y);
	np = np.rotate(rad);
	np.set(np.x + around.x, np.y + around.y);
	return np;
};


/** 
 * @desc Global Shortcut function for creating a new Vector object.
 * @param int x - x coordinate.
 * @param int y - y coordinate.
 * @return Vector - new Vector object with x and y coordinates set.
 */ 
var V = function(x, y) {
	return new Vector(x, y);
};