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
};

Coaster.prototype.dev = function() {
	this.position.set(3,3);
	this.track.pieces = [
		new TrackPiece(TrackStation.id, 0, 0),
		new TrackPiece(TrackStraight.id, 0, 0),
		new TrackPiece(TrackStraight.id, 0, 0),
		new TrackPiece(TrackTurn1x1.id, 0, 1),
		new TrackPiece(TrackStraight.id, 1, 0),
	];
};

Coaster.prototype.render = function(viewport) {
	this.track.render(viewport);
};