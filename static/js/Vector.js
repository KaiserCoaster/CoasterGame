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
	return new Vector(this.x, this.y);
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