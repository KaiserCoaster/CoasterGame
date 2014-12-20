var Map = function() {
	this.size = 512;
	this.mapGround;
	this.mapObjects;
	this.tracks = [];
	this.generateGround();
	this.load();
	for(var t in this.tracks) {
		this.tracks[t].build(this.mapObjects);
	}
};

Map.prototype.generateGround = function(genSize, returnMap) {
	genSize = typeof genSize !== 'undefined' ?  genSize : -1;
	returnMap = typeof returnMap !== 'undefined' ?  returnMap : false;
	console.log("Generating ground..");
	var grassTextures = [1, 32, 33, 34];
	var gensize = genSize > 0 ? genSize : this.size;
	var newMap = new Array(gensize);
	for(y = 0; y < gensize; y++) {
		newMap[y] = new Array(gensize);
		for(x = 0; x < gensize; x++) {
			var rand = Math.floor(Math.random() * grassTextures.length);
			newMap[y][x] = grassTextures[rand];
		}
	}
	console.log("Ground generation complete.");
	if(returnMap)
		return newMap;
	else
		this.mapGround = newMap;
};
	
Map.prototype.generateMap = function(genSize, returnMap) {
	genSize = typeof genSize !== 'undefined' ?  genSize : -1;
	returnMap = typeof returnMap !== 'undefined' ?  returnMap : false;
	console.log("Generating new map..");
	var gensize = genSize > 0 ? genSize : this.size;
	var newMap = new Array(gensize);
	for(y = 0; y < gensize; y++) {
		newMap[y] = new Array(gensize);
		for(x = 0; x < gensize; x++) {
			newMap[y][x] = 0;
		}
	}
	console.log("Map generation complete.");
	if(returnMap)
		return newMap;
	else
		this.mapObjects = newMap;
};

Map.prototype.update = function() {
	// Update trains
	for(var t in this.tracks) {
		this.tracks[t].update();
	}
}

Map.prototype.render = function(viewport) {
	
	// Compute what tiles are within viewport
	var scaledTile = Tile.tileSize * viewport.scale;
	var centerX = viewport.width / 2;
	var centerY = viewport.height / 2;
	var startX = Math.max(Math.floor((viewport.offset.x - (viewport.width / 2)) / scaledTile), 0);
	var endX = Math.ceil((viewport.offset.x + (viewport.width / 2)) / scaledTile);
	var startY = Math.max(Math.floor((viewport.offset.y - (viewport.height / 2)) / scaledTile), 0);
	var endY = Math.ceil((viewport.offset.y + (viewport.height / 2)) / scaledTile);
	/*console.log(	"offsetX: " + viewport.offset.x +
					"; offsetY: " + viewport.offset.y +
					"; startX: " + startX +
					"; endX: " + endX +
					"; startY: " + startY +
					"; endY: " + endY +
					"; startPosX: " + startPosX +
					"; startPosY: " + startPosY + ";");*/
	
	// Render ground first
	this.renderLayer(viewport, this.mapGround, startX, endX, startY, endY);
	
	// Render objects on top of ground
	this.renderLayer(viewport, this.mapObjects, startX, endX, startY, endY);
	
	// Render trains
	for(var t in this.tracks) {
		this.tracks[t].render(viewport);
	}
};

Map.prototype.renderLayer = function(viewport, layer, startX, endX, startY, endY) {
	var scaledTile = Tile.tileSize * viewport.scale;
	var center = new Vector(viewport.width / 2, viewport.height / 2);
	var gridPos = new Vector(0, 0);
	var layerCell;
	for(y = startY; y < endY; y++) {
		if(y < 0) continue;
		if(y >= this.size) break;
		for(x = startX; x < endX; x++) {
			if(x < 0) continue;
			if(x >= this.size) break;
			layerCell = layer[y][x];
			gridPos.set(scaledTile * x, scaledTile * y);
			Tile.tiles[layerCell].render(	viewport,
											center.x - viewport.offset.x + gridPos.x,
											center.y - viewport.offset.y + gridPos.y
			);
		}
	}
};

Map.prototype.load = function() {
	var $this = this;
	console.log("Loading map.");
	$.ajax({
		type: "POST",
		url: "/loadMap",
		async: false,
		data: {username: $game.player.username}
	})
	.done(function( response ) {
		//console.log(response);
		response = JSON.parse(response);
		if(response.map_exists) {
			var data = JSON.parse(response.data);
			//console.log(data);
			var map = JSON.parse(data.map);
			$this.mapObjects = map;
			for(y = 0; y < map.length; y++) {
				for(x = 0; x < map.length; x++) {
					if(map[y][x] == Tile.NAMES.STATION_HORIZONTAL) {
						$this.tracks.push(new Track(x, y));
					}
				}
			}
			console.log("Done loading map.");
		}
		else {
			console.log("No map found.");
			$this.generateMap();
		}
	});
};

Map.prototype.save = function() {
	var $this = this
	console.log("Saving map..");
	$.ajax({
		type: "POST",
		url: "/saveMap",
		data: {username: $game.player.username, map: JSON.stringify($this.mapObjects)}
	})
	.done(function( response ) {
		console.log(response);
		response = JSON.parse(response);
		if(response.saved)
			console.log("Map saved.");
		else
			console.log("Error saving map.");
	});
};

Map.prototype.resize = function(newSize) {
	var newGround = this.generateGround(newSize, true);
	var newObjects = this.generateMap(newSize, true);
	var smallerSize = Math.min(newSize, this.size);
	for(y = 0; y < smallerSize; y++) {
		for(x = 0; x < smallerSize; x++) {
			newGround[y][x] = this.mapGround[y][x];
			newObjects[y][x] = this.mapObjects[y][x];
		}
	}
	this.size = newSize;
	this.mapGround = newGround;
	this.mapObjects = newObjects;
};