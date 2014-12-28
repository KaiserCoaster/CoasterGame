/**
 * Player object containing info about players in the game, as well as the main user.
 *
 * @author Matthew Kaiser
 * @url http://mkaiser.io
 */
 
 
/** 
 * @constructor
 * @desc Player Object.
 */ 
 var Player = function() {
	// Player id
	this._id;
	// Player Username
	this.username;
};


/**
 * @desc Prompt user to enter username.. very basic "login."
 */
Player.prototype.login = function() {
	this.username = prompt("What is your username?");
	console.log(this.username + " logged in.");
};