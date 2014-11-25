function Paddle(position, image) {
	this.position = position;
	this.image = image;
	this.width = 20;
	this.height = 80;
	this.speed_y = 600;
	this.limit = 20;

	this.increment_paddle_position = function(amount_x,amount_y) {
		this.position.increment_position(amount_x,amount_y);
	};

	this.is_off_screen = function (canvas) {
		if (this.get_position().get_y() > (canvas.height - this.get_height())) {
			this.get_position().set_y(canvas.height - paddle_left.height);
			return true;
		} else if(this.get_position().get_y() < 0) {
			this.get_position().set_y(0);
			return true;
		}
		return false;
	 
	};

	this.get_speed = function() {
		return this.speed_y;
	};

	this.get_limit = function(){
		return this.limit;
	};

	this.render = function(ctx) {
		ctx.drawImage(image, this.get_position().get_x(),
		 this.get_position().get_y(),this.get_width(),
			this.get_height());
	};

	this.tetris_block_generator = function(blockImage, canvas){
		
		if (this.limit == 0){
			return false;
		}
		else{
			//console.log(this.limit);
			this.limit--;
			var speedx;
			if (Math.abs(this.position.get_x() - canvas.width) < canvas.width/2){
				speedx = -10;
			}
			else {
				speedx = 10;
			}
			var type = Math.floor(Math.random()*7) + 1;
			var ypos = this.position.get_y() + this.get_height()/2;
			var xpos;
			if (speedx == -10){
				if (type == 1){
					xpos = this.position.get_x() - 4*this.width;
				}
				if (type == 4){
					xpos = this.position.get_x() -2*this.width;
				}
				else {
					xpos = this.position.get_x() -3 * this.width;
				}
			}
			else{
				xpos = this.position.get_x() + this.width;
			}
			var pos = new Position(xpos, ypos);

			var temp = new Tetris_blocks(pos, type, blockImage);
			if (speedx < 0){
				temp.reverse_x_speed();
			}
			return temp;
		}
	};

	this.get_optimum = function(active, canvas){
		//returns how far the paddle should move

		var i = 0;
		var closest = canvas.width;
		var close_block;
		var found = false;
		for (i = 0; i < active.length; i++){
			if (active[i].get_position().get_x() - this.get_position().get_x() < closest){
				closest = active[i].get_position().get_x() - this.get_position().get_x();
				close_block = active[i];
				found = true;
			}
		}
		if (found){
			
			var time_left = Math.abs((close_block.get_position().get_x() - this.get_position().get_x())/close_block.get_speed_x());
			var posy = close_block.get_position().get_y() + (close_block.get_speed_y() * time_left);
			if (posy < 0)
			{
				posy = 0;
			}
			if (posy > canvas.height)
			{
				posy = canvas.height;
			}
			//console.log(posy, "position of block", this.get_position().get_y(), "position of paddle");
			if (posy > this.get_position().get_y()){
				x = this.get_speed_y();
				//console.log(x, "first");
				return x;
			}
			else {
				//console.log(this.get_speed_y(), "second");
				return 0-this.get_speed_y();
			}
		}
		else{
			//console.log(0);
			return this.get_position().get_y() - canvas.height;
		}
	};
};

Paddle.prototype = new Game_object();
Paddle.prototype.constructor = Paddle;
