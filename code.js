var model = {
    boardSize: 7, //Размер сетки игрового поля
    numShips: 3, //количества кораблей
    // staySunk: function(){
    //     var stay = this.numShips - this.shipsSunk;
    //     return stay;
    // },
    shipsSunk: 0, //количества потопленных кораблей
    shipLength: 3, //длина каждого корабля (в клетках).
    ships: [
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] }
	],

// original hard-coded values for ship locations
/*
	ships: [
		{ locations: ["06", "16", "26"], hits: ["", "", ""] },
		{ locations: ["24", "34", "44"], hits: ["", "", ""] },
		{ locations: ["10", "11", "12"], hits: ["", "", ""] }
	],
*/
    //Метод с именем isSunk получает объект корабля
   ///и возвращает true, если корабль потоплен, или false,
      //если он еще держится на плаву.
    isSunk: function(ship){
        for(var i = 0; i < this.numShips; i++){
            if (ship.hits[i] !== "hit"){
                return false;
            }
        }
        return true;
    },
    fire: function(guess) {
        for (var i = 0; i < this.numShips; i++) {
        var ship = this.ships[i];
        var index = ship.locations.indexOf(guess);
        if (ship.hits[index] === "hit"){
            view.displayMessage("Вы здесь потопили!");
			return true;
        }
        else if (index >= 0) {
            ship.hits[index] = "hit";
            view.displayHit(guess);
            view.displayMessage("HIT!");
            if (this.isSunk(ship)) {
                view.displayMessage("Ты потопил +1 корабль");
                this.shipsSunk++;
            }
            return true;
        }
        }
        view.displayMiss(guess);
        view.displayMessage("You missed.");
        return false;
    },
    generateShipLocations: function(){
        var location;
        for (var i = 0; i < this.numShips; i++){
            do {
                locations = this.generateShip()
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        };
    },
    generateShip: function() {
		var direction = Math.floor(Math.random() * 2);
		var row, col;

		if (direction === 1) { // horizontal
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
		} else { // vertical
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
			col = Math.floor(Math.random() * this.boardSize);
		}

		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i));
			} else {
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;
	},
    collision: function(locations){
        for(var i = 0; i < this.numShips; i++){
            var ship = model.ships[i]
            for(var j = 0; j < locations.length; j++){
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                };
            };
        }
        return false;
    }
};
function parseGuess(guess){
    var alphabet = ["A","B","C","D","E","F","G"];

    if (guess === null || guess.length !== 2){
        alert("ВВеди правильные данные епт");
    } else {
        firstChar = guess.charAt(0);
        var row = alphabet.indexOf(firstChar);
        var column = guess.charAt(1)
        if (isNaN(row) || isNaN(column)){
            alert("UEBOK eto ne ctsifra");
        } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize){
            alert("Цифра больше 6 или меньше 0");
        }else {
            return row + column;
        }
    }
    return null;
};

/*var controller = {
    guesses: 0,
    processGuess: function(guess) {
    var location = parseGuess(guess);
    if (location) {
        this.guesses++;
        var hit = model.fire(location);
        if (hit && model.shipsSunk === model.numShips) {
        view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses");
        }
    }
    }
};*/

var controller = {
    guesses:0,
    processGuess: function(guess){
        var location = parseGuess(guess);
        if (location){
            this.guesses++;
            var hit = model.fire(location);
            if (hit && model.shipsSunk == model.numShips){
                view.displayMessage("ТЫ потопил все коробли количества выстрелов " + this.guesses);
            };
        };
    }
};





var view = {
    displayMessage: function(message){
        var messageArea = document.getElementById("board__messageArea");
        messageArea.innerHTML = message;
    },
    
    displayHit: function(location){
        var hit = document.getElementById(location);
        hit.setAttribute("class", "hit")
    },
    displayMiss: function(location){
        var miss = document.getElementById(location);
        miss.setAttribute("class", "miss")
    }
};
function init() {
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;
    model.generateShipLocations();
};
function handleFireButton() {
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value;
    controller.processGuess(guess);
    guessInput.value = "";
};
function handleKeyPress(e) {
    var fireButton = document.getElementById("fireButton");
    if (e.keyCode === 13) {
    fireButton.click();
    return false;
    }
};
window.onload = init;