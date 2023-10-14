var Game = function Game() {
	var spriteCanvas, spriteContext;
	var currentScene;
	var SCREENRATIO = .85;
	var _state = -1;
	var POKER = 1;//states


	this.init = function() {
		//this.bgCanvas = document.getElementById('background');
		this.spriteCanvas = document.getElementById('sprite');

		width = this.spriteCanvas.width;
		height = this.spriteCanvas.height;

		window.addEventListener("keydown", function(evt) { currentScene.keydown(evt); }, false);
		this.spriteCanvas.addEventListener("mousedown", function(evt) {
			evt.preventDefault();
			currentScene.mousedown(evt);
		}, false);
		this.spriteCanvas.addEventListener("mouseup", function(evt) {
			evt.preventDefault();
			currentScene.mouseup(evt);
		}, false);
		this.spriteCanvas.addEventListener("moustout", function(evt) {
			evt.preventDefault();
			currentScene.mouseout(evt);
		}, false);
		this.spriteCanvas.addEventListener("mousemove", function(evt) {
			evt.preventDefault();
			currentScene.mousemove(evt);
		}, false);
		this.spriteCanvas.addEventListener("touchstart", function(evt) {
			evt.preventDefault();
			currentScene.touchstart(evt);
		}, false);
		this.spriteCanvas.addEventListener("touchend", function(evt) {
			evt.preventDefault();
			currentScene.touchend(evt);
		}, false);
		this.spriteCanvas.addEventListener("touchcancel", function(evt) {
			evt.preventDefault();
			currentScene.touchcancel(evt);
		}, false);
		this.spriteCanvas.addEventListener("touchmove", function(evt) {
			evt.preventDefault();
			currentScene.touchmove(evt);
		}, false);
		this.spriteCanvas.addEventListener("contextmenu", function(evt) { evt.preventDefault(); }, false);

		if (this.spriteCanvas.getContext) {
			//this.bgContext = this.bgCanvas.getContext('2d');
			this.spriteContext = this.spriteCanvas.getContext('2d');

			//_height = window.innerHeight;
			_width = window.innerWidth;
			//_width = _height*10/16; //10:16 aspect ratio
			_height = _width*10/16;


			this.spriteCanvas.width = _width;
			this.spriteCanvas.height = _height;

			//this.spriteContext.drawImage(resourceRepository.background, 0, _height*SCREENRATIO, _width, _height*(1-SCREENRATIO));

			_state = POKER;
			var m = new Poker();
			m.init(_width, _height);
			m.subscribe(changeScene);
			currentScene = m;

			return true;
		}
		return false;
	};

	changeScene = function(s) {
	};

	this.draw = function() {
		var ctx = this.spriteContext;
		currentScene.draw(ctx);
	};

	this.update = function() {
		currentScene.update();
	};

	// Start the animation loop
	this.start = function() {
		animate();
	};
}
