var Map = function() {
	this.size = 64;
	this.mapGround;
	this.mapObjects;
	this.coasters = [];
	this.highlight = V(0, 0);
	this.generateGround();
	this.load();
	/*for(var t in this.tracks) {
		this.tracks[t].build(this.mapObjects);
	}*/
	this.coasters[0] = new Coaster();
	this.coasters[0].init();
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
	// Update trains.
	for(var c in this.tracks) {
		this.coasters[c].update();
	}
}

Map.prototype.render = function(viewport) {
	
	// Compute what tiles are within viewport.
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
	
	// Render ground first.
	this.renderLayer(viewport, this.mapGround, startX, endX, startY, endY);
	
	// Render objects on top of ground.
	this.renderLayer(viewport, this.mapObjects, startX, endX, startY, endY);
	
	// Render coasters.
	for(var c in this.coasters) {
		this.coasters[c].render(viewport);
	}
	
	// Render highlighted tile.
	// Update highlighted tile.
	this.highlight.set(	Math.floor((IO.mousePos.x - centerX + viewport.offset.x) / scaledTile),
						Math.floor((IO.mousePos.y - centerY + viewport.offset.y) / scaledTile)
	);
	viewport.ctx.fillStyle = viewport.gui.selector.fillColor;
	viewport.ctx.fillRect(	Math.ceil(centerX - viewport.offset.x + scaledTile * this.highlight.x),
							Math.ceil(centerY - viewport.offset.y + scaledTile * this.highlight.y),
							scaledTile,
							scaledTile
	);
	var lineWidth = (viewport.gui.selector.lineScale) ? 
						viewport.gui.selector.lineWidth * viewport.scale : 
						viewport.gui.selector.lineWidth;
	if(lineWidth > 0) {
		viewport.ctx.strokeStyle = viewport.gui.selector.lineColor;
		viewport.ctx.lineWidth = lineWidth;
		viewport.ctx.strokeRect(Math.ceil(centerX - viewport.offset.x + scaledTile * this.highlight.x) + (lineWidth / 2),
								Math.ceil(centerY - viewport.offset.y + scaledTile * this.highlight.y) + (lineWidth / 2),
								scaledTile - lineWidth,
								scaledTile - lineWidth
		);
	}
	viewport.ctx.save();
	viewport.ctx.globalAlpha = 0.4;
	Tile.tiles[selected].render(viewport,
								Math.ceil(centerX - viewport.offset.x + scaledTile * this.highlight.x) + (lineWidth / 2), 
								Math.ceil(centerY - viewport.offset.y + scaledTile * this.highlight.y) + (lineWidth / 2));
	viewport.ctx.restore();
	
};

Map.prototype.renderLayer = function(viewport, layer, startX, endX, startY, endY) {
	var scaledTile = Tile.tileSize * viewport.scale;
	var center = V(viewport.width / 2, viewport.height / 2);
	var viewportPos;
	var layerCell;
	for(y = startY; y < endY; y++) {
		if(y < 0) continue;
		if(y >= this.size) break;
		for(x = startX; x < endX; x++) {
			if(x < 0) continue;
			if(x >= this.size) break;
			layerCell = layer[y][x];
			viewportPos = viewport.mapToViewportCoordinates( V(x, y) );
			Tile.tiles[layerCell].render(	viewport,
											viewportPos.x,
											viewportPos.y
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
			/*console.log(map);
			for(y = 0; y < map.length; y++) {
				for(x = 0; x < map.length; x++) {
					if(map[y][x] == Tile.NAMES.STATION_HORIZONTAL) {
						$this.tracks.push(new Track(x, y));
					}
				}
			}*/
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

Map.prototype.fix = function() {
	for(y = 0; y < this.mapObjects.length; y++) {
		for(x = 0; x < this.mapObjects.length; x++) {
			this.mapObjects[y][x] = parseInt(this.mapObjects[y][x], 10);
		}
	}
}

Map.prototype.set = function(x, y, tile) {
	if(x < 0 || y < 0 || x >= this.size || y >= this.size) {
		console.log("Out of bounds");
		return;
	}
	this.mapObjects[y][x] = tile;
};