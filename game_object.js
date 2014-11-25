function Game_object(position, speed_x, speed_y, width, height, image){
	//paddle, tetris block, block
	
	this.position = position;
	this.speed_x = speed_x;
	this.speed_y = speed_y;
	this.width = width;
	this.height = height;
	this.image = image;
	this.show = true;

	//show methods
	this.switch_show = function(){
		if (this.show == true){
			this.show = false;
		}
		else {
			this.show = true;
		}
	};

	this.set_show = function(bool){
		this.show = bool;
	};

	this.off_show = function(){
		this.show = false;
	};

	this.on_show = function(){
		this.show = true;
	};

	this.get_show = function(){
		return this.show;
	};

	this.get_obj = function(){
		return this.obj;
	};

	this.get_game_object = function(){
		return [this.obj, this.show];
	};

	this.get_speed_x = function(){
		return this.speed_x;
	};

	this.get_speed_y = function(){
		return this.speed_y;
	};

	this.set_speed_x = function(speed){
		this.speed_x = speed;
	};

	this.set_speed_y = function(speed){
		this.speed_y = speed;
	};

	this.set_position = function(pos){
		this.position = pos;
	};

	this.get_position = function(){
		return this.position;
	};

	this.reverse_x_speed = function(){
		this.speed_x = -this.speed_x;
	};

	this.reverse_y_speed = function(){
		this.speed_y = -this.speed_y;
	};

	this.get_width = function() {
		return this.width;
	};
	this.get_height = function() {
		return this.height;
	};


	//checks if two objects intersect
	this.intersect = function(paddle){
		var paddle_top = paddle.get_position().get_y();
		var paddle_bottom = paddle_top + paddle.get_height();
		var paddle_left = paddle.get_position().get_x();
		var paddle_right = paddle_left + paddle.get_width();
		var block_top = this.position.get_y();
		var block_bottom = block_top + this.height;
		var block_left = this.position.get_x();
		var block_right = block_left + this.width;
  		// a - paddle
  		// b - block
  		return (paddle_left <= block_right &&
          block_left <= paddle_right &&
          paddle_top <= block_bottom &&
          block_top <= paddle_bottom);
	};
}