function Player(paddle) {
	this.score = 0;
	this.paddle = paddle;
	this.get_score = function() {
		return this.score;
	};
	this.increment_score = function() {
		this.score+=1;
	};
	this.get_paddle = function() {
		return this.paddle;
	}
};