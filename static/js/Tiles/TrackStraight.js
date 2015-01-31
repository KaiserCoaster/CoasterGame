var TrackStraight = function() {
	TrackStraight.id = 993;
	var name = "Track Straight";
	var spritePos = V(1,	31);
	var size = 32;
	Tile.call(this, name, spritePos, size);
	this.curve = new Curve(	V(0,16), 
							V(32,16)
	);
};

extend(TrackStraight, Tile);
