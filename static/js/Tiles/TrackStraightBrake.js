var TrackStraightBrake = function() {
	TrackStraightBrake.id = 1002;
	var name = "Track Straight Brake";
	var spritePos = V(10,	31);
	var size = 32;
	Tile.call(this, name, spritePos, size);
	this.curve = new Curve(	V(0,	16), 
							V(32,	16)
	);
	this.tickAction = function(train) {
		
	};
};

extend(TrackStraightBrake, Tile);