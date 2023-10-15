var resourceRepository = new function() {
	// Define images
	this.tileSheet = new Image();
	this.font = new Image();
	this.cards = new Image();
	this.dealer = new Image();
	this.volume = new Image();

	this.gameover = new Audio();
	this.win = new Audio();

	// Ensure all images have loaded before starting the game
	var numImages = 5;
	var numLoaded = 0;
	function imageLoaded() {
		numLoaded++;
		if (numLoaded === numImages) {
			document.getElementById("loading").innerHTML = "";
			window.init();
		}
		else document.getElementById("loading").innerHTML = "loading . . . "+Math.round((numLoaded/numImages)*100)+"%";
	}
	this.gameover.oncanplay = function() {
		//imageLoaded();
	}
	this.win.oncanplay = function() {
		//imageLoaded();
	}
	this.tileSheet.onload = function() {
		imageLoaded();
	}
	this.font.onload = function() {
		imageLoaded();
	}
	this.cards.onload = function() {
		imageLoaded();
	}
	this.dealer.onload = function() {
		imageLoaded();
	}
	this.volume.onload = function() {
		imageLoaded();
	}

 	// Set images src
	this.tileSheet.src = "images/tiles.png";
	this.font.src = "images/font.png";
	this.cards.src = "images/cards.png";
	this.dealer.src = "images/dealer_retro.png";
	this.volume.src = "images/volume.png";

	this.gameover.src = "sounds/gameover.wav";
	this.win.src = "sounds/get.wav";

	this.gameover.load();
	this.win.load();
}