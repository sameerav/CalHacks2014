//Set up canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 1200;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.jpg";

// Paddle image

var paddleReady = false;
var paddleImage = new Image();
paddleImage.onload = function () {
	paddleReady = true;
};
paddleImage.src = "images/paddle.png";

// Ball image

var blockReady = false;
var blockImage = new Image();
blockImage.onload = function () {
	blockReady = true;
};
blockImage.src = "images/ball.png";

var static_left = [];
var static_right = [];
var active = [new Tetris_blocks(new Position(canvas.width/2,canvas.height/2),7,blockImage)];
//var active = [];
var player1 = new Player(new Paddle(new Position(5*canvas.width/20, canvas.height/2), paddleImage));
var player2 = new Player(new Paddle(new Position(15*canvas.width/20, canvas.height/2), paddleImage));
var paddle_left = player1.get_paddle();
var paddle_right = player2.get_paddle();
//var block = new Block(new Position(canvas.width/2, canvas.height/2), blockImage);
//var tetris_block = new Tetris_blocks(new Position(200,200),7,blockImage);
var left_won_game = false;
var right_won_game = false;
var game_ended = false;


var reset = function(){
	static_left = [];
	static_right = [];
	active = [new Tetris_blocks(new Position(canvas.width/2,canvas.height/2),7,blockImage)];
	player1 = new Player(new Paddle(new Position(5*canvas.width/20, canvas.height/2), paddleImage));
	player2 = new Player(new Paddle(new Position(15*canvas.width/20, canvas.height/2), paddleImage));
	paddle_left = player1.get_paddle();
	paddle_right = player2.get_paddle();
	//tetris_block = new Tetris_blocks(new Position(200,200),7,blockImage);
	left_won_game = false;
	right_won_game = false;
	game_ended = false;

}



// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	var i = 0;
	while (i < active.length) {
		if (e.keyCode == 65 && active[i].get_speed_x() > 0 || 
			e.keyCode == 39 && active[i].get_speed_x() < 0) {
			active[i].rotate_tetris_block();
		}
		i++;
	
	}

	if(e.keyCode == 68) {
		//console.log(left_add.length);
		var val = paddle_left.tetris_block_generator(blockImage, canvas);
		if (val){
			active.push(val);
		}
	}
	if(e.keyCode == 37) {
		var val = paddle_right.tetris_block_generator(blockImage, canvas);
		if (val){
			active.push(val);
		}
	}
	

	keysDown[e.keyCode] = true;
	//console.log(active.length);
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Update game objects
var update = function (modifier) {
	if (38 in keysDown && !paddle_right.is_off_screen(canvas)) { // Player holding up
		paddle_right.increment_paddle_position(0, 0-paddle_left.get_speed()
			* modifier);
	}
	if (40 in keysDown && !paddle_right.is_off_screen(canvas)) { // Player holding down
		paddle_right.increment_paddle_position(0, paddle_left.get_speed()
			* modifier);
	}
	if (87 in keysDown && !paddle_left.is_off_screen(canvas)) { //Player holding w
		paddle_left.increment_paddle_position(0, 0-paddle_left.get_speed()
			* modifier);
	}

	if (83 in keysDown && !paddle_left.is_off_screen(canvas)) {
		paddle_left.increment_paddle_position(0, paddle_left.get_speed()
			* modifier);
	}

	var i = 0;
	while (i < active.length) {
		tetris = active[i];
		blocks_and_wall(tetris, i);
		if (tetris.get_show()){
			blocks_and_paddle(tetris);
			blocks_and_blocks(tetris, i);
		}
		i++;
	}
};

var update2 = function (modifier) {
	//console.log("running update2");
	var i = 0;
	while (i < active.length) {
		tetris = active[i];
		blocks_and_wall(tetris, i);
		if (tetris.get_show()){
			blocks_and_paddle(tetris);
			blocks_and_blocks(tetris, i);
		}
		i++;
	}

	if (38 in keysDown && !paddle_right.is_off_screen(canvas)) { // Player holding up
		paddle_right.increment_paddle_position(0, 0-paddle_left.get_speed()
			* modifier);
	}
	if (40 in keysDown && !paddle_right.is_off_screen(canvas)) { // Player holding down
		paddle_right.increment_paddle_position(0, paddle_left.get_speed()
			* modifier);
	}
	if (active.length == 0){
		if (paddle_left.get_position().get_y() < canvas.height/2){
			paddle_left.increment_paddle_position(0, paddle_left.get_speed()
			* modifier);
		}
		else {
			paddle_left.increment_paddle_position(0, 0-paddle_left.get_speed()
			* modifier);
		}
	}

	else if (!paddle_left.is_off_screen(canvas)){
		//console.log(paddle_left.get_position());
		//console.log(paddle_left.get_optimum(active)*modifier);
		paddle_left.increment_paddle_position(0, paddle_left.get_optimum(active, canvas)*modifier);
		//console.log(paddle_left.get_position());
	}
};

