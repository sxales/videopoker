//TODO:
//INSERT SOUNDS
//DEALER DIALOG
//ROYALFLUSH SCENE?
//SAVING

var Poker = function() {
	var _width, _height;//in pixels
	var _tick = 0;
	var _nexttick = 0;
	var _state;
	var _index = 0;
	var _fontsize = 0;
	var _cardheight = 0, _cardwidth = 0;
	var mute = false;
	var debug = false;
	var pause = false;
	var volume = .2;
	const TITLE = 0, SETBET = 5, DEAL = 10, KEEPDISCARD = 20, DRAW = 30, SCORE = 40, RESET = 50, GAMEOVER = 666;//states
	const BLUE = 5, GRAY = 8, GREEN = 4, RED = 3, SUPER = 2, WHITE = 1, TEAL = 5, YELLOW = 6, PINK = 7, LOGO = 0; //font colors
	const ROYALFLUSH = 250, STRAIGHTFLUSH = 50, FOUROFAKIND = 25, FULLHOUSE = 9, FLUSH = 6, STRAIGHT = 4, THREEOFAKIND = 3, TWOPAIR = 2, JACKSORBETTER = 1, NOTHING = 0;
	const DEALERSIZE = 512;
	const CLUBS = 0, DIAMONDS = 1, SPADES = 2, HEARTS = 3;//suits
	const CARDHEIGHT = 96, CARDWIDTH = 71;
	const SCREENRATIO = .20; //percentage of screen that is table versus buttons
	var messages = new Array();
	var subscribers = new Array();

	var btndown;
	var cardback = { suit: 0, face: 14, value: -1 };

	var numberofhands = 0;

	var hold = [ false, false, false, false, false ];
	var btnhold1 = new Button();
	var btnhold2 = new Button();
	var btnhold3 = new Button();
	var btnhold4 = new Button();
	var btnhold5 = new Button();

	var btndraw = new Button();
	var btndeal = new Button();

	var btnquit = new Button();

	var btnincrease = new Button();
	var btndecrease = new Button();
	var btnconfirm = new Button();

	var bank = 500;
	var defaultbet = 50;
	var bet = defaultbet;
	var displayedbank = bank;

	var shoe = new Deck();
	var playerhand = new Array();

	var outcome = NOTHING;

	this.subscribe = function(s) {
		subscribers.push(s);
	};

	this.unsubscribe = function(s) {
		for (var i = 0; i<subscribers.length; i++) {
			if (subscribers[i] == s) {
				subscribers.splice(i);
				break;
			}
		}
	};

	notify = function(b) {
		for (var i = 0; i<subscribers.length; i++) {
			subscribers[i].call(this,b);
		}
	};

	this.init = function(w,h) {
		_height = h;
		_width = w;

		_fontsize = (_width*(1-SCREENRATIO))/(25);

		_tick = 0;

		_cardwidth = (_width*(1-SCREENRATIO)-_fontsize)/5;
		_cardheight = _cardwidth*CARDHEIGHT/CARDWIDTH;
		var vpos = (_height-_cardheight)/2;
		var hpos = _width*SCREENRATIO+(_width*(1-SCREENRATIO)-_cardwidth*5)/2;

		var buttonheight = _fontsize*2;
		var buttonwidth = _width/7;

		shoe.init(1);
		//shoe.shuffle();

		btnhold1.init("", hpos, vpos, _cardwidth, _cardheight);
		btnhold2.init("", hpos+_cardwidth*1, vpos, _cardwidth, _cardheight);
		btnhold3.init("", hpos+_cardwidth*2, vpos, _cardwidth, _cardheight);
		btnhold4.init("", hpos+_cardwidth*3, vpos, _cardwidth, _cardheight);
		btnhold5.init("", hpos+_cardwidth*4, vpos, _cardwidth, _cardheight);

		btndraw.init("draw", _width*SCREENRATIO+(_width*(1-SCREENRATIO)-buttonwidth*2)/2, _height-buttonheight-_fontsize/2, buttonwidth*2, buttonheight);
		btndeal.init("deal", _width*SCREENRATIO+(_width*(1-SCREENRATIO)-buttonwidth*2)/2, _height-buttonheight-_fontsize/2, buttonwidth*2, buttonheight);
		btnconfirm.init("done", _width*SCREENRATIO+(_width*(1-SCREENRATIO)-buttonwidth*2)/2, _height-buttonheight-_fontsize/2, buttonwidth*2, buttonheight);
		btnquit.init("X", _width-_fontsize*2, 0, _fontsize*2, _fontsize*2);

		btnincrease.init("+", _width*SCREENRATIO+(_width*(1-SCREENRATIO)-_fontsize*3)/2, (_height/2-_fontsize*3.5), _fontsize*3, _fontsize*3);
		btndecrease.init("-", _width*SCREENRATIO+(_width*(1-SCREENRATIO)-_fontsize*3)/2, (_height/2+_fontsize*0.5), _fontsize*3, _fontsize*3);

		setVolume(volume);
		//if (typeof(Storage) !== "undefined") load();

		_state = TITLE;
	};

	this.keydown = function(evt) {
		if (evt.key == "m") {
			mute = !mute;
		}
		else if (evt.key == "d") {
			debug = !debug;
		}
	};

	this.mousedown = function(evt) {
		if (evt.button == 0) {
			btndown =  window.setTimeout(rightClick, 500, evt.clientX, evt.clientY);//long press
		}
	};

	this.mouseup = function(evt) {
		if (btndown) window.clearTimeout(btndown);
		if (evt.button == 0) {
			click(evt.clientX, evt.clientY); //left click
		}
		else rightClick(evt.clientX, evt.clientY);
	};

	this.mouseout = function(evt) {
		if (btndown) window.clearTimeout(btndown);
	};

	this.mousemove = function(evt) {
		btnhold1.check(evt.clientX, evt.clientY);
		btnhold2.check(evt.clientX, evt.clientY);
		btnhold3.check(evt.clientX, evt.clientY);
		btnhold4.check(evt.clientX, evt.clientY);
		btnhold5.check(evt.clientX, evt.clientY);
		btndraw.check(evt.clientX, evt.clientY);
		btndeal.check(evt.clientX, evt.clientY);
		btnquit.check(evt.clientX, evt.clientY);
		btnconfirm.check(evt.clientX, evt.clientY);
		btnincrease.check(evt.clientX, evt.clientY);
		btndecrease.check(evt.clientX, evt.clientY);
	};

	this.touchstart = function(evt) {
		btndown =  window.setTimeout(rightClick, 500, evt.touches[0].pageX, evt.touches[0].pageY);//long press
	};

	this.touchend = function(evt) {
		if (btndown) window.clearTimeout(btndown);
		click(evt.changedTouches[0].pageX, evt.changedTouches[0].pageY); //left click
	};

	this.touchcancel = function(evt) {
		if (btndown) window.clearTimeout(btndown);
	};

	this.touchmove = function(evt) {
	};

	rightClick = function(inputX, inputY) {
	};

	click = function(inputX, inputY) {
		if (btnquit.check(inputX, inputY)) {
			messages.splice(0, messages.length);
			joker = 0;
			_state = TITLE;
		}
		else if (_state == TITLE) {
			bank = 500;
			displayedbank = bank;
			numberofhands = 0;
			bet = defaultbet;
			hold = [ false, false, false, false, false ];
			_state = SETBET;
		}
		else if (_state == SETBET && btnconfirm.check(inputX, inputY)) {
			_state = DEAL;
		}
		else if (_state == SETBET && btnincrease.check(inputX, inputY)) {
			if (bet < defaultbet*5) bet += defaultbet;
		}
		else if (_state == SETBET && btndecrease.check(inputX, inputY)) {
			if (bet > defaultbet) bet -= defaultbet;
		}
		else if (_state == DEAL && btndeal.check(inputX, inputY)) {
			bank -= bet;
			playerhand = new Array();
			shoe.shuffle();
			numberofhands++;
			for (let i=0;i<5;i++) playerhand[i] = shoe.deal();
			_state = KEEPDISCARD;
		}
		else if (_state == KEEPDISCARD) {
			if (btnhold1.check(inputX, inputY)) hold[0] = !hold[0];
			else if (btnhold2.check(inputX, inputY)) hold[1] = !hold[1];
			else if (btnhold3.check(inputX, inputY)) hold[2] = !hold[2];
			else if (btnhold4.check(inputX, inputY)) hold[3] = !hold[3];
			else if (btnhold5.check(inputX, inputY)) hold[4] = !hold[4];
			else if (btndraw.check(inputX, inputY)) {
				_index = 0;
				for (let i=0; i<5; i++) {
					if (!hold[i]) playerhand[i] = cardback;
				}
				_state = DRAW;
			}
		}
	};

	this.draw = function(ctx) {
		ctx.clearRect(0, 0, _width, _height);

		//draw title screen
		if (_state == TITLE) {
			var cw = _width/9;
			var ch = _height/4;//cw*CARDHEIGHT/CARDWIDTH;
			var row = Math.ceil(_height/ch);
			var col = Math.ceil(_width/cw);

			for (let i = 0; i < row*col; i++) {
				if (_tick%2 == 0) ctx.drawImage(resourceRepository.cards, CARDWIDTH*(13), CARDHEIGHT*(i%2), CARDWIDTH, CARDHEIGHT, cw*(i%col), ch*(Math.floor(i/col)), cw, ch);
				else ctx.drawImage(resourceRepository.cards, CARDWIDTH*(13), CARDHEIGHT*((i+1)%2), CARDWIDTH, CARDHEIGHT, cw*(i%col), ch*(Math.floor(i/col)), cw, ch);
			}

			var w = _height/2-_fontsize*2;
			var vpos = (_height-w)/2;
			var hpos = (_width-w)/2;
			//draw dealer
			drawBox(ctx, 20, hpos, vpos, w, w);
			var c = row*col*2/5;
			ctx.drawImage(resourceRepository.dealer, DEALERSIZE*0, 0, DEALERSIZE, DEALERSIZE, hpos+5, vpos+5, w-12, w-12);

			var height = _fontsize*2;
			var width = _fontsize*13;
			var vpos = (vpos - _fontsize*2)/2;
			var hpos = (_width-width)/2;

			drawBox(ctx, 20, hpos, vpos-_fontsize/2, width, height);
			writeMessage(ctx, "Video Poker!", SUPER, (_width-_fontsize*12)/2, vpos, _fontsize);

			if (_tick%2 == 0) writeMessage(ctx, "Touch to start", BLUE, (_width-_fontsize*14)/2, w+(_height-w)/2+vpos, _fontsize);
		}

		//draw cards
		if (_state > DEAL && _state < GAMEOVER) {
			var vpos = (_height-_cardheight)/2;
			var hpos = _width*SCREENRATIO+(_width*(1-SCREENRATIO)-_cardwidth*5)/2;
			var fs = _cardwidth/4*0.75;
			for (let i = 0; i < playerhand.length; i++) {
				ctx.drawImage(resourceRepository.cards, CARDWIDTH*(playerhand[i].face-1), CARDHEIGHT*playerhand[i].suit, CARDWIDTH, CARDHEIGHT, hpos+(_cardwidth)*i, vpos, _cardwidth, _cardheight);
				if (hold[i]) writeMessage(ctx, "hold", SUPER, hpos+(_cardwidth*i+(_cardwidth-fs*4)/2), vpos+(_cardheight-fs)/2, fs);
			}
		}
		else if (_state == DEAL) {
			var vpos = (_height-_cardheight)/2;
			var hpos = _width*SCREENRATIO+(_width*(1-SCREENRATIO)-_cardwidth*5)/2;
			for (let i = 0; i < 5; i++) {
				ctx.drawImage(resourceRepository.cards, CARDWIDTH*(cardback.face-1), CARDHEIGHT*cardback.suit, CARDWIDTH, CARDHEIGHT, hpos+(_cardwidth)*i, vpos, _cardwidth, _cardheight);
			}
		}

		//draw buttons
		/*btnhold1.draw(ctx);
		btnhold2.draw(ctx);
		btnhold3.draw(ctx);
		btnhold4.draw(ctx);
		btnhold5.draw(ctx);*/
		if (_state == DEAL) btndeal.draw(ctx);
		else if (_state == KEEPDISCARD) btndraw.draw(ctx);
		else if (_state == SETBET) {
			btnconfirm.draw(ctx);
			btnincrease.draw(ctx);
			btndecrease.draw(ctx);
		}

		//draw scoreboard
		if (_state >= SETBET && _state < GAMEOVER) {
			if (displayedbank < bank) displayedbank += Math.round(bet*0.1);
			else displayedbank = bank;

			var txt = ""+(bet);
			var fs = (_width*(1-SCREENRATIO))/(25);
			var vpos = fs/2;
			var hpos = _width*SCREENRATIO+(_width*(1-SCREENRATIO)-fs*(17+txt.length))/2;

			drawBox(ctx, 20, hpos, vpos, fs*(17+txt.length), fs*2);
			writeMessage(ctx, "bank:", WHITE, hpos+fs/2, vpos+fs/2, fs);
			writeMessage(ctx, fill(displayedbank, 6, "0"), PINK, hpos+fs/2+fs*5, vpos+fs/2, fs);
			writeMessage(ctx, "bet:", WHITE, hpos+fs/2+fs*12, vpos+fs/2, fs);
			writeMessage(ctx, txt, PINK, hpos+fs/2+fs*16, vpos+fs/2, fs);

			//draw dealer
			var fs = (_width*SCREENRATIO)/9;
			var dealerwidth = _width*SCREENRATIO*0.85;
			var vpos = (_height-(dealerwidth+fs*11.75))/2;
			var hpos = (_width*SCREENRATIO-dealerwidth)/2;
			drawBox(ctx, 20, hpos, vpos, dealerwidth, dealerwidth);
			var dealer = Math.floor(bet/defaultbet);
			if (dealer > 6) dealer = 6;
			ctx.drawImage(resourceRepository.dealer, DEALERSIZE*(dealer), DEALERSIZE*0, DEALERSIZE, DEALERSIZE, hpos+5, vpos+5, dealerwidth-12, dealerwidth-12);

			//draw payouts
			hpos = ((_width*SCREENRATIO)-fs*8)/2;
			vpos = vpos+dealerwidth+fs/2;
			if (outcome == ROYALFLUSH && _tick%2 == 0) writeMessage(ctx, "RF"+fill(ROYALFLUSH*bet, 6, "."), LOGO, hpos, vpos+fs*0, fs);
			else writeMessage(ctx, "RF"+fill(ROYALFLUSH*bet, 6, "."), YELLOW, hpos, vpos+fs*0, fs);
			if (outcome == STRAIGHTFLUSH && _tick%2 == 0) writeMessage(ctx, "SF"+fill(STRAIGHTFLUSH*bet, 6, "."), LOGO, hpos, vpos+fs*1.25, fs);
			else writeMessage(ctx, "SF"+fill(STRAIGHTFLUSH*bet, 6, "."), YELLOW, hpos, vpos+fs*1.25, fs);
			if (outcome == FOUROFAKIND && _tick%2 == 0) writeMessage(ctx, "4K"+fill(FOUROFAKIND*bet, 6, "."), LOGO, hpos, vpos+fs*2.5, fs);
			else writeMessage(ctx, "4K"+fill(FOUROFAKIND*bet, 6, "."), YELLOW, hpos, vpos+fs*2.5, fs);
			if (outcome == FULLHOUSE && _tick%2 == 0) writeMessage(ctx, "FH"+fill(FULLHOUSE*bet, 6, "."), LOGO, hpos, vpos+fs*3.75, fs);
			else writeMessage(ctx, "FH"+fill(FULLHOUSE*bet, 6, "."), YELLOW, hpos, vpos+fs*3.75, fs);
			if (outcome == FLUSH && _tick%2 == 0) writeMessage(ctx, "FL"+fill(FLUSH*bet, 6, "."), LOGO, hpos, vpos+fs*5, fs);
			else writeMessage(ctx, "FL"+fill(FLUSH*bet, 6, "."), YELLOW, hpos, vpos+fs*5, fs);
			if (outcome == STRAIGHT && _tick%2 == 0) writeMessage(ctx, "ST"+fill(STRAIGHT*bet, 6, "."), LOGO, hpos, vpos+fs*6.25, fs);
			else writeMessage(ctx, "ST"+fill(STRAIGHT*bet, 6, "."), YELLOW, hpos, vpos+fs*6.25, fs);
			if (outcome == THREEOFAKIND && _tick%2 == 0) writeMessage(ctx, "3K"+fill(THREEOFAKIND*bet, 6, "."), LOGO, hpos, vpos+fs*7.5, fs);
			else writeMessage(ctx, "3K"+fill(THREEOFAKIND*bet, 6, "."), YELLOW, hpos, vpos+fs*7.5, fs);
			if (outcome == TWOPAIR && _tick%2 == 0) writeMessage(ctx, "2P"+fill(TWOPAIR*bet, 6, "."), LOGO, hpos, vpos+fs*8.75, fs);
			else writeMessage(ctx, "2P"+fill(TWOPAIR*bet, 6, "."), YELLOW, hpos, vpos+fs*8.75, fs);
			if (outcome == JACKSORBETTER && _tick%2 == 0) writeMessage(ctx, "JB"+fill(JACKSORBETTER*bet, 6, "."), LOGO, hpos, vpos+fs*10, fs);
			else writeMessage(ctx, "JB"+fill(JACKSORBETTER*bet, 6, "."), YELLOW, hpos, vpos+fs*10, fs);
		}
		else if (_state == GAMEOVER) {
			var w = _height/2-_fontsize*2;
			var vpos = (_height-(w+_fontsize*2.5))/2;
			var hpos = (_width-w)/2;
			//draw dealer
			drawBox(ctx, 20, hpos, vpos, w, w);
			ctx.drawImage(resourceRepository.dealer, DEALERSIZE*8, 0, DEALERSIZE, DEALERSIZE, hpos+5, vpos+5, w-12, w-12);

			writeMessage(ctx, "Game Over!", SUPER, (_width-_fontsize*10)/2, vpos/2, _fontsize);

			drawBox(ctx, 20, (_width-_fontsize*13)/2-_fontsize/2, vpos+w+_fontsize/2, _fontsize*14, _fontsize*2);
			writeMessage(ctx, "See you again", LOGO, (_width-_fontsize*13)/2, vpos+w+_fontsize, _fontsize);

			var timer = ""+Math.round((_nexttick - _tick)/3+1);

			writeMessage(ctx, timer, YELLOW, (_width-_fontsize*timer.length)/2, _height-(vpos/2), _fontsize);
		}

		if (_state > TITLE && _state < GAMEOVER) btnquit.draw(ctx);

		if (_state == SETBET) {
			//var fs = cw*5/(25);
			var fs = (_width*SCREENRATIO)/9;
			var dealerwidth = _width*SCREENRATIO*0.85;
			var vpos = (_height-(dealerwidth+fs*11.75))/2+_fontsize/2;
			var hpos = (_width*SCREENRATIO);

			drawBox(ctx, 20, hpos-_fontsize/2, vpos-_fontsize/2, _fontsize*12, _fontsize*2);
			writeMessage(ctx, "Choose bet!", LOGO, hpos, vpos, _fontsize);
		}

		//draw messages
		for(let i=0; i<messages.length; i++) {
			messages[i].y += messages[i].delta;
			drawBox(ctx, 20, messages[i].x-messages[i].s/2, messages[i].y-messages[i].s/2, messages[i].message.length*messages[i].s+messages[i].s, messages[i].s*2);
			writeMessage(ctx, messages[i].message, messages[i].type, messages[i].x, messages[i].y, messages[i].s);
			//if (messages[i].tick++ >= messages[i].timeout) messages.splice(i--, 1); //remove
		}
	};

	this.update = function() {
		++_tick;

		if (_state < DRAW) {
			_nexttick = _tick + 1;
		}
		else if (_state == DRAW && _nexttick < _tick) {
			_nexttick = _tick + 1;//delay between cards
			while (_index < 5 && hold[_index]) _index++;
			if (_index >= 5) _state = SCORE;
			else if (!hold[_index]) playerhand[_index++] = shoe.deal();
		}
		else if (_state == SCORE) {
			var txt = "";
			outcome = evaluate(playerhand);
			switch (outcome) {
				case ROYALFLUSH:
					txt = "Royal Flush!";
					break;
				case STRAIGHTFLUSH:
					txt = "Straight Flush!";
					break;
				case FOUROFAKIND:
					txt = "Four of a Kind!";
					break;
				case FULLHOUSE:
					txt = "Full House!";
					break;
				case FLUSH:
					txt = "Flush!";
					break;
				case STRAIGHT:
					txt = "Straight!";
					break;
				case THREEOFAKIND:
					txt = "Three of a Kind!";
					break;
				case TWOPAIR:
					txt = "Two Pair!";
					break;
				case JACKSORBETTER:
					txt = "Pair!";
					break;
			}
			var fs = (_width*SCREENRATIO)/9;
			var dealerwidth = _width*SCREENRATIO*0.85;
			var vpos = (_height-(dealerwidth+fs*11.75))/2+_fontsize/2;
			var hpos = (_width*SCREENRATIO);

			if (outcome > NOTHING) {
				_nexttick = _tick + 5;
				messages.push({ timeout: 5, tick: 0, x: hpos, y :vpos, delta: 0, type: LOGO, s: _fontsize, message: txt});//speech bubble
			}
			else _nexttick = _tick+2;

			bank += bet*outcome;

			_state = RESET;
		}
		else if (_state == RESET && _nexttick < _tick) {
			hold = [ false, false, false, false, false ];
			outcome = NOTHING;

			if (bank < bet) {
				_nexttick = _tick + 25;
				_state = GAMEOVER;
			}
			else _state = DEAL;
		}
		else if (_state == GAMEOVER && _nexttick < _tick) {
			_state = TITLE;
		}

		//update messages
		for(let i=0; i<messages.length; i++) {
			if (messages[i].tick++ >= messages[i].timeout) messages.splice(i--, 1); //remove
		}
	};

	evaluate = function(h) {
		var suits = [ 0, 0, 0, 0 ];
		var faces = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
		var flush = false;
		for (let i=0; i<5; i++) {
			faces[Number(h[i].face)] += 1;
			if (++suits[Number(h[i].suit)] == 5) flush = true;
		}
		var straight = false;
		var three = false;
		var pair = false;
		var jacks = false;
		var c = 0;
		for (let i=0; i<14; i++) {
			if (faces[i] == 1) {
				//c++;
				if (++c == 5) straight = true;
			}
			else c = 0;

			if (faces[i]  == 4) return FOUROFAKIND;
			else if (faces[i] == 3) three = true;
			else if (pair && faces[i] == 2) return TWOPAIR;
			else if (faces[i] == 2) {
				pair = true;
				if (i > 10 || i == 1) jacks = true;
			}
		}
		if (c == 4 && faces[1] == 1) straight = true;

		//console.log(faces);

		if (faces[1] == 1 && faces[13] == 1 && faces[12] == 1 && faces[11] == 1 && faces[10] == 1 && flush) return ROYALFLUSH;
		else if (straight && flush) return STRAIGHTFLUSH;
		else if (flush) return FLUSH;
		else if (straight) return STRAIGHT;
		else if (pair && three) return FULLHOUSE;
		else if (three) return THREEOFAKIND;
		else if (pair && jacks) return JACKSORBETTER;
		else return NOTHING;
	};

	save = function() {
		if (typeof(Storage) !== "undefined") {
			// Code for localStorage/sessionStorage.
			localStorage.setItem("bank", bank);
		}
		else {
		  // Sorry! No Web Storage support..
		}
	};

	load = function() {
		bank = Number(localStorage.getItem("bank"));
	};

	setVolume = function(v) {
		volume = v;

		resourceRepository.gameover.volume = volume;
		resourceRepository.cleared.volume = volume;
	};

}