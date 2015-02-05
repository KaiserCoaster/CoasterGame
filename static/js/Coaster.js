var Coaster = function() {
	this.station;
	this.track;
	this.trains;
	this.numTrains;
	this.position;
};

Coaster.prototype.init = function() {
	this.station = new Station(this);
	this.track = new Track(this);
	this.trains = [];
	this.numTrains = 1;
	this.position = V(0, 0);
	this.dev();
	this.track.build();
};

Coaster.prototype.dev = function() {
	this.position.set(3,3);
	this.track.pieces = [
		new TrackPiece(TrackStation.id, 0, 0),
		new TrackPiece(TrackStraight.id, 0, 0),
		new TrackPiece(TrackStraight.id, 0, 0),
		new TrackPiece(TrackTurn1x1.id, 3, 0),
		new TrackPiece(TrackStraight.id, 1, 0),
		new TrackPiece(TrackTurn1x1.id, 0, 0),
		new TrackPiece(TrackStraight.id, 2, 0),
		new TrackPiece(TrackStraight.id, 2, 0),
		new TrackPiece(TrackStraight.id, 2, 0),
		new TrackPiece(TrackStraight.id, 2, 0),
		new TrackPiece(TrackTurn1x1.id, 1, 0),
		new TrackPiece(TrackStraight.id, 3, 0),
		new TrackPiece(TrackTurn1x1.id, 2, 0),
		new TrackPiece(TrackStraight.id, 0, 0),
	];
	this.trains[0] = new Train(this.track, this.position.x, this.position.y);
};

Coaster.prototype.render = function(viewport) {
	this.track.render(viewport);
	for(var t in this.trains) {
		this.trains[t].render(viewport);
	}
};

Coaster.prototype.update = function() {
	for(var t in this.trains) {
		this.trains[t].update();
	}
};