var blocks_and_paddle = function(block){
	if (block.tetris_intersect(paddle_left)){
		var factor = block.calculate_intersect(paddle_left, block.tetris_intersect(paddle_left));
		block.set_speed_y(factor * Math.abs(block.get_speed_x()));
		block.reverse_x_speed();
	}
	if (block.tetris_intersect(paddle_right)){
		var factor = block.calculate_intersect(paddle_right, block.tetris_intersect(paddle_right));
		block.set_speed_y(factor * Math.abs(block.get_speed_x()));
		block.reverse_x_speed();
	}
};

var blocks_and_wall = function(block, index){
	block.wall_intersect(canvas);
	//move from active to static
	if (block.get_show()){
		//this means that it didnt intersect
		block.move();
	}
	else {
		block.realign2(false);
		
		active.splice(index,index+1);
		if (block.get_position().get_x() < canvas.width/2){
			static_left.push(block);
			//console.log(static_left.length);
		}
		else{
			static_right.push(block);
			//console.log(static_right.length);
		}
	}
};

var blocks_and_blocks = function(block, index){
	var i = 0;
	while (i < static_right.length){
		if (block.tetris_intersect_tetris(static_right[i])){
			block.set_show(false);
			block.realign2(static_right[i]);
			static_right.push(block);
			active.splice(index, index+1);
			//console.log(static_right.length);
			//console.log(active.length);
			break;
		}
		i++;
	}
	i=0;
	while (i < static_left.length){
		if (block.tetris_intersect_tetris(static_left[i])){
			block.set_show(false);
			block.realign2(static_left[i]);
			static_left.push(block);
			active.splice(index, index+1);
			//console.log(static_left.length)
			//console.log(active.length);
			break;
		}
		i++;
	}
};


// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0,canvas.width,canvas.height);
	}

	if (paddleReady) {

		paddle_left.render(ctx);
		paddle_right.render(ctx);
	}

	// console.log(static_right)

	if (blockReady) {
		//block.render(ctx);

		var i =0;
		while (i < active.length) {
			active[i].render(ctx);
			i++;
		}
		i = 0;
		while (i < static_left.length){
			static_left[i].render(ctx);
			i++;
		}
		i = 0;
		while (i < static_right.length){
			static_right[i].render(ctx);
			i++;
		}
	
	}

	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "20px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Player 1: " + paddle_left.get_limit(), 32, 32);
	ctx.fillText("Player 2: " + paddle_right.get_limit(), canvas.width - (32 + 115), 32);

	if (left_won_game == true && right_won_game == true){
		ctx.fillText("The players tied!", canvas.width/2, canvas.height/2);
	}

	else if (left_won_game == true){
		ctx.fillText("Player 1 won the game!", canvas.width/2, canvas.height/2);
	}

	else if (right_won_game == true){
		ctx.fillText("Player 2 won the game!", canvas.width/2-canvas.width/5, canvas.height/2);
	}
};

var check_for_wins = function(){
	var i = 0;
	var max = 0;
	while (i < static_left.length){
		if (static_left[i].get_rightmost_position(canvas) > max){
			max = static_left[i].get_rightmost_position(canvas);
		}
		i++;
	}

	if (max > paddle_left.get_position().get_x()){
		right_won_game = true;
		game_ended = true;
	}

	i = 0;
	var min = canvas.width;
	while (i < static_right.length){
		if (static_right[i].get_leftmost_position(canvas) < min){
			min = static_right[i].get_leftmost_position(canvas);
		}
		i++;
	}

	if (min < paddle_right.get_position().get_x()){
		left_won_game = true;
		game_ended = true;
	}

	if (paddle_left.get_limit() == 0 && paddle_right.get_limit() == 0 && active.length == 0){
		game_ended = true;
		left_won_game = true;
		right_won_game = true;
	}

	/**if (static_right.length > 15){
		game_ended = true;
		left_won_game = true;
	}

	if (static_left.length > 15){
		game_ended = true;
		right_won_game = true;
	}*/

};


var main = function () {
	//console.log("running main 1");
	if (!game_ended){
		check_for_wins();
		var now = Date.now();
		var delta = now - then;
		update(delta / 1000);
		render();
		then = now;
	}
	else{
		prompt("Ready to play again?");
		game_ended = false;
		reset();
	}

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

var main2 = function () {
	//console.log("running main 2");
	if (!game_ended){
		check_for_wins();
		var now = Date.now();
		var delta = now - then;
		update2(delta / 1000);
		render();
		then = now;
	}
	else{
		prompt("Ready to play again?");
		game_ended = false;
		reset();
	}

	// Request to do this again ASAP
	requestAnimationFrame(main2);
};

//Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
var input = prompt("Do you want to play one player or two player? Enter '1' for one player and '2' for two player.");
//console.log(input);
if (input == '1'){
	main2();
}
else {
	main();
}


