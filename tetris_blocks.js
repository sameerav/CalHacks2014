function Tetris_blocks(position, type, image){
	
	this.position = position;
	this.type = type;
	this.pos_list = new Array();
	this.block_array = new Array();
	this.image = new Image();
	this.speed_x = 5;
	this.speed_y = 2.5;
	this.height = 20;
	this.width = 20;
	
	if (this.type == 1){
		pos1 = position;
		pos2 = new Position(pos1.get_x() + this.height, pos1.get_y());
		pos3 = new Position(pos2.get_x() + this.height, pos2.get_y());
		pos4 = new Position(pos3.get_x() + this.height, pos3.get_y());
		this.pos_list = [pos1, pos2, pos3, pos4];
		this.image.src = "images/block1.png";

	} else if (this.type == 2){
		pos1 = position;
		pos2 = new Position(pos1.get_x(), pos1.get_y() + this.height);
		pos3 = new Position(pos2.get_x() + this.height, pos2.get_y());
		pos4 = new Position(pos3.get_x() + this.height, pos3.get_y());
		this.pos_list = [pos1, pos2, pos3, pos4];
		this.image.src = "images/block2.png";

	} else if (this.type == 3){
		pos1 = position;
		pos2 = new Position(pos1.get_x() + this.height, pos1.get_y());
		pos3 = new Position(pos2.get_x() + this.height, pos2.get_y());
		pos4 = new Position(pos3.get_x(), pos3.get_y() - this.height);
		this.pos_list = [pos1, pos2, pos3, pos4];
		this.image.src = "images/block3.png";

	} else if (this.type == 4){
		pos1 = position;
		pos2 = new Position(pos1.get_x() + this.height, pos1.get_y());
		pos3 = new Position(pos2.get_x(), pos2.get_y() + this.height);
		pos4 = new Position(pos3.get_x() - this.height, pos3.get_y());
		this.pos_list = [pos1, pos2, pos3, pos4];
		this.image.src = "images/block4.png";

	} else if (this.type == 5){
		pos1 = position;
		pos2 = new Position(pos1.get_x() + this.height, pos1.get_y());
		pos3 = new Position(pos2.get_x(), pos2.get_y() - this.height);
		pos4 = new Position(pos3.get_x() + this.height, pos3.get_y());
		this.pos_list = [pos1, pos2, pos3, pos4];
		this.image.src = "images/block5.png";

	} else if (this.type == 6){
		pos1 = position;
		pos2 = new Position(pos1.get_x() + this.height, pos1.get_y());
		pos3 = new Position(pos2.get_x() + this.height, pos2.get_y());
		pos4 = new Position(pos3.get_x() - this.height , pos3.get_y() - this.height);
		this.pos_list = [pos1, pos2, pos3, pos4];
		this.image.src = "images/block6.png";

	} else {
		pos1 = position;
		pos2 = new Position(pos1.get_x() + this.height, pos1.get_y());
		pos3 = new Position(pos2.get_x(), pos2.get_y() + this.height);
		pos4 = new Position(pos3.get_x() + this.height, pos3.get_y());
		this.pos_list = [pos1, pos2, pos3, pos4];
		this.image.src = "images/block7.png";
	}

	var i = 0;
	while (i < this.pos_list.length){
		this.block_array[this.block_array.length] = new Block(this.pos_list[i], this.image);
		i++;
	}

	this.get_block_array = function(){
		return this.block_array;
	};

	this.move = function(){
		var i = 0;
		while (i < this.block_array.length){
			this.block_array[i].increment_block_position(this.speed_x, this.speed_y);
			i++;
		}
	};

	this.get_rightmost_position = function(canvas){
		var i = 0;
		var maxx = 0;
		var temp;
		while (i < this.block_array.length){
			temp = this.block_array[i].get_position().get_x();
			if (temp > maxx){
				maxx = temp;
			}
			i++;
		}
		return maxx;
	};

	this.get_leftmost_position = function(canvas){
		var i = 0;
		var minx = canvas.width;
		var temp;
		while (i < this.block_array.length){
			temp = this.block_array[i].get_position().get_x();
			if (temp < minx){
				minx = temp;
			}
			i++;
		}
		return minx;
	};

	this.rotate_tetris_block = function(){
		if (this.type == 4){
			return false;
		}
		
		var origin = new Position(0,0);
		if (this.type == 1 || this.type == 2 || this.type == 6){
			origin = this.block_array[1].get_position();
		};

		if (this.type == 3 || this.type == 5 || this.type == 7){
			origin = this.block_array[2].get_position();
		};

		var points = new Array();
		var i = 0;
		while (i < this.block_array.length){
			x = this.block_array[i].get_position().get_x() - origin.get_x();
			y = this.block_array[i].get_position().get_y() - origin.get_y();
			points[points.length] = new Position(-1*y + origin.get_x(), x + origin.get_y());
			i++;
		};
		i = 0;
		this.block_array = new Array();
		while (i < points.length){
			this.block_array[this.block_array.length] = new Block(points[i], this.image);
			i++;
		};
	};
	
	this.render = function(ctx) {
		var i = 0;
		var b_arr = this.get_block_array(); 

		while (i < b_arr.length) {
			var curr_block_pos = b_arr[i].get_position();
			//console.log(curr_block_pos)
			ctx.drawImage(this.image, curr_block_pos.get_x(), curr_block_pos.get_y()
				,this.get_width(), this.get_height());
			i++;
		}
	};

	this.calculate_intersect = function(paddle, block) {
		var paddle_center_y = paddle.position.get_y() + paddle.get_height()/2;
		var block_center_y = block.position.get_y() + block.get_height()/2;

		var distance_y = block_center_y - paddle_center_y;
		var factor = distance_y * 2 / paddle.get_height();

		return factor;

		//paddle_center_pos
		//block_center_pos
	};
	this.tetris_intersect = function(obj){
		//ONLY USE THIS METHOD TO CHECK TETRIS BLOCKS AND NONTETRIS BLOCKS
		var i = 0;
		while (i < this.block_array.length){
			if (this.block_array[i].intersect(obj)){
				return this.block_array[i];
			}
			i++;
		}
		return false;
	};


	this.wall_intersect = function(canvas){
		//850, 480
		top_wall = new Game_object(new Position(-10,-10), 0, 0,  canvas.width + 20, 10, this.image);
		bottom_wall = new Game_object(new Position(-10,canvas.height), 0, 0,  canvas.width + 20, 10, this.image);
		left_wall = new Game_object(new Position(-10,-10), 0, 0,  10, canvas.height + 20, this.image);
		right_wall = new Game_object(new Position(canvas.width,-10), 0, 0,  10, canvas.height + 20, this.image);

		if (this.tetris_intersect(top_wall) || this.tetris_intersect(bottom_wall)){
			this.reverse_y_speed();
		};
		if (this.tetris_intersect(left_wall) || this.tetris_intersect(right_wall)){
			this.set_speed_x(0);
			this.set_speed_y(0);
			this.show = false;
		};
	};

	this.tetris_intersect_tetris = function(t_block){
		var i = 0;
		while (i < this.block_array.length){
			if (t_block.tetris_intersect(this.block_array[i])){
				return true;
			}
			i++;
		}
		return false;
	};

	this.realign = function(){
		var xpos = Math.floor(this.position.get_x()/ this.get_height()) * this.get_height();
		var ypos = Math.floor(this.position.get_y()/ this.get_height()) * this.get_height();

		//console.log(this.position);
		this.position = new Position(xpos, ypos);
		//console.log(this.position)

		var i = 0;
		while (i < this.block_array.length){
			xpos = Math.floor(this.block_array[i].get_position().get_x() / this.get_height()) * this.get_height();
			ypos = Math.floor(this.block_array[i].get_position().get_y() / this.get_height()) * this.get_height();
			this.block_array[i].set_position(new Position(xpos, ypos));
			i++;
		}
	};

	this.realign2 = function(block){



		//console.log(this.position);
		//console.log(this.position)

		var i = 0;
		while (i < this.block_array.length){
			var x_pos_lower = Math.floor(this.block_array[i].position.get_x()/ this.get_height()) * this.get_height();
			var y_pos_lower = Math.floor(this.block_array[i].position.get_y()/ this.get_height()) * this.get_height();
			var x_pos_higher = x_pos_lower + this.get_height();
			var y_pos_higher = y_pos_lower + this.get_height();

			temp_block = new Block(new Position(x_pos_lower, y_pos_lower), null)

			var xpos = 0;
			var ypos = 0;

			if (this.get_speed_x < 0 && temp_block.intersect(block)) {
				xpos = x_pos_higher
			} else {
				xpos = x_pos_lower

			}

			temp_block = new Block(new Position(xpos, y_pos_lower), null)

			if (this.get_speed_y < 0 && temp_block.intersect(block)) {
				ypos = y_pos_higher
			} else {
				ypos = y_pos_lower

			}
			this.block_array[i].set_position(new Position(xpos, ypos));
			i++;
		}
	};
};

Tetris_blocks.prototype = new Game_object();
Tetris_blocks.prototype.constructor = Tetris_blocks;