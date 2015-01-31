var Path = function(n1, n2, n1cp, n2cp) {
	this.n1 = n1;
	this.n2 = n2;
	this.n1cp = typeof n1cp !== 'undefined' ?  n1cp : new Vector(n1.x, n2.y);	// Control Point 1
	this.n2cp = typeof n2cp !== 'undefined' ?  n2cp : new Vector(n2.x, n2.y);		// Control Point 2
	this.path = document.createElementNS('http://www.w3.org/2000/svg','path');
	this.path.setAttribute('d',	'M' + this.n1.x 	+ ',' + this.n1.y +
								'C' + this.n1cp.x 	+ ',' + this.n1cp.y +
								' ' + this.n2cp.x 	+ ',' + this.n2cp.y +
								' ' + this.n2.x 	+ ',' + this.n2.y);
	this.length = this.path.getTotalLength();
};

Path.prototype.posAt = function(progression, direction) {
	if(direction == 1)
		this.path.setAttribute('d',	'M' + this.n1.x 	+ ',' + this.n1.y +
									'C' + this.n1cp.x 	+ ',' + this.n1cp.y +
									' ' + this.n2cp.x 	+ ',' + this.n2cp.y +
									' ' + this.n2.x 	+ ',' + this.n2.y);
	else
		this.path.setAttribute('d',	'M' + this.n2.x 	+ ',' + this.n2.y +
									'C' + this.n2cp.x 	+ ',' + this.n2cp.y +
									' ' + this.n1cp.x 	+ ',' + this.n1cp.y +
									' ' + this.n1cp.x 	+ ',' + this.n1.y);
	return this.path.getPointAtLength(this.length * progression + .1);
};