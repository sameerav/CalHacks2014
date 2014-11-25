function Block(position, image) {
	this.position = position;
	this.image = image;
	this.width = 20;
	this.height = 20;
	this.speed_x = 10;
	this.speed_y = 10;
	
	this.increment_block_position = function(amount_x,amount_y) {
		this.position.increment_position(amount_x,amount_y);
	};

	this.render = function(ctx) {
		ctx.drawImage(image, this.get_position().get_x(), 
			this.get_position().get_y(), this.get_width(), this.get_height());
	}

	this.apply_touch_wall = function(canvas,player) {
		if(this.get_position().get_x() < 0) {
			this.set_position(new Position(0, this.get_position().get_y()));
			player.increment_score();
			this.reverse_x_speed();
		} else if(this.get_position().get_x() > canvas.width) {
			this.set_position(new Position(canvas.width, this.get_position().get_y()));
			player.increment_score();
			this.reverse_x_speed();
		} else if(this.get_position().get_y() < 0) {
			this.set_position(new Position(this.get_position().get_x(),0));
			this.reverse_y_speed();
		} else if(this.get_position().get_y() > canvas.height) {
			this.set_position(new Position(this.get_position().get_x(),canvas.height));
			this.reverse_y_speed();
		}
	};
};

Block.prototype = new Game_object();
Block.prototype.constructor = Block;