function Position(x,y) {
	this.x = x;
	this.y = y;
	this.get_x = function() {
		return this.x;
	};
	this.get_y = function() {
		return this.y;
	};

	this.set_x = function(x) {
		this.x = x;
	};

	this.set_y = function(y) {
		this.y = y;
	};
	this.set_both = function(x,y) {
		this.x = x;
		this.y = y;
	};

	this.increment_position = function(amount_x,amount_y) {
		this.x += amount_x
		this.y += amount_y
	}
};