var Hand = function Hand() {
	var cards = new Array();
	var ace = false;

	this.reset = function() {
		if (cards.length > 0) cards.splice(0, cards.length);
		ace = false;
	};

	this.add = function(c) {
		//if (c != undefined) {
			if (c.value == 1) ace = true;
			cards.push(c);
		//}
	};

	this.value = function() {
		var count = 0;
		for (let i = 0; i < cards.length; i++) {
			count += cards[i].value;
		}
		if (count <= 11 && ace) count+=10;
		return count;
	};

	this.size = function() {
		return cards.length;
	};

	this.get = function(i) {
		if (i < cards.length) return cards[i];
		else console.log("Out of bounds!");
	};
}