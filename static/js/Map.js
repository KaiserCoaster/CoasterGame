var Map = function() {
	this.mapGround;
	this.mapObjects;
	this.generateGround();
	this.load();
};

Map.size = 1024;

Map.prototype.generateGround = function() {
	console.log("Generating ground..");
	this.mapGround = new Array(Map.size);
	for(y = 0; y < Map.size; y++) {
		this.mapGround[y] = new Array(Map.size);
		for(x = 0; x < Map.size; x++) {
			this.mapGround[y][x] = 1;
		}
	}
	console.log("Ground generation complete.");
};
	
Map.prototype.generateMap = function() {
	console.log("Generating new map..");
	this.mapObjects = new Array(Map.size);
	for(y = 0; y < Map.size; y++) {
		this.mapObjects[y] = new Array(Map.size);
		for(x = 0; x < Map.size; x++) {
			this.mapObjects[y][x] = 0;
		}
	}
	console.log("Map generation complete.");
};

Map.prototype.render = function(viewport) {
	
	// Compute what tiles are within viewport
	var startX = parseInt((viewport.offsetX / Tile.tileSize), 10);
	var endX = startX + parseInt((viewport.width / Tile.tileSize), 10) + 2;
	var startY = parseInt((viewport.offsetY / Tile.tileSize), 10);
	var endY = startY + parseInt((viewport.height / Tile.tileSize), 10) + 2;
	var startPosX = (viewport.offsetX % Tile.tileSize) * -1;
	var startPosY = (viewport.offsetY % Tile.tileSize) * -1;
	
	// Render ground first
	this.renderLayer(viewport, this.mapGround, startX, endX, startY, endY, startPosX, startPosY);
	
	// Render objects on top of ground
	this.renderLayer(viewport, this.mapObjects, startX, endX, startY, endY, startPosX, startPosY);
};

Map.prototype.renderLayer = function(viewport, layer, startX, endX, startY, endY, startPosX, startPosY) {
	var posX = startPosX;
	var posY = startPosY;
	for(y = startY; y < endY; y++) {
		if(y < 0 || y >= Map.size)
			break;
		for(x = startX; x < endX; x++) {
			if(x < 0 || x >= Map.size)
				break;
			var layerCell = layer[y][x];
			Tile.tiles[layerCell].render(viewport, posY, posX);
			posX += 32;
		}
		posX = startPosX;
		posY += 32;
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
		console.log(response);
		response = JSON.parse(response);
		if(response.map_exists) {
			data = JSON.parse(response.data);
			console.log(data);
			map = JSON.parse(data.map);
			$this.mapObjects = map;
			console.log("Done loading map.");
		}
		else {
			console.log("No map found.");
			$this.generateMap();
		}
	});
}

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