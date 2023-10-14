var resourceRepository = new function() {
	// Define images
	this.tileSheet = new Image();
	this.font = new Image();
	this.cards = new Image();
	this.dealer = new Image();
	this.dealer2 = new Image();

	this.gameover = new Audio();
	this.levelup = new Audio();
	this.cleared = new Audio();
	this.spawn = new Audio();
	this.acquire = new Audio();
	this.boom = new Audio();
	this.schwing = new Audio();

	// Ensure all images have loaded before starting the game
	var numImages = 11;
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
		imageLoaded();
	}
	this.levelup.oncanplay = function() {
		imageLoaded();
	}
	this.cleared.oncanplay = function() {
		imageLoaded();
	}
	this.spawn.oncanplay = function() {
		imageLoaded();
	}
	this.acquire.oncanplay = function() {
		imageLoaded();
	}
	this.boom.oncanplay = function() {
		imageLoaded();
	}
	this.schwing.oncanplay = function() {
		imageLoaded();
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

 	// Set images src
	this.tileSheet.src = "images/tiles.png";
	this.font.src = "images/font.png";
	this.cards.src = "images/cards.png";
	this.dealer.src = "images/dealer_retro.png";

	this.gameover.src = "sounds/gameover.wav";
	this.levelup.src = "sounds/levelup.wav";
	this.cleared.src = "sounds/cleared.wav";
	this.spawn.src = "sounds/heal.wav";
	this.acquire.src = "sounds/get.wav";
	this.boom.src = "sounds/boom.wav";
	this.schwing.src = "sounds/sching.wav";

	this.gameover.load();
	this.levelup.load();
	this.cleared.load();
	this.spawn.load();
	this.acquire.load();
	this.boom.load();
	this.schwing.load();
}