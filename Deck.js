var Deck = function Deck() {
	var CLUBS = 0, DIAMONDS = 1, SPADES = 2, HEARTS = 3;//suits
	var cards = new Array();
	var size; //number of decks in the shoe
	var position = 0;

	this.init = function(s) {
		size = s;

		for (let i = 0; i < size; i++) {
			for (let j = 0; j < 52; j++) {
				var c = new Card();
				c.suit = Math.floor(j/13);
				c.face = j%13 + 1;
				if (c.face > 10) c.value = 10;
				else c.value = c.face;
				cards.push(c);
			}
		}
	};

	swap = function(a, b) {
		var temp = cards[a];
		cards[a] = cards[b];
		cards[b] = temp;
	};

	this.shuffle = function() {
		position = 0;

		for (let i = 0; i < size*52; i++) {
			swap(i, Math.floor(Math.random()*(size*52)));
		}
	};

	this.deal = function() {
		if (position < size*52) return cards[position++];
		else {
			this.shuffle();
			return cards[position++];
			//console.log("Deck out of cards!");
		}
	};
}