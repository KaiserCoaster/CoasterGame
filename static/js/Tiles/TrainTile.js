var TrainTile = function() {
	TrainTile.id = 960;
	var name = "Train";
	var spritePos = V(0,	30);
	var size = 32;
	Tile.call(this, name, spritePos, size);
};

extend(TrainTile, Tile);
