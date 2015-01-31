var TrackTurn1x1 = function() {
	TrackTurn1x1.id = 996;
	var name = "Track Turn 1x1";
	var spritePos = V(4,	31);
	var size = 32;
	Tile.call(this, name, spritePos, size);
	this.curve = new Curve(	V(16,0),
							V(0,16),
							V(16,8),
							V(8,16)
	);
};

extend(TrackTurn1x1, Tile);