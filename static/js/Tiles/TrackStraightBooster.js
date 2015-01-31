var TrackStraightBooster = function() {
	TrackStraightBooster.id = 1000;
	var name = "Track Straight Booster";
	var spritePos = V(8,	31);
	var size = 32;
	Tile.call(this, name, spritePos, size);
	this.curve = new Curve(	V(0,16), 
							V(32,16)
	);
	this.tickAction = function(train) {
		
	};
};

extend(TrackStraightBooster, Tile);