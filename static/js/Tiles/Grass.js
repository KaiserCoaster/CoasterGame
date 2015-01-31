var Grass = function() {
	Grass.id = 1;
	var name = "Grass";
	var spritePos =  V(1,	0);
	var size = 32;
	Tile.call(this, name, spritePos, size);
};
