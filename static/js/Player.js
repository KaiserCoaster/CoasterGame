var Player = function() {
	this._id;
	this.username;
};

Player.prototype.login = function() {
	this.username = prompt("What is your username?");
	console.log(this.username + " logged in.");
};