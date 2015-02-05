/**
 * Train object for coasters.
 *
 * @author Matthew Kaiser
 * @url http://mkaiser.io
 */
 
 
/** 
 * @constructor
 * @desc Train Object.
 * @param Track track - the track that this train is on. Needed for traversing path.
 * @param int x - tile x offset
 * @param int y - tile y offset
 */ 
 var Train = function(track, x, y) {
	// Track this train is on.
	this.track = track;
	// Angle of train. Default to 0.
	this.angle = 0;
	// Speed in pixels per second.
	this.speed = 50;
	// The train tile.
	this.tile = TrainTile;
	// Pixel Position on the map.
	this.position = V( (x*Tile.tileSize)+16, (y*Tile.tileSize)+16 );
	// Pixel Progression through the track.
	this.progress = 16;
	// Counter for the station. (Stays in the station for 3 sec)
	this.stationCounter = 0;
};


/**
 * @desc Train update tick. Process train logic.
 */
Train.prototype.update = function() {
	// Preform track specific functions (Booster, brake, etc.)
	this.trackAction();
	
	// Apply friction to slow train gradually
	this.slower(this.speed * .0015, 5);
	
	// Calculate how much "track progression" to increase per tick based on train's speed.
	var delta = (this.speed / 60);
	
	// Move train delta pixels
	this.move(delta);
};


/**
 * @desc Train render/draw.
 * @param Viewport viewport - the viewport object containing the canvas context for rendering.
 */
Train.prototype.render = function(viewport) {
	/*var scaledTile = viewport.scale * Tile.tileSize;
	var ctr = V(viewport.width/2, viewport.height/2);
	viewport.ctx.save(); 
	viewport.ctx.translate(	Math.ceil(ctr.x - viewport.offset.x + (this.position.x * viewport.scale)),
							Math.ceil(ctr.y - viewport.offset.y + (this.position.y * viewport.scale))
	);
	viewport.ctx.rotate(this.angle);
	Tile.tiles[this.tile.id].render(viewport, -(this.tile.size * viewport.scale)/2, -(this.tile.size * viewport.scale)/2);
	viewport.ctx.restore();*/
	Tile.tiles[this.tile.id].render(viewport, -10, -10);
};


/**
 * @desc Preforms a specific action depending on what type of track the train is currently on. (boost, brake, etc.)
 */
Train.prototype.trackAction = function() {
	// Get what track type the train is on.
	var tilePos = V(Math.floor(this.position.x / Tile.tileSize), Math.floor(this.position.y / Tile.tileSize));
	var track  = $game.map.mapObjects[tilePos.y][tilePos.x];
	
	// Preform a specific action depending on the track type
	switch(track) {
		case Tile.NAMES.TRACK_HORIZ_BOOST:
		case Tile.NAMES.TRACK_VERT_BOOST:
			// On a booster track - increase speed up to a certain max.
			this.faster(this.speed * .03, 400);
			//console.log(this.speed);
			break;
		case Tile.NAMES.TRACK_HORIZ_BRAKE:
		case Tile.NAMES.TRACK_VERT_BRAKE:
			// On a brake track - slow speed down to a certain min.
			this.slower(this.speed * .03, 25);
			//console.log(this.speed);
			break;
		case Tile.NAMES.STATION_HORIZONTAL:
			this.speed = 20;
			var tileOffset = V(Math.floor(this.position.x % Tile.tileSize), Math.floor(this.position.y % Tile.tileSize));
			if(tileOffset.x == 16 && this.stationCounter < 180) {
				this.speed = 0;
				this.stationCounter ++;
			}
			else if(tileOffset.x == 16 && this.stationCounter >= 180) {
				this.progress++;
				this.stationCounter = 0;
			}
			break;
		default:
			break;
	}
}


/**
 * @desc Increase speed of train
 * @param int delta - Amount to increase speed. (in pixels per second)
 * @param int max - Upper speed bound. (Don't cross it if supplied)
 */
Train.prototype.faster = function(delta, max) {
	// If max is given..
	if(typeof max !== 'undefined') {
		// If already going faster than max, do nothing and return.
		if(Math.abs(this.speed) >= max)
			return;
		// If speed+delta is over max, reset to max and return.
		if((Math.abs(this.speed) + delta) > max) {
			this.speed = (this.speed > 0) ? max : -max;
			return;
		}
	}
	
	// Increase speed by delta if negative, decrease if positive.
	this.speed += (this.speed > 0) ? delta : -delta;
};


/**
 * @desc Decrease speed of train
 * @param int delta - Amount to decrease speed. (in pixels per second)
 * @param int min - Lower speed bound. (Don't cross it if supplied)
 */
Train.prototype.slower = function(delta, min) {
	// If min is given..
	if(typeof min !== 'undefined') {
		// If already going slower than min, do nothing and return.
		if(Math.abs(this.speed) <= min)
			return;
		// If speed-delta is under min, reset to min and return.
		if((Math.abs(this.speed) - delta) < min) {
			this.speed = (this.speed > 0) ? min : -min;
			return;
		}
	}
	
	// Set speed to 0 if in-between +delta and -delta.
	if(this.speed < delta && this.speed > -delta)
		this.speed = 0;
	// Increase speed if negative, decrease if positive.
	else
		this.speed += (this.speed > 0) ? -delta : delta;
};


/**
 * @desc Move the train a certain amount of pixels along the track.
 * @param int delta - number of pixels to move train. Can be + or -.
 */
Train.prototype.move = function(delta) {
	if(delta != 0) {
		this.progress+= delta;
	
		// If progression is greater than track length, reset progression.
		if(this.progress >= this.track.length)
			this.progress %= this.track.length;
		else if(this.progress < 0)
			this.progress += this.track.length;
		
		// Get & set position along track based on progress percentage.
		var point = this.track.path.getPointAtLength(this.progress);
		this.position.set(point.x, point.y);
		
		// Sample 2 points around train to calculate rotation angle based on curvature.
		var p1p = (this.progress > 1) ? (this.progress - 1) : 0;
		var p2p = (this.progress < this.track.length) ? (this.progress + 1) : this.track.length;
		var p1 = this.track.path.getPointAtLength(p1p);
		var p2 = this.track.path.getPointAtLength(p2p);
		this.angle = Math.atan2(p2.y-p1.y,p2.x-p1.x);	
	}
};