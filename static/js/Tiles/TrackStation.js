var TrackStation = function() {
	TrackStation.id = 998;
	var name = "Track Station";
	var spritePos = V(6,	31);
	var size = 32;
	Tile.call(this, name, spritePos, size);
	this.curve = new Curve(	V(0,16), 
							V(32,16)
	);
};

extend(TrackStation, Tile);

TrackStation.tickAction = function(train) {
	
};