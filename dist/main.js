/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/scripts/gameManager.js":
/*!************************************!*\
  !*** ./src/scripts/gameManager.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GameManager: () => (/* binding */ GameManager)
/* harmony export */ });
/* harmony import */ var _logic_gameplayer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./logic/gameplayer */ "./src/scripts/logic/gameplayer.js");

class GameManager {
  constructor() {
    this.player = new _logic_gameplayer__WEBPACK_IMPORTED_MODULE_0__.GamePlayer(false);
    this.computer = new _logic_gameplayer__WEBPACK_IMPORTED_MODULE_0__.GamePlayer(true);
    this.status = 'starting';
    this.player.gameBoard.generateBoard();
    this.computer.gameBoard.generateBoard();
  }
  startGame() {
    this.status = 'started';
  }
  playerClicks(x, y) {
    this.player.doPlayerAttack(x, y);
  }
}


/***/ }),

/***/ "./src/scripts/layoutManager.js":
/*!**************************************!*\
  !*** ./src/scripts/layoutManager.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   enableButtons: () => (/* binding */ enableButtons),
/* harmony export */   hitPlayerBoard: () => (/* binding */ hitPlayerBoard),
/* harmony export */   notifyVictory: () => (/* binding */ notifyVictory)
/* harmony export */ });
/* harmony import */ var _gameManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameManager */ "./src/scripts/gameManager.js");

let gameManager;
const _clickHandler = event => {
  if (gameManager.status === 'started') {
    if (event.target.classList.contains('computer-box-grid-item')) {
      if (!event.target.classList.contains('hit') && !event.target.classList.contains("hit_enemy_ship")) {
        const obj = event.target.getAttribute("data-pos").split(',');
        const setX = obj[0],
          setY = obj[1];
        gameManager.player.doPlayerAttack(setX, setY, gameManager);
        if (gameManager.computer.gameBoard.currentBoard[setY][setX].ship !== null) {
          event.target.classList.add("hit_enemy_ship");
        } else {
          event.target.classList.add('hit');
        }
      }
    }
  } else if (gameManager.status === 'starting') {
    // drag and drop logic
  }
  if (event.target.id === 'startButton') {
    event.target.setAttribute('disabled', '');
    const textBox = document.querySelector('.text-holder');
    textBox.textContent = 'Game running...';
    gameManager.startGame();
  }
  if (event.target.id === 'resetButton') {
    const startButton = document.querySelector('#startButton');
    if (startButton !== null) {
      if (startButton.getAttribute('disabled') === '') {
        startButton.removeAttribute('disabled');
      }
    }
    _cleanupLayout();
    const textBox = document.querySelector('.text-holder');
    const firstParagraph = document.createElement('p');
    firstParagraph.textContent = 'You can drag and drop the ships to position them.';
    textBox.appendChild(firstParagraph);
    const secondParagraph = document.createElement('p');
    secondParagraph.textContent = `There can't be two ships next to one another.`;
    textBox.appendChild(secondParagraph);
    generateLayout();
  }
};
const _dragstartHandler = event => {
  if (gameManager.status === 'starting') {
    // drag and drop logic
    event.dataTransfer.setData("text/plain", event.target.getAttribute('data-pos'));
    event.dataTransfer.setData("text/html", event.target.outerHTML);
    event.dataTransfer.dropEffect = "move";
  }
};
const _dropHandler = event => {
  event.preventDefault();
  if (gameManager.status === 'starting') {
    const dataPos = event.dataTransfer.getData("text/plain");
    if (dataPos) {
      const posSplit = dataPos.split(',');
      if (gameManager.player.gameBoard.currentBoard[+posSplit[1]][+posSplit[0]].ship !== null) {
        const posShip = gameManager.player.gameBoard.currentBoard[+posSplit[1]][+posSplit[0]].ship;
        const goalPos = event.target.getAttribute('data-pos').split(',');
        if (goalPos.length > 0) {
          if (gameManager.player.gameBoard.specialHasSpaceForShip(+goalPos[0], +goalPos[1], posShip.length, posShip.rotation, posShip)) {
            // remove ship from old pos
            _removeShipFromLayout(+posSplit[0], +posSplit[1]);
            let shipIndex = gameManager.player.gameBoard.removeShipAt(+posSplit[0], +posSplit[1]);

            // add to new pos
            let newShip = gameManager.player.gameBoard.placeNewShipAt(+goalPos[0], +goalPos[1], posShip.length, posShip.rotation, shipIndex);
            _addShipToLayout(newShip);
          }
        }
      }
    }
  }
};
const _dragoverHandler = event => {
  event.preventDefault();
  if (gameManager.status === 'starting') {
    // drag and drop logic
    event.dataTransfer.setData("text/plain", event.target.getAttribute('data-pos'));
    event.dataTransfer.setData("text/html", event.target.outerHTML);
    event.dataTransfer.dropEffect = "move";
  }
};
const hitPlayerBoard = (x, y, isShip) => {
  const shipCoord = document.querySelector(`.player-box-grid-item[data-pos='${x},${y}']`);
  if (shipCoord !== null) {
    if (isShip) {
      shipCoord.classList.add("hit_ship");
    } else {
      shipCoord.classList.add("hit");
    }
  }
};
const notifyVictory = computerWon => {
  if (!computerWon) {
    const playerInput = document.querySelector('.player-box-title');
    playerInput.textContent = 'Player (WON!)';
    const textBox = document.querySelector('.text-holder');
    textBox.textContent = 'The Player won!';
  } else {
    const playerInput = document.querySelector('.computer-box-title');
    playerInput.textContent = 'Computer (WON!)';
    const textBox = document.querySelector('.text-holder');
    textBox.textContent = 'The Computer won!';
  }
};
const _removeShipFromLayout = (x, y) => {
  if (gameManager.player.gameBoard.currentBoard[y][x].ship !== null) {
    gameManager.player.gameBoard.currentBoard[y][x].ship.gameTiles.forEach(tile => {
      const shipCoord = document.querySelector(`.player-box-grid-item[data-pos='${tile.x},${tile.y}']`);
      if (shipCoord !== null) {
        if (shipCoord.classList.contains("ship")) {
          shipCoord.classList.remove("ship");
        }
      }
    });
  }
};
const _addShipToLayout = ship => {
  ship.gameTiles.forEach(tile => {
    const shipCoord = document.querySelector(`.player-box-grid-item[data-pos='${tile.x},${tile.y}']`);
    if (shipCoord !== null) {
      if (!shipCoord.classList.contains("ship")) {
        shipCoord.classList.add("ship");
      }
    }
  });
};
const _cleanupLayout = () => {
  const playerBox = document.querySelector('.player-box-grid');
  while (playerBox.firstChild) {
    playerBox.removeChild(playerBox.lastChild);
  }
  const computerBox = document.querySelector('.computer-box-grid');
  while (computerBox.firstChild) {
    computerBox.removeChild(computerBox.lastChild);
  }
  const textBox = document.querySelector('.text-holder');
  while (textBox.firstChild) {
    textBox.removeChild(textBox.lastChild);
  }
};
const generateLayout = () => {
  gameManager = new _gameManager__WEBPACK_IMPORTED_MODULE_0__.GameManager();
  const playerBox = document.querySelector('.player-box-grid');
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const playerCoord = document.createElement("div");
      playerCoord.classList.add("player-box-grid-item");
      playerCoord.setAttribute("data-pos", x + "," + y);
      playerBox.appendChild(playerCoord);
      playerCoord.addEventListener("click", _clickHandler);
      playerCoord.addEventListener("dragstart", _dragstartHandler);
      playerCoord.addEventListener("dragover", _dragoverHandler);
      playerCoord.addEventListener("drop", _dropHandler);
    }
  }

  // add player selection
  gameManager.player.gameBoard.shipList.forEach(ship => {
    ship.gameTiles.forEach(tile => {
      const shipCoord = document.querySelector(`.player-box-grid-item[data-pos='${tile.x},${tile.y}']`);
      if (shipCoord !== null) {
        shipCoord.classList.add("ship");
      }
    });
  });
  const computerBox = document.querySelector('.computer-box-grid');
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const computerCoord = document.createElement("div");
      computerCoord.classList.add("computer-box-grid-item");
      computerCoord.setAttribute("data-pos", x + "," + y);
      computerBox.appendChild(computerCoord);
      computerCoord.addEventListener("click", _clickHandler);
    }
  }
};
const enableButtons = () => {
  const startButton = document.querySelector('#startButton');
  startButton.addEventListener('click', _clickHandler);
  const resetButton = document.querySelector('#resetButton');
  resetButton.addEventListener('click', _clickHandler);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (generateLayout);


/***/ }),

/***/ "./src/scripts/logic/computerAI.js":
/*!*****************************************!*\
  !*** ./src/scripts/logic/computerAI.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ComputerAI: () => (/* binding */ ComputerAI)
/* harmony export */ });
class ComputerAI {
  constructor() {
    this.computerBoard = [['', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '']];
    this.nextMovements = [];
  }
  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
  isValidPosition(x, y) {
    if (x > 9 || y > 9 || x < 0 || y < 0) {
      return false;
    }
    if (this.computerBoard[y][x] === undefined || this.computerBoard[y][x] === null) {
      return false;
    }
    if (this.computerBoard[y][x] !== '') {
      return false;
    }
    return true;
  }
  validNextMove() {
    if (this.nextMovements.length > 0) {
      const nextMovement = this.nextMovements.pop();
      this.computerBoard[nextMovement.y][nextMovement.x] = 'X';
      return [nextMovement.x, nextMovement.y];
    } else {
      const randX = this.getRandomInt(10);
      const randY = this.getRandomInt(10);
      if (this.isValidPosition(randX, randY)) {
        this.computerBoard[randY][randX] = 'X';
        return [randX, randY];
      } else {
        return this.validNextMove();
      }
    }
  }
}


/***/ }),

/***/ "./src/scripts/logic/gameboard.js":
/*!****************************************!*\
  !*** ./src/scripts/logic/gameboard.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GameBoard: () => (/* binding */ GameBoard)
/* harmony export */ });
/* harmony import */ var _layoutManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../layoutManager */ "./src/scripts/layoutManager.js");
/* harmony import */ var _gametile__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./gametile */ "./src/scripts/logic/gametile.js");
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ship */ "./src/scripts/logic/ship.js");



class GameBoard {
  constructor() {
    this.currentBoard = [['', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '']];
    this.shipList = [];
  }
  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
  generateBoard() {
    // generate basic board
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        this.currentBoard[y][x] = new _gametile__WEBPACK_IMPORTED_MODULE_1__.GameTile(x, y);
      }
    }

    // randomly place ships
    this.placeNewShip(4);
    this.placeNewShip(3);
    this.placeNewShip(3);
    this.placeNewShip(2);
    this.placeNewShip(2);
    this.placeNewShip(2);
    this.placeNewShip(1);
    this.placeNewShip(1);
    this.placeNewShip(1);
    this.placeNewShip(1);
    return true;
  }
  isValidCoord(x, y) {
    if (x > 9 || y > 9 || x < 0 || y < 0) {
      return false;
    }
    return true;
  }
  canBeAttacked(x, y) {
    if (!this.isValidCoord(x, y)) {
      return false;
    }
    if (this.currentBoard[y][x] === undefined || this.currentBoard[y][x] === null) {
      return false;
    }
    if (this.currentBoard[y][x].hit) {
      return false;
    }
    return true;
  }
  hasAdjacentShip(x, y) {
    if (this.isValidCoord(x, y - 1)) {
      if (this.isValidCoord(x - 1, y - 1)) {
        if (this.currentBoard[y - 1][x - 1].ship !== null) {
          return true;
        }
      }
      if (this.isValidCoord(x, y - 1)) {
        if (this.currentBoard[y - 1][x].ship !== null) {
          return true;
        }
      }
      if (this.isValidCoord(x + 1, y - 1)) {
        if (this.currentBoard[y - 1][x + 1].ship !== null) {
          return true;
        }
      }
    }
    if (this.isValidCoord(x - 1, y)) {
      if (this.currentBoard[y][x - 1].ship !== null) {
        return true;
      }
    }
    if (this.isValidCoord(x + 1, y)) {
      if (this.currentBoard[y][x + 1].ship !== null) {
        return true;
      }
    }
    if (this.isValidCoord(x, y + 1)) {
      if (this.isValidCoord(x - 1, y + 1)) {
        if (this.currentBoard[y + 1][x - 1].ship !== null) {
          return true;
        }
      }
      if (this.isValidCoord(x, y + 1)) {
        if (this.currentBoard[y + 1][x].ship !== null) {
          return true;
        }
      }
      if (this.isValidCoord(x + 1, y + 1)) {
        if (this.currentBoard[y + 1][x + 1].ship !== null) {
          return true;
        }
      }
    }
    return false;
  }
  hasSpaceForShip(x, y, size, rotation) {
    let validPosition = true;
    for (let i = 0; i < size; i++) {
      if (rotation === 0) {
        if (!this.isValidPosition(x + i, y)) {
          validPosition = false;
        }
      } else {
        if (!this.isValidPosition(x, y + i)) {
          validPosition = false;
        }
      }
    }
    return validPosition;
  }
  specialHasSpaceForShip(x, y, size, rotation, ship) {
    // remove ship
    ship.gameTiles.forEach(tile => {
      this.currentBoard[tile.y][tile.x].ship = null;
    });
    const validPosition = this.hasSpaceForShip(x, y, size, rotation);

    // add the ship back
    ship.gameTiles.forEach(tile => {
      this.currentBoard[tile.y][tile.x].ship = ship;
    });
    return validPosition;
  }
  isValidPosition(x, y) {
    if (!this.isValidCoord(x, y)) {
      return false;
    }
    if (this.currentBoard[y][x] === undefined || this.currentBoard[y][x] === null) {
      return false;
    }
    if (this.currentBoard[y][x].ship !== null) {
      return false;
    }
    if (this.hasAdjacentShip(x, y)) {
      return false;
    }
    return true;
  }
  placeNewShip(size) {
    const rotation = this.getRandomInt(2);
    const baseX = this.getRandomInt(10);
    const baseY = this.getRandomInt(10);
    return this.placeNewShipAt(baseX, baseY, size, rotation, this.shipList.length);
  }
  removeShipAt(x, y) {
    if (this.currentBoard[y][x].ship !== null) {
      let ship = this.currentBoard[y][x].ship;
      this.currentBoard[y][x].ship.gameTiles.forEach(tile => {
        this.currentBoard[tile.y][tile.x].ship = null;
      });
      this.shipList.splice(ship.index, 1);
      return ship.index;
    }
  }
  placeNewShipAt(baseX, baseY, size, rotation, index) {
    let validPosition = this.hasSpaceForShip(baseX, baseY, size, rotation);
    if (validPosition) {
      const newShip = new _ship__WEBPACK_IMPORTED_MODULE_2__.Ship(size, rotation);
      newShip.index = index;
      for (let i = 0; i < size; i++) {
        if (rotation === 0) {
          this.currentBoard[baseY][baseX + i].ship = newShip;
          newShip.gameTiles.push(this.currentBoard[baseY][baseX + i]);
        } else {
          this.currentBoard[baseY + i][baseX].ship = newShip;
          newShip.gameTiles.push(this.currentBoard[baseY + i][baseX]);
        }
      }
      this.shipList.splice(index, 0, newShip);
      return newShip;
    } else {
      return this.placeNewShip(size);
    }
  }
  receiveAttack(x, y) {
    let isComputer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    if (!this.canBeAttacked(x, y)) {
      return false;
    } else {
      if (!this.currentBoard[y][x].hit) {
        this.currentBoard[y][x].hit = true;
        let isShip = false;
        if (this.currentBoard[y][x].ship !== null) {
          this.currentBoard[y][x].ship.hit();
          isShip = true;
        }
        if (!isComputer) {
          (0,_layoutManager__WEBPACK_IMPORTED_MODULE_0__.hitPlayerBoard)(x, y, isShip);
        }
        return isShip;
      } else {
        return false;
      }
    }
  }
  shipsSunk() {
    let completelySunk = true;
    this.shipList.forEach(ship => {
      if (!ship.isSunk()) {
        completelySunk = false;
      }
    });
    return completelySunk;
  }
}


/***/ }),

/***/ "./src/scripts/logic/gameplayer.js":
/*!*****************************************!*\
  !*** ./src/scripts/logic/gameplayer.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GamePlayer: () => (/* binding */ GamePlayer)
/* harmony export */ });
/* harmony import */ var _layoutManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../layoutManager */ "./src/scripts/layoutManager.js");
/* harmony import */ var _computerAI__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./computerAI */ "./src/scripts/logic/computerAI.js");
/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./gameboard */ "./src/scripts/logic/gameboard.js");



class GamePlayer {
  constructor(isComputer) {
    this.gameBoard = new _gameboard__WEBPACK_IMPORTED_MODULE_2__.GameBoard();
    this.isComputer = isComputer;
    if (isComputer) {
      this.computerMove = new _computerAI__WEBPACK_IMPORTED_MODULE_1__.ComputerAI();
    }
  }
  doPlayerAttack(x, y, game) {
    if (this.isComputer) {
      const nextMove = this.computerMove.validNextMove();
      if (game.player.gameBoard.receiveAttack(nextMove[0], nextMove[1])) {
        // computer hits, it gets another turn
        // add adjacents
        if (game.player.gameBoard.canBeAttacked(nextMove[0] + 1, nextMove[1])) {
          this.computerMove.nextMovements.push(this.gameBoard.currentBoard[nextMove[1]][nextMove[0] + 1]);
        }
        if (game.player.gameBoard.canBeAttacked(nextMove[0] - 1, nextMove[1])) {
          this.computerMove.nextMovements.push(this.gameBoard.currentBoard[nextMove[1]][nextMove[0] - 1]);
        }
        if (game.player.gameBoard.canBeAttacked(nextMove[0], nextMove[1] + 1)) {
          this.computerMove.nextMovements.push(this.gameBoard.currentBoard[nextMove[1] + 1][nextMove[0]]);
        }
        if (game.player.gameBoard.canBeAttacked(nextMove[0], nextMove[1] - 1)) {
          this.computerMove.nextMovements.push(this.gameBoard.currentBoard[nextMove[1] - 1][nextMove[0]]);
        }

        // computer fights back
        this.doPlayerAttack(x, y, game);
      }
      if (game.player.gameBoard.shipsSunk()) {
        game.computer.doVictory(game);
      }
    } else {
      if (game.computer.gameBoard.receiveAttack(x, y, true)) {
        // player hits, he gets another turn
      } else if (!game.computer.gameBoard.shipsSunk()) {
        // computer fights back if the game hasn't ended
        game.computer.doPlayerAttack(x, y, game);
      }
      if (game.computer.gameBoard.shipsSunk()) {
        game.player.doVictory(game);
      }
    }
  }
  doVictory(game) {
    game.status = 'finished';
    (0,_layoutManager__WEBPACK_IMPORTED_MODULE_0__.notifyVictory)(this.isComputer);
  }
}


/***/ }),

/***/ "./src/scripts/logic/gametile.js":
/*!***************************************!*\
  !*** ./src/scripts/logic/gametile.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GameTile: () => (/* binding */ GameTile)
/* harmony export */ });
class GameTile {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.hit = false;
    this.ship = null;
  }
}


/***/ }),

/***/ "./src/scripts/logic/ship.js":
/*!***********************************!*\
  !*** ./src/scripts/logic/ship.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ship: () => (/* binding */ Ship)
/* harmony export */ });
class Ship {
  constructor(length) {
    let rotation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    this.length = length;
    this.rotation = rotation;
    this.hits = 0;
    this.gameTiles = [];
    this.index = 0;
  }
  hit() {
    if (this.hits < this.length) {
      this.hits += 1;
      return true;
    }
    return false;
  }
  isSunk() {
    return this.hits >= this.length;
  }
}


/***/ }),

/***/ "./src/styles/style.css":
/*!******************************!*\
  !*** ./src/styles/style.css ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _scripts_layoutManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./scripts/layoutManager */ "./src/scripts/layoutManager.js");
/* harmony import */ var _styles_style_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./styles/style.css */ "./src/styles/style.css");


(0,_scripts_layoutManager__WEBPACK_IMPORTED_MODULE_0__["default"])();
(0,_scripts_layoutManager__WEBPACK_IMPORTED_MODULE_0__.enableButtons)();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxDQUFDLEVBQy9CLENBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxDQUFDLEVBQy9CLENBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxDQUFDLEVBQy9CLENBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxDQUFDLEVBQy9CLENBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxDQUFDLEVBQy9CLENBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxDQUFDLENBQ2xDO0lBQ0QsSUFBSSxDQUFDQyxhQUFhLEdBQUcsRUFBRTtFQUMzQjtFQUVBQyxZQUFZQSxDQUFDQyxHQUFHLEVBQUU7SUFDZCxPQUFPQyxJQUFJLENBQUNDLEtBQUssQ0FBQ0QsSUFBSSxDQUFDRSxNQUFNLENBQUMsQ0FBQyxHQUFHSCxHQUFHLENBQUM7RUFDMUM7RUFFQUksZUFBZUEsQ0FBQ2xGLENBQUMsRUFBRUMsQ0FBQyxFQUNwQjtJQUNJLElBQUdELENBQUMsR0FBRyxDQUFDLElBQUlDLENBQUMsR0FBRyxDQUFDLElBQUlELENBQUMsR0FBRyxDQUFDLElBQUlDLENBQUMsR0FBRyxD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YixJQUFJLENBQUN6RCxTQUFTLEdBQUcsRUFBRTtJQUNuQixJQUFJLENBQUM2QyxLQUFLLEdBQUcsQ0FBQztFQUNsQjtFQUVBVCxHQUFHQSxDQUFBLEVBQUk7SUFDSCxJQUFHLElBQUksQ0FBQ3FCLElBQUksR0FBRyxJQUFJLENBQUN6RSxNQUFNLEVBQzFCO01BQ0ksSUFBSSxDQUFDeUUsSUFBSSxJQUFJLENBQUM7TUFDZCxPQUFPLElBQUk7SUFDZjtJQUVBLE9BQU8sS0FBSztFQUNoQjtFQUVBTCxNQUFNQSxDQUFBLEVBQUc7SUFDTCxPQUFRLElBQUksQ0FBQ0ssSUFBSSxJQUFJLElBQUksQ0FBQ3pFLE1BQU07RUFDcEM7QUFFSjs7Ozs7Ozs7Ozs7O0FDeEJBOzs7Ozs7O1VDQUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7QUNOd0U7QUFDNUM7QUFFNUJiLGtFQUFjLENBQUMsQ0FBQztBQUNoQjBDLHFFQUFhLENBQUMsQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vb2Rpbi1iYXR0bGVzaGlwLy4vc3JjL3NjcmlwdHMvZ2FtZU1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vb2Rpbi1iYXR0bGVzaGlwLy4vc3JjL3NjcmlwdHMvbGF5b3V0TWFuYWdlci5qcyIsIndlYnBhY2s6Ly9vZGluLWJhdHRsZXNoaXAvLi9zcmMvc2NyaXB0cy9sb2dpYy9jb21wdXRlckFJLmpzIiwid2VicGFjazovL29kaW4tYmF0dGxlc2hpcC8uL3NyYy9zY3JpcHRzL2xvZ2ljL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9vZGluLWJhdHRsZXNoaXAvLi9zcmMvc2NyaXB0cy9sb2dpYy9nYW1lcGxheWVyLmpzIiwid2VicGFjazovL29kaW4tYmF0dGxlc2hpcC8uL3NyYy9zY3JpcHRzL2xvZ2ljL2dhbWV0aWxlLmpzIiwid2VicGFjazovL29kaW4tYmF0dGxlc2hpcC8uL3NyYy9zY3JpcHRzL2xvZ2ljL3NoaXAuanMiLCJ3ZWJwYWNrOi8vb2Rpbi1iYXR0bGVzaGlwLy4vc3JjL3N0eWxlcy9zdHlsZS5jc3M/MjM5NCIsIndlYnBhY2s6Ly9vZGluLWJhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vb2Rpbi1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9vZGluLWJhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9vZGluLWJhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9vZGluLWJhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgR2FtZVBsYXllciB9IGZyb20gXCIuL2xvZ2ljL2dhbWVwbGF5ZXJcIlxuXG5jbGFzcyBHYW1lTWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICB0aGlzLnBsYXllciA9IG5ldyBHYW1lUGxheWVyKGZhbHNlKTtcbiAgICAgICAgdGhpcy5jb21wdXRlciA9IG5ldyBHYW1lUGxheWVyKHRydWUpO1xuICAgICAgICB0aGlzLnN0YXR1cyA9ICdzdGFydGluZyc7XG5cbiAgICAgICAgdGhpcy5wbGF5ZXIuZ2FtZUJvYXJkLmdlbmVyYXRlQm9hcmQoKTtcbiAgICAgICAgdGhpcy5jb21wdXRlci5nYW1lQm9hcmQuZ2VuZXJhdGVCb2FyZCgpO1xuICAgIH1cblxuICAgIHN0YXJ0R2FtZSgpIHtcbiAgICAgICAgdGhpcy5zdGF0dXMgPSAnc3RhcnRlZCc7XG4gICAgfVxuXG4gICAgcGxheWVyQ2xpY2tzKHgsIHkpXG4gICAge1xuICAgICAgICB0aGlzLnBsYXllci5kb1BsYXllckF0dGFjayh4LCB5KTtcbiAgICB9XG59XG5cbmV4cG9ydCB7IEdhbWVNYW5hZ2VyIH0iLCJpbXBvcnQgeyBHYW1lTWFuYWdlciB9IGZyb20gXCIuL2dhbWVNYW5hZ2VyXCI7XG5cbmxldCBnYW1lTWFuYWdlcjtcblxuY29uc3QgX2NsaWNrSGFuZGxlciA9IChldmVudCkgPT4ge1xuICAgIGlmKGdhbWVNYW5hZ2VyLnN0YXR1cyA9PT0gJ3N0YXJ0ZWQnKVxuICAgIHtcbiAgICAgICAgaWYoZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnY29tcHV0ZXItYm94LWdyaWQtaXRlbScpKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZighZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnaGl0JykgJiYgIWV2ZW50LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJoaXRfZW5lbXlfc2hpcFwiKSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb25zdCBvYmogPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1wb3NcIikuc3BsaXQoJywnKTtcbiAgICAgICAgICAgICAgICBjb25zdCBzZXRYID0gb2JqWzBdLCBzZXRZID0gb2JqWzFdO1xuICAgICAgICAgICAgICAgIGdhbWVNYW5hZ2VyLnBsYXllci5kb1BsYXllckF0dGFjayhzZXRYLCBzZXRZLCBnYW1lTWFuYWdlcik7XG5cbiAgICAgICAgICAgICAgICBpZihnYW1lTWFuYWdlci5jb21wdXRlci5nYW1lQm9hcmQuY3VycmVudEJvYXJkW3NldFldW3NldFhdLnNoaXAgIT09IG51bGwpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBldmVudC50YXJnZXQuY2xhc3NMaXN0LmFkZChcImhpdF9lbmVteV9zaGlwXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnRhcmdldC5jbGFzc0xpc3QuYWRkKCdoaXQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYoZ2FtZU1hbmFnZXIuc3RhdHVzID09PSAnc3RhcnRpbmcnKVxuICAgIHtcbiAgICAgICAgLy8gZHJhZyBhbmQgZHJvcCBsb2dpY1xuICAgIH1cblxuICAgIGlmKGV2ZW50LnRhcmdldC5pZCA9PT0gJ3N0YXJ0QnV0dG9uJylcbiAgICB7XG4gICAgICAgIGV2ZW50LnRhcmdldC5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJycpO1xuICAgICAgICBjb25zdCB0ZXh0Qm94ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRleHQtaG9sZGVyJyk7XG4gICAgICAgIHRleHRCb3gudGV4dENvbnRlbnQgPSAnR2FtZSBydW5uaW5nLi4uJztcbiAgICAgICAgZ2FtZU1hbmFnZXIuc3RhcnRHYW1lKCk7XG4gICAgfVxuXG4gICAgaWYoZXZlbnQudGFyZ2V0LmlkID09PSAncmVzZXRCdXR0b24nKVxuICAgIHtcbiAgICAgICAgY29uc3Qgc3RhcnRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc3RhcnRCdXR0b24nKTtcbiAgICAgICAgaWYoc3RhcnRCdXR0b24gIT09IG51bGwpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmKHN0YXJ0QnV0dG9uLmdldEF0dHJpYnV0ZSgnZGlzYWJsZWQnKSA9PT0gJycpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhcnRCdXR0b24ucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgX2NsZWFudXBMYXlvdXQoKTtcblxuICAgICAgICBjb25zdCB0ZXh0Qm94ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRleHQtaG9sZGVyJyk7XG4gICAgICAgIGNvbnN0IGZpcnN0UGFyYWdyYXBoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICBmaXJzdFBhcmFncmFwaC50ZXh0Q29udGVudCA9ICdZb3UgY2FuIGRyYWcgYW5kIGRyb3AgdGhlIHNoaXBzIHRvIHBvc2l0aW9uIHRoZW0uJztcbiAgICAgICAgdGV4dEJveC5hcHBlbmRDaGlsZChmaXJzdFBhcmFncmFwaCk7XG4gICAgICAgIGNvbnN0IHNlY29uZFBhcmFncmFwaCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgc2Vjb25kUGFyYWdyYXBoLnRleHRDb250ZW50ID0gYFRoZXJlIGNhbid0IGJlIHR3byBzaGlwcyBuZXh0IHRvIG9uZSBhbm90aGVyLmA7XG4gICAgICAgIHRleHRCb3guYXBwZW5kQ2hpbGQoc2Vjb25kUGFyYWdyYXBoKTtcblxuICAgICAgICBnZW5lcmF0ZUxheW91dCgpO1xuICAgIH1cbn1cblxuY29uc3QgX2RyYWdzdGFydEhhbmRsZXIgPSAoZXZlbnQpID0+IHtcbiAgICBpZihnYW1lTWFuYWdlci5zdGF0dXMgPT09ICdzdGFydGluZycpXG4gICAge1xuICAgICAgICAvLyBkcmFnIGFuZCBkcm9wIGxvZ2ljXG4gICAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKFwidGV4dC9wbGFpblwiLCBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXBvcycpKTtcbiAgICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJ0ZXh0L2h0bWxcIiwgZXZlbnQudGFyZ2V0Lm91dGVySFRNTCk7XG4gICAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJtb3ZlXCI7XG4gICAgfVxufVxuXG5jb25zdCBfZHJvcEhhbmRsZXIgPSAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGlmKGdhbWVNYW5hZ2VyLnN0YXR1cyA9PT0gJ3N0YXJ0aW5nJylcbiAgICB7XG4gICAgICAgIGNvbnN0IGRhdGFQb3MgPSAoZXZlbnQuZGF0YVRyYW5zZmVyLmdldERhdGEoXCJ0ZXh0L3BsYWluXCIpKTtcbiAgICAgICAgaWYoZGF0YVBvcylcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgcG9zU3BsaXQgPSBkYXRhUG9zLnNwbGl0KCcsJyk7XG4gICAgICAgICAgICBpZihnYW1lTWFuYWdlci5wbGF5ZXIuZ2FtZUJvYXJkLmN1cnJlbnRCb2FyZFsrcG9zU3BsaXRbMV1dWytwb3NTcGxpdFswXV0uc2hpcCAhPT0gbnVsbClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwb3NTaGlwID0gZ2FtZU1hbmFnZXIucGxheWVyLmdhbWVCb2FyZC5jdXJyZW50Qm9hcmRbK3Bvc1NwbGl0WzFdXVsrcG9zU3BsaXRbMF1dLnNoaXA7XG4gICAgICAgICAgICAgICAgY29uc3QgZ29hbFBvcyA9IGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcG9zJykuc3BsaXQoJywnKTtcbiAgICAgICAgICAgICAgICBpZihnb2FsUG9zLmxlbmd0aCA+IDApXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpZihnYW1lTWFuYWdlci5wbGF5ZXIuZ2FtZUJvYXJkLnNwZWNpYWxIYXNTcGFjZUZvclNoaXAoK2dvYWxQb3NbMF0sICtnb2FsUG9zWzFdLCBwb3NTaGlwLmxlbmd0aCwgcG9zU2hpcC5yb3RhdGlvbiwgcG9zU2hpcCkpXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBzaGlwIGZyb20gb2xkIHBvc1xuICAgICAgICAgICAgICAgICAgICAgICAgX3JlbW92ZVNoaXBGcm9tTGF5b3V0KCtwb3NTcGxpdFswXSwgK3Bvc1NwbGl0WzFdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzaGlwSW5kZXggPSBnYW1lTWFuYWdlci5wbGF5ZXIuZ2FtZUJvYXJkLnJlbW92ZVNoaXBBdCgrcG9zU3BsaXRbMF0sICtwb3NTcGxpdFsxXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFkZCB0byBuZXcgcG9zXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmV3U2hpcCA9IGdhbWVNYW5hZ2VyLnBsYXllci5nYW1lQm9hcmQucGxhY2VOZXdTaGlwQXQoK2dvYWxQb3NbMF0sICtnb2FsUG9zWzFdLCBwb3NTaGlwLmxlbmd0aCwgcG9zU2hpcC5yb3RhdGlvbiwgc2hpcEluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hZGRTaGlwVG9MYXlvdXQobmV3U2hpcCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmNvbnN0IF9kcmFnb3ZlckhhbmRsZXIgPSAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGlmKGdhbWVNYW5hZ2VyLnN0YXR1cyA9PT0gJ3N0YXJ0aW5nJylcbiAgICB7XG4gICAgICAgIC8vIGRyYWcgYW5kIGRyb3AgbG9naWNcbiAgICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJ0ZXh0L3BsYWluXCIsIGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcG9zJykpO1xuICAgICAgICBldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YShcInRleHQvaHRtbFwiLCBldmVudC50YXJnZXQub3V0ZXJIVE1MKTtcbiAgICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcIm1vdmVcIjtcbiAgICB9XG59XG5cbmNvbnN0IGhpdFBsYXllckJvYXJkID0gKHgsIHksIGlzU2hpcCkgPT4ge1xuICAgIGNvbnN0IHNoaXBDb29yZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC5wbGF5ZXItYm94LWdyaWQtaXRlbVtkYXRhLXBvcz0nJHt4fSwke3l9J11gKTtcbiAgICBpZihzaGlwQ29vcmQgIT09IG51bGwpXG4gICAge1xuICAgICAgICBpZihpc1NoaXApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHNoaXBDb29yZC5jbGFzc0xpc3QuYWRkKFwiaGl0X3NoaXBcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzaGlwQ29vcmQuY2xhc3NMaXN0LmFkZChcImhpdFwiKTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuXG5jb25zdCBub3RpZnlWaWN0b3J5ID0gKGNvbXB1dGVyV29uKSA9PiB7XG4gICAgaWYoIWNvbXB1dGVyV29uKVxuICAgIHtcbiAgICAgICAgY29uc3QgcGxheWVySW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxheWVyLWJveC10aXRsZScpO1xuICAgICAgICBwbGF5ZXJJbnB1dC50ZXh0Q29udGVudCA9ICdQbGF5ZXIgKFdPTiEpJztcbiAgICAgICAgY29uc3QgdGV4dEJveCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50ZXh0LWhvbGRlcicpO1xuICAgICAgICB0ZXh0Qm94LnRleHRDb250ZW50ID0gJ1RoZSBQbGF5ZXIgd29uISc7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgcGxheWVySW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29tcHV0ZXItYm94LXRpdGxlJyk7XG4gICAgICAgIHBsYXllcklucHV0LnRleHRDb250ZW50ID0gJ0NvbXB1dGVyIChXT04hKSc7XG4gICAgICAgIGNvbnN0IHRleHRCb3ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGV4dC1ob2xkZXInKTtcbiAgICAgICAgdGV4dEJveC50ZXh0Q29udGVudCA9ICdUaGUgQ29tcHV0ZXIgd29uISc7XG4gICAgfVxufVxuXG5jb25zdCBfcmVtb3ZlU2hpcEZyb21MYXlvdXQgPSAoeCwgeSkgPT4ge1xuICAgIGlmKGdhbWVNYW5hZ2VyLnBsYXllci5nYW1lQm9hcmQuY3VycmVudEJvYXJkW3ldW3hdLnNoaXAgIT09IG51bGwpXG4gICAge1xuICAgICAgICBnYW1lTWFuYWdlci5wbGF5ZXIuZ2FtZUJvYXJkLmN1cnJlbnRCb2FyZFt5XVt4XS5zaGlwLmdhbWVUaWxlcy5mb3JFYWNoKHRpbGUgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc2hpcENvb3JkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLnBsYXllci1ib3gtZ3JpZC1pdGVtW2RhdGEtcG9zPScke3RpbGUueH0sJHt0aWxlLnl9J11gKTtcbiAgICAgICAgICAgIGlmKHNoaXBDb29yZCAhPT0gbnVsbClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZihzaGlwQ29vcmQuY2xhc3NMaXN0LmNvbnRhaW5zKFwic2hpcFwiKSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHNoaXBDb29yZC5jbGFzc0xpc3QucmVtb3ZlKFwic2hpcFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxufVxuXG5jb25zdCBfYWRkU2hpcFRvTGF5b3V0ID0gKHNoaXApID0+IHtcbiAgICBzaGlwLmdhbWVUaWxlcy5mb3JFYWNoKHRpbGUgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc2hpcENvb3JkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLnBsYXllci1ib3gtZ3JpZC1pdGVtW2RhdGEtcG9zPScke3RpbGUueH0sJHt0aWxlLnl9J11gKTtcbiAgICAgICAgICAgIGlmKHNoaXBDb29yZCAhPT0gbnVsbClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZighc2hpcENvb3JkLmNsYXNzTGlzdC5jb250YWlucyhcInNoaXBcIikpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBzaGlwQ29vcmQuY2xhc3NMaXN0LmFkZChcInNoaXBcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbn1cblxuY29uc3QgX2NsZWFudXBMYXlvdXQgPSAoKSA9PiB7XG4gICAgY29uc3QgcGxheWVyQm94ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYXllci1ib3gtZ3JpZCcpO1xuICAgIHdoaWxlKHBsYXllckJveC5maXJzdENoaWxkKVxuICAgIHtcbiAgICAgICAgcGxheWVyQm94LnJlbW92ZUNoaWxkKHBsYXllckJveC5sYXN0Q2hpbGQpO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbXB1dGVyQm94ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbXB1dGVyLWJveC1ncmlkJyk7XG4gICAgd2hpbGUoY29tcHV0ZXJCb3guZmlyc3RDaGlsZClcbiAgICB7XG4gICAgICAgIGNvbXB1dGVyQm94LnJlbW92ZUNoaWxkKGNvbXB1dGVyQm94Lmxhc3RDaGlsZCk7XG4gICAgfVxuXG4gICAgY29uc3QgdGV4dEJveCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50ZXh0LWhvbGRlcicpO1xuICAgIHdoaWxlKHRleHRCb3guZmlyc3RDaGlsZClcbiAgICB7XG4gICAgICAgIHRleHRCb3gucmVtb3ZlQ2hpbGQodGV4dEJveC5sYXN0Q2hpbGQpO1xuICAgIH1cbn1cblxuY29uc3QgZ2VuZXJhdGVMYXlvdXQgPSAoKSA9PiB7XG4gICAgZ2FtZU1hbmFnZXIgPSBuZXcgR2FtZU1hbmFnZXIoKTtcbiAgICBjb25zdCBwbGF5ZXJCb3ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxheWVyLWJveC1ncmlkJyk7XG5cbiAgICBmb3IobGV0IHkgPSAwOyB5IDwgMTA7IHkrKylcbiAgICB7XG4gICAgICAgIGZvcihsZXQgeCA9IDA7IHggPCAxMDsgeCsrKVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJDb29yZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICBwbGF5ZXJDb29yZC5jbGFzc0xpc3QuYWRkKFwicGxheWVyLWJveC1ncmlkLWl0ZW1cIilcbiAgICAgICAgICAgIHBsYXllckNvb3JkLnNldEF0dHJpYnV0ZShcImRhdGEtcG9zXCIsIHggKyBcIixcIiArIHkpO1xuICAgICAgICAgICAgcGxheWVyQm94LmFwcGVuZENoaWxkKHBsYXllckNvb3JkKTtcblxuICAgICAgICAgICAgcGxheWVyQ29vcmQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIF9jbGlja0hhbmRsZXIpO1xuICAgICAgICAgICAgcGxheWVyQ29vcmQuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdzdGFydFwiLCBfZHJhZ3N0YXJ0SGFuZGxlcik7XG4gICAgICAgICAgICBwbGF5ZXJDb29yZC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ292ZXJcIiwgX2RyYWdvdmVySGFuZGxlcik7XG4gICAgICAgICAgICBwbGF5ZXJDb29yZC5hZGRFdmVudExpc3RlbmVyKFwiZHJvcFwiLCBfZHJvcEhhbmRsZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gYWRkIHBsYXllciBzZWxlY3Rpb25cbiAgICBnYW1lTWFuYWdlci5wbGF5ZXIuZ2FtZUJvYXJkLnNoaXBMaXN0LmZvckVhY2goc2hpcCA9PiB7XG4gICAgICAgIHNoaXAuZ2FtZVRpbGVzLmZvckVhY2godGlsZSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzaGlwQ29vcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAucGxheWVyLWJveC1ncmlkLWl0ZW1bZGF0YS1wb3M9JyR7dGlsZS54fSwke3RpbGUueX0nXWApO1xuICAgICAgICAgICAgaWYoc2hpcENvb3JkICE9PSBudWxsKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHNoaXBDb29yZC5jbGFzc0xpc3QuYWRkKFwic2hpcFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBjb21wdXRlckJveCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb21wdXRlci1ib3gtZ3JpZCcpO1xuXG4gICAgZm9yKGxldCB5ID0gMDsgeSA8IDEwOyB5KyspXG4gICAge1xuICAgICAgICBmb3IobGV0IHggPSAwOyB4IDwgMTA7IHgrKylcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgY29tcHV0ZXJDb29yZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICBjb21wdXRlckNvb3JkLmNsYXNzTGlzdC5hZGQoXCJjb21wdXRlci1ib3gtZ3JpZC1pdGVtXCIpXG4gICAgICAgICAgICBjb21wdXRlckNvb3JkLnNldEF0dHJpYnV0ZShcImRhdGEtcG9zXCIsIHggKyBcIixcIiArIHkpO1xuICAgICAgICAgICAgY29tcHV0ZXJCb3guYXBwZW5kQ2hpbGQoY29tcHV0ZXJDb29yZCk7XG5cbiAgICAgICAgICAgIGNvbXB1dGVyQ29vcmQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIF9jbGlja0hhbmRsZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG59XG5cbmNvbnN0IGVuYWJsZUJ1dHRvbnMgPSAoKSA9PiB7XG4gICAgY29uc3Qgc3RhcnRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc3RhcnRCdXR0b24nKTtcbiAgICBzdGFydEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIF9jbGlja0hhbmRsZXIpO1xuXG4gICAgY29uc3QgcmVzZXRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcmVzZXRCdXR0b24nKTtcbiAgICByZXNldEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIF9jbGlja0hhbmRsZXIpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZW5lcmF0ZUxheW91dDtcbmV4cG9ydCB7IGVuYWJsZUJ1dHRvbnMsIGhpdFBsYXllckJvYXJkLCBub3RpZnlWaWN0b3J5IH0iLCJjbGFzcyBDb21wdXRlckFJIHtcbiAgICBjb25zdHJ1Y3RvcigpXG4gICAge1xuICAgICAgICB0aGlzLmNvbXB1dGVyQm9hcmQgPSBbXG4gICAgICAgICAgICBbJycsJycsJycsJycsJycsJycsJycsJycsJycsJyddLFxuICAgICAgICAgICAgWycnLCcnLCcnLCcnLCcnLCcnLCcnLCcnLCcnLCcnXSxcbiAgICAgICAgICAgIFsnJywnJywnJywnJywnJywnJywnJywnJywnJywnJ10sXG4gICAgICAgICAgICBbJycsJycsJycsJycsJycsJycsJycsJycsJycsJyddLFxuICAgICAgICAgICAgWycnLCcnLCcnLCcnLCcnLCcnLCcnLCcnLCcnLCcnXSxcbiAgICAgICAgICAgIFsnJywnJywnJywnJywnJywnJywnJywnJywnJywnJ10sXG4gICAgICAgICAgICBbJycsJycsJycsJycsJycsJycsJycsJycsJycsJyddLFxuICAgICAgICAgICAgWycnLCcnLCcnLCcnLCcnLCcnLCcnLCcnLCcnLCcnXSxcbiAgICAgICAgICAgIFsnJywnJywnJywnJywnJywnJywnJywnJywnJywnJ10sXG4gICAgICAgICAgICBbJycsJycsJycsJycsJycsJycsJycsJycsJycsJyddXG4gICAgICAgIF07XG4gICAgICAgIHRoaXMubmV4dE1vdmVtZW50cyA9IFtdO1xuICAgIH1cblxuICAgIGdldFJhbmRvbUludChtYXgpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG1heCk7XG4gICAgfVxuXG4gICAgaXNWYWxpZFBvc2l0aW9uKHgsIHkpXG4gICAge1xuICAgICAgICBpZih4ID4gOSB8fCB5ID4gOSB8fCB4IDwgMCB8fCB5IDwgMClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYodGhpcy5jb21wdXRlckJvYXJkW3ldW3hdID09PSB1bmRlZmluZWQgfHwgdGhpcy5jb21wdXRlckJvYXJkW3ldW3hdID09PSBudWxsKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZih0aGlzLmNvbXB1dGVyQm9hcmRbeV1beF0gIT09ICcnKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICB2YWxpZE5leHRNb3ZlKCkge1xuICAgICAgICBpZih0aGlzLm5leHRNb3ZlbWVudHMubGVuZ3RoID4gMClcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgbmV4dE1vdmVtZW50ID0gdGhpcy5uZXh0TW92ZW1lbnRzLnBvcCgpO1xuICAgICAgICAgICAgdGhpcy5jb21wdXRlckJvYXJkW25leHRNb3ZlbWVudC55XVtuZXh0TW92ZW1lbnQueF0gPSAnWCc7XG4gICAgICAgICAgICByZXR1cm4gW25leHRNb3ZlbWVudC54LCBuZXh0TW92ZW1lbnQueV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCByYW5kWCA9IHRoaXMuZ2V0UmFuZG9tSW50KDEwKTtcbiAgICAgICAgICAgIGNvbnN0IHJhbmRZID0gdGhpcy5nZXRSYW5kb21JbnQoMTApO1xuXG4gICAgICAgICAgICBpZih0aGlzLmlzVmFsaWRQb3NpdGlvbihyYW5kWCwgcmFuZFkpKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuY29tcHV0ZXJCb2FyZFtyYW5kWV1bcmFuZFhdID0gJ1gnO1xuICAgICAgICAgICAgICAgIHJldHVybiBbcmFuZFgsIHJhbmRZXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFsaWROZXh0TW92ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgeyBDb21wdXRlckFJIH0iLCJpbXBvcnQgeyBoaXRQbGF5ZXJCb2FyZCB9IGZyb20gXCIuLi9sYXlvdXRNYW5hZ2VyXCI7XG5pbXBvcnQgeyBHYW1lVGlsZSB9IGZyb20gXCIuL2dhbWV0aWxlXCJcbmltcG9ydCB7IFNoaXAgfSBmcm9tIFwiLi9zaGlwXCI7XG5cbmNsYXNzIEdhbWVCb2FyZCB7XG4gICAgY29uc3RydWN0b3IgKClcbiAgICB7XG4gICAgICAgIHRoaXMuY3VycmVudEJvYXJkID0gW1xuICAgICAgICAgICAgWycnLCcnLCcnLCcnLCcnLCcnLCcnLCcnLCcnLCcnXSxcbiAgICAgICAgICAgIFsnJywnJywnJywnJywnJywnJywnJywnJywnJywnJ10sXG4gICAgICAgICAgICBbJycsJycsJycsJycsJycsJycsJycsJycsJycsJyddLFxuICAgICAgICAgICAgWycnLCcnLCcnLCcnLCcnLCcnLCcnLCcnLCcnLCcnXSxcbiAgICAgICAgICAgIFsnJywnJywnJywnJywnJywnJywnJywnJywnJywnJ10sXG4gICAgICAgICAgICBbJycsJycsJycsJycsJycsJycsJycsJycsJycsJyddLFxuICAgICAgICAgICAgWycnLCcnLCcnLCcnLCcnLCcnLCcnLCcnLCcnLCcnXSxcbiAgICAgICAgICAgIFsnJywnJywnJywnJywnJywnJywnJywnJywnJywnJ10sXG4gICAgICAgICAgICBbJycsJycsJycsJycsJycsJycsJycsJycsJycsJyddLFxuICAgICAgICAgICAgWycnLCcnLCcnLCcnLCcnLCcnLCcnLCcnLCcnLCcnXVxuICAgICAgICBdO1xuICAgICAgICB0aGlzLnNoaXBMaXN0ID0gW107XG4gICAgfVxuXG5cbiAgICBnZXRSYW5kb21JbnQobWF4KSB7XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtYXgpO1xuICAgIH1cblxuICAgIGdlbmVyYXRlQm9hcmQoKVxuICAgIHtcbiAgICAgICAgLy8gZ2VuZXJhdGUgYmFzaWMgYm9hcmRcbiAgICAgICAgZm9yKGxldCB5ID0gMDsgeSA8IDEwOyB5KyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIGZvcihsZXQgeCA9IDA7IHggPCAxMDsgeCsrKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudEJvYXJkW3ldW3hdID0gbmV3IEdhbWVUaWxlKHgsIHkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmFuZG9tbHkgcGxhY2Ugc2hpcHNcbiAgICAgICAgdGhpcy5wbGFjZU5ld1NoaXAoNCk7XG4gICAgICAgIHRoaXMucGxhY2VOZXdTaGlwKDMpO1xuICAgICAgICB0aGlzLnBsYWNlTmV3U2hpcCgzKTtcbiAgICAgICAgdGhpcy5wbGFjZU5ld1NoaXAoMik7XG4gICAgICAgIHRoaXMucGxhY2VOZXdTaGlwKDIpO1xuICAgICAgICB0aGlzLnBsYWNlTmV3U2hpcCgyKTtcbiAgICAgICAgdGhpcy5wbGFjZU5ld1NoaXAoMSk7XG4gICAgICAgIHRoaXMucGxhY2VOZXdTaGlwKDEpO1xuICAgICAgICB0aGlzLnBsYWNlTmV3U2hpcCgxKTtcbiAgICAgICAgdGhpcy5wbGFjZU5ld1NoaXAoMSk7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7ICAgICAgICBcbiAgICB9XG5cbiAgICBpc1ZhbGlkQ29vcmQoeCwgeSlcbiAgICB7XG4gICAgICAgIGlmKHggPiA5IHx8IHkgPiA5IHx8IHggPCAwIHx8IHkgPCAwKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBjYW5CZUF0dGFja2VkKHgsIHkpXG4gICAge1xuICAgICAgICBpZighdGhpcy5pc1ZhbGlkQ29vcmQoeCwgeSkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHRoaXMuY3VycmVudEJvYXJkW3ldW3hdID09PSB1bmRlZmluZWQgfHwgdGhpcy5jdXJyZW50Qm9hcmRbeV1beF0gPT09IG51bGwpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHRoaXMuY3VycmVudEJvYXJkW3ldW3hdLmhpdClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaGFzQWRqYWNlbnRTaGlwKHgsIHkpXG4gICAge1xuICAgICAgICBpZih0aGlzLmlzVmFsaWRDb29yZCh4LCAoeS0xKSkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmKHRoaXMuaXNWYWxpZENvb3JkKCh4LTEpLCAoeS0xKSkpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5jdXJyZW50Qm9hcmRbKHktMSldWyh4LTEpXS5zaGlwICE9PSBudWxsKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZih0aGlzLmlzVmFsaWRDb29yZCgoeCksICh5LTEpKSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZih0aGlzLmN1cnJlbnRCb2FyZFsoeS0xKV1bKHgpXS5zaGlwICE9PSBudWxsKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZih0aGlzLmlzVmFsaWRDb29yZCgoeCsxKSwgKHktMSkpKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuY3VycmVudEJvYXJkWyh5LTEpXVsoeCsxKV0uc2hpcCAhPT0gbnVsbClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHRoaXMuaXNWYWxpZENvb3JkKCh4LTEpLCAoeSkpKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZih0aGlzLmN1cnJlbnRCb2FyZFsoeSldWyh4LTEpXS5zaGlwICE9PSBudWxsKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYodGhpcy5pc1ZhbGlkQ29vcmQoKHgrMSksICh5KSkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmKHRoaXMuY3VycmVudEJvYXJkWyh5KV1bKHgrMSldLnNoaXAgIT09IG51bGwpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZih0aGlzLmlzVmFsaWRDb29yZCh4LCAoeSsxKSkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmKHRoaXMuaXNWYWxpZENvb3JkKCh4LTEpLCAoeSsxKSkpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5jdXJyZW50Qm9hcmRbKHkrMSldWyh4LTEpXS5zaGlwICE9PSBudWxsKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZih0aGlzLmlzVmFsaWRDb29yZCgoeCksICh5KzEpKSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZih0aGlzLmN1cnJlbnRCb2FyZFsoeSsxKV1bKHgpXS5zaGlwICE9PSBudWxsKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZih0aGlzLmlzVmFsaWRDb29yZCgoeCsxKSwgKHkrMSkpKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuY3VycmVudEJvYXJkWyh5KzEpXVsoeCsxKV0uc2hpcCAhPT0gbnVsbClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBoYXNTcGFjZUZvclNoaXAoeCwgeSwgc2l6ZSwgcm90YXRpb24pXG4gICAge1xuICAgICAgICBsZXQgdmFsaWRQb3NpdGlvbiA9IHRydWU7XG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmKHJvdGF0aW9uID09PSAwKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlmKCF0aGlzLmlzVmFsaWRQb3NpdGlvbigoeCtpKSwgeSkpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB2YWxpZFBvc2l0aW9uID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZighdGhpcy5pc1ZhbGlkUG9zaXRpb24oeCwgKHkraSkpKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsaWRQb3NpdGlvbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsaWRQb3NpdGlvbjtcbiAgICB9XG5cbiAgICBzcGVjaWFsSGFzU3BhY2VGb3JTaGlwKHgsIHksIHNpemUsIHJvdGF0aW9uLCBzaGlwKVxuICAgIHtcbiAgICAgICAgLy8gcmVtb3ZlIHNoaXBcbiAgICAgICAgc2hpcC5nYW1lVGlsZXMuZm9yRWFjaCh0aWxlID0+IHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEJvYXJkW3RpbGUueV1bdGlsZS54XS5zaGlwID0gbnVsbDtcbiAgICAgICAgfSlcblxuICAgICAgICBjb25zdCB2YWxpZFBvc2l0aW9uID0gdGhpcy5oYXNTcGFjZUZvclNoaXAoeCwgeSwgc2l6ZSwgcm90YXRpb24pO1xuXG4gICAgICAgIC8vIGFkZCB0aGUgc2hpcCBiYWNrXG4gICAgICAgIHNoaXAuZ2FtZVRpbGVzLmZvckVhY2godGlsZSA9PiB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRCb2FyZFt0aWxlLnldW3RpbGUueF0uc2hpcCA9IHNoaXA7XG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIHZhbGlkUG9zaXRpb247XG4gICAgfVxuXG4gICAgaXNWYWxpZFBvc2l0aW9uKHgsIHkpXG4gICAge1xuICAgICAgICBpZighdGhpcy5pc1ZhbGlkQ29vcmQoeCwgeSkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHRoaXMuY3VycmVudEJvYXJkW3ldW3hdID09PSB1bmRlZmluZWQgfHwgdGhpcy5jdXJyZW50Qm9hcmRbeV1beF0gPT09IG51bGwpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHRoaXMuY3VycmVudEJvYXJkW3ldW3hdLnNoaXAgIT09IG51bGwpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHRoaXMuaGFzQWRqYWNlbnRTaGlwKHgsIHkpKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBwbGFjZU5ld1NoaXAoc2l6ZSlcbiAgICB7XG4gICAgICAgIGNvbnN0IHJvdGF0aW9uID0gdGhpcy5nZXRSYW5kb21JbnQoMik7XG4gICAgICAgIGNvbnN0IGJhc2VYID0gdGhpcy5nZXRSYW5kb21JbnQoMTApO1xuICAgICAgICBjb25zdCBiYXNlWSA9IHRoaXMuZ2V0UmFuZG9tSW50KDEwKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5wbGFjZU5ld1NoaXBBdChiYXNlWCwgYmFzZVksIHNpemUsIHJvdGF0aW9uLCB0aGlzLnNoaXBMaXN0Lmxlbmd0aCk7XG4gICAgfVxuXG4gICAgcmVtb3ZlU2hpcEF0KHgsIHkpXG4gICAge1xuICAgICAgICBpZih0aGlzLmN1cnJlbnRCb2FyZFt5XVt4XS5zaGlwICE9PSBudWxsKVxuICAgICAgICB7XG4gICAgICAgICAgICBsZXQgc2hpcCA9IHRoaXMuY3VycmVudEJvYXJkW3ldW3hdLnNoaXA7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRCb2FyZFt5XVt4XS5zaGlwLmdhbWVUaWxlcy5mb3JFYWNoKHRpbGUgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudEJvYXJkW3RpbGUueV1bdGlsZS54XS5zaGlwID0gbnVsbDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLnNoaXBMaXN0LnNwbGljZShzaGlwLmluZGV4LCAxKTtcblxuICAgICAgICAgICAgcmV0dXJuIHNoaXAuaW5kZXg7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwbGFjZU5ld1NoaXBBdChiYXNlWCwgYmFzZVksIHNpemUsIHJvdGF0aW9uLCBpbmRleClcbiAgICB7XG4gICAgICAgIGxldCB2YWxpZFBvc2l0aW9uID0gdGhpcy5oYXNTcGFjZUZvclNoaXAoYmFzZVgsIGJhc2VZLCBzaXplLCByb3RhdGlvbik7XG5cbiAgICAgICAgaWYodmFsaWRQb3NpdGlvbilcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgbmV3U2hpcCA9IG5ldyBTaGlwKHNpemUsIHJvdGF0aW9uKTtcbiAgICAgICAgICAgIG5ld1NoaXAuaW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWYocm90YXRpb24gPT09IDApXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRCb2FyZFtiYXNlWV1bKGJhc2VYK2kpXS5zaGlwID0gbmV3U2hpcDtcbiAgICAgICAgICAgICAgICAgICAgbmV3U2hpcC5nYW1lVGlsZXMucHVzaCh0aGlzLmN1cnJlbnRCb2FyZFtiYXNlWV1bKGJhc2VYK2kpXSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50Qm9hcmRbKGJhc2VZK2kpXVtiYXNlWF0uc2hpcCA9IG5ld1NoaXA7XG4gICAgICAgICAgICAgICAgICAgIG5ld1NoaXAuZ2FtZVRpbGVzLnB1c2godGhpcy5jdXJyZW50Qm9hcmRbKGJhc2VZK2kpXVtiYXNlWF0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5zaGlwTGlzdC5zcGxpY2UoaW5kZXgsIDAsIG5ld1NoaXApO1xuXG4gICAgICAgICAgICByZXR1cm4gbmV3U2hpcDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBsYWNlTmV3U2hpcChzaXplKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlY2VpdmVBdHRhY2sgKHgsIHksIGlzQ29tcHV0ZXIgPSBmYWxzZSlcbiAgICB7XG4gICAgICAgIGlmKCF0aGlzLmNhbkJlQXR0YWNrZWQoeCwgeSkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmKCF0aGlzLmN1cnJlbnRCb2FyZFt5XVt4XS5oaXQpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50Qm9hcmRbeV1beF0uaGl0ID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIGxldCBpc1NoaXAgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIGlmKHRoaXMuY3VycmVudEJvYXJkW3ldW3hdLnNoaXAgIT09IG51bGwpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRCb2FyZFt5XVt4XS5zaGlwLmhpdCgpO1xuICAgICAgICAgICAgICAgICAgICBpc1NoaXAgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmKCFpc0NvbXB1dGVyKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaGl0UGxheWVyQm9hcmQoeCwgeSwgaXNTaGlwKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gaXNTaGlwO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzaGlwc1N1bmsoKSB7XG4gICAgICAgIGxldCBjb21wbGV0ZWx5U3VuayA9IHRydWU7XG4gICAgICAgIHRoaXMuc2hpcExpc3QuZm9yRWFjaChzaGlwID0+IHtcbiAgICAgICAgICAgIGlmKCFzaGlwLmlzU3VuaygpKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNvbXBsZXRlbHlTdW5rID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBjb21wbGV0ZWx5U3VuaztcbiAgICB9XG59XG5cbmV4cG9ydCB7IEdhbWVCb2FyZCB9IiwiaW1wb3J0IHsgbm90aWZ5VmljdG9yeSB9IGZyb20gXCIuLi9sYXlvdXRNYW5hZ2VyXCI7XG5pbXBvcnQgeyBDb21wdXRlckFJIH0gZnJvbSBcIi4vY29tcHV0ZXJBSVwiO1xuaW1wb3J0IHsgR2FtZUJvYXJkIH0gZnJvbSBcIi4vZ2FtZWJvYXJkXCJcblxuY2xhc3MgR2FtZVBsYXllciB7XG4gICAgY29uc3RydWN0b3IoaXNDb21wdXRlcilcbiAgICB7XG4gICAgICAgIHRoaXMuZ2FtZUJvYXJkID0gbmV3IEdhbWVCb2FyZCgpO1xuICAgICAgICB0aGlzLmlzQ29tcHV0ZXIgPSBpc0NvbXB1dGVyO1xuICAgICAgICBpZihpc0NvbXB1dGVyKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLmNvbXB1dGVyTW92ZSA9IG5ldyBDb21wdXRlckFJKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkb1BsYXllckF0dGFjayh4LCB5LCBnYW1lKVxuICAgIHtcbiAgICAgICAgaWYodGhpcy5pc0NvbXB1dGVyKVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBuZXh0TW92ZSA9IHRoaXMuY29tcHV0ZXJNb3ZlLnZhbGlkTmV4dE1vdmUoKTtcbiAgICAgICAgICAgIGlmKGdhbWUucGxheWVyLmdhbWVCb2FyZC5yZWNlaXZlQXR0YWNrKG5leHRNb3ZlWzBdLCBuZXh0TW92ZVsxXSkpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgLy8gY29tcHV0ZXIgaGl0cywgaXQgZ2V0cyBhbm90aGVyIHR1cm5cbiAgICAgICAgICAgICAgICAvLyBhZGQgYWRqYWNlbnRzXG4gICAgICAgICAgICAgICAgaWYoZ2FtZS5wbGF5ZXIuZ2FtZUJvYXJkLmNhbkJlQXR0YWNrZWQobmV4dE1vdmVbMF0rMSwgbmV4dE1vdmVbMV0pKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21wdXRlck1vdmUubmV4dE1vdmVtZW50cy5wdXNoKHRoaXMuZ2FtZUJvYXJkLmN1cnJlbnRCb2FyZFtuZXh0TW92ZVsxXV1bbmV4dE1vdmVbMF0rMV0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmKGdhbWUucGxheWVyLmdhbWVCb2FyZC5jYW5CZUF0dGFja2VkKG5leHRNb3ZlWzBdLTEsIG5leHRNb3ZlWzFdKSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcHV0ZXJNb3ZlLm5leHRNb3ZlbWVudHMucHVzaCh0aGlzLmdhbWVCb2FyZC5jdXJyZW50Qm9hcmRbbmV4dE1vdmVbMV1dW25leHRNb3ZlWzBdLTFdKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZihnYW1lLnBsYXllci5nYW1lQm9hcmQuY2FuQmVBdHRhY2tlZChuZXh0TW92ZVswXSwgbmV4dE1vdmVbMV0rMSkpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXB1dGVyTW92ZS5uZXh0TW92ZW1lbnRzLnB1c2godGhpcy5nYW1lQm9hcmQuY3VycmVudEJvYXJkW25leHRNb3ZlWzFdKzFdW25leHRNb3ZlWzBdXSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYoZ2FtZS5wbGF5ZXIuZ2FtZUJvYXJkLmNhbkJlQXR0YWNrZWQobmV4dE1vdmVbMF0sIG5leHRNb3ZlWzFdLTEpKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21wdXRlck1vdmUubmV4dE1vdmVtZW50cy5wdXNoKHRoaXMuZ2FtZUJvYXJkLmN1cnJlbnRCb2FyZFtuZXh0TW92ZVsxXS0xXVtuZXh0TW92ZVswXV0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIGNvbXB1dGVyIGZpZ2h0cyBiYWNrXG4gICAgICAgICAgICAgICAgdGhpcy5kb1BsYXllckF0dGFjayh4LCB5LCBnYW1lKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoZ2FtZS5wbGF5ZXIuZ2FtZUJvYXJkLnNoaXBzU3VuaygpKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGdhbWUuY29tcHV0ZXIuZG9WaWN0b3J5KGdhbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYoZ2FtZS5jb21wdXRlci5nYW1lQm9hcmQucmVjZWl2ZUF0dGFjayh4LCB5LCB0cnVlKSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAvLyBwbGF5ZXIgaGl0cywgaGUgZ2V0cyBhbm90aGVyIHR1cm5cbiAgICAgICAgICAgIH0gZWxzZSBpZighZ2FtZS5jb21wdXRlci5nYW1lQm9hcmQuc2hpcHNTdW5rKCkpIHtcbiAgICAgICAgICAgICAgICAvLyBjb21wdXRlciBmaWdodHMgYmFjayBpZiB0aGUgZ2FtZSBoYXNuJ3QgZW5kZWRcbiAgICAgICAgICAgICAgICBnYW1lLmNvbXB1dGVyLmRvUGxheWVyQXR0YWNrKHgsIHksIGdhbWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihnYW1lLmNvbXB1dGVyLmdhbWVCb2FyZC5zaGlwc1N1bmsoKSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBnYW1lLnBsYXllci5kb1ZpY3RvcnkoZ2FtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkb1ZpY3RvcnkoZ2FtZSlcbiAgICB7XG4gICAgICAgIGdhbWUuc3RhdHVzID0gJ2ZpbmlzaGVkJztcbiAgICAgICAgbm90aWZ5VmljdG9yeSh0aGlzLmlzQ29tcHV0ZXIpOyAgICAgICAgXG4gICAgfVxufVxuXG5leHBvcnQgeyBHYW1lUGxheWVyIH0iLCJjbGFzcyBHYW1lVGlsZSB7XG4gICAgY29uc3RydWN0b3IoeCwgeSlcbiAgICB7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgICAgIHRoaXMuaGl0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc2hpcCA9IG51bGw7XG4gICAgfVxufVxuXG5leHBvcnQgeyBHYW1lVGlsZSB9IiwiY2xhc3MgU2hpcCB7XG4gICAgY29uc3RydWN0b3IgKGxlbmd0aCwgcm90YXRpb24gPSAwKVxuICAgIHtcbiAgICAgICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG4gICAgICAgIHRoaXMucm90YXRpb24gPSByb3RhdGlvbjtcbiAgICAgICAgdGhpcy5oaXRzID0gMDsgICAgICAgIFxuICAgICAgICB0aGlzLmdhbWVUaWxlcyA9IFtdO1xuICAgICAgICB0aGlzLmluZGV4ID0gMDtcbiAgICB9XG5cbiAgICBoaXQgKCkge1xuICAgICAgICBpZih0aGlzLmhpdHMgPCB0aGlzLmxlbmd0aClcbiAgICAgICAgeyBcbiAgICAgICAgICAgIHRoaXMuaGl0cyArPSAxO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaXNTdW5rKCkge1xuICAgICAgICByZXR1cm4gKHRoaXMuaGl0cyA+PSB0aGlzLmxlbmd0aCk7XG4gICAgfVxuICAgIFxufVxuXG5leHBvcnQgeyBTaGlwIH0iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBnZW5lcmF0ZUxheW91dCwgeyBlbmFibGVCdXR0b25zIH0gZnJvbSAnLi9zY3JpcHRzL2xheW91dE1hbmFnZXInO1xuaW1wb3J0ICcuL3N0eWxlcy9zdHlsZS5jc3MnO1xuXG5nZW5lcmF0ZUxheW91dCgpO1xuZW5hYmxlQnV0dG9ucygpOyJdLCJuYW1lcyI6WyJHYW1lUGxheWVyIiwiR2FtZU1hbmFnZXIiLCJjb25zdHJ1Y3RvciIsInBsYXllciIsImNvbXB1dGVyIiwic3RhdHVzIiwiZ2FtZUJvYXJkIiwiZ2VuZXJhdGVCb2FyZCIsInN0YXJ0R2FtZSIsInBsYXllckNsaWNrcyIsIngiLCJ5IiwiZG9QbGF5ZXJBdHRhY2siLCJnYW1lTWFuYWdlciIsIl9jbGlja0hhbmRsZXIiLCJldmVudCIsInRhcmdldCIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwib2JqIiwiZ2V0QXR0cmlidXRlIiwic3BsaXQiLCJzZXRYIiwic2V0WSIsImN1cnJlbnRCb2FyZCIsInNoaXAiLCJhZGQiLCJpZCIsInNldEF0dHJpYnV0ZSIsInRleHRCb3giLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJ0ZXh0Q29udGVudCIsInN0YXJ0QnV0dG9uIiwicmVtb3ZlQXR0cmlidXRlIiwiX2NsZWFudXBMYXlvdXQiLCJmaXJzdFBhcmFncmFwaCIsImNyZWF0ZUVsZW1lbnQiLCJhcHBlbmRDaGlsZCIsInNlY29uZFBhcmFncmFwaCIsImdlbmVyYXRlTGF5b3V0IiwiX2RyYWdzdGFydEhhbmRsZXIiLCJkYXRhVHJhbnNmZXIiLCJzZXREYXRhIiwib3V0ZXJIVE1MIiwiZHJvcEVmZmVjdCIsIl9kcm9wSGFuZGxlciIsInByZXZlbnREZWZhdWx0IiwiZGF0YVBvcyIsImdldERhdGEiLCJwb3NTcGxpdCIsInBvc1NoaXAiLCJnb2FsUG9zIiwibGVuZ3RoIiwic3BlY2lhbEhhc1NwYWNlRm9yU2hpcCIsInJvdGF0aW9uIiwiX3JlbW92ZVNoaXBGcm9tTGF5b3V0Iiwic2hpcEluZGV4IiwicmVtb3ZlU2hpcEF0IiwibmV3U2hpcCIsInBsYWNlTmV3U2hpcEF0IiwiX2FkZFNoaXBUb0xheW91dCIsIl9kcmFnb3ZlckhhbmRsZXIiLCJoaXRQbGF5ZXJCb2FyZCIsImlzU2hpcCIsInNoaXBDb29yZCIsIm5vdGlmeVZpY3RvcnkiLCJjb21wdXRlcldvbiIsInBsYXllcklucHV0IiwiZ2FtZVRpbGVzIiwiZm9yRWFjaCIsInRpbGUiLCJyZW1vdmUiLCJwbGF5ZXJCb3giLCJmaXJzdENoaWxkIiwicmVtb3ZlQ2hpbGQiLCJsYXN0Q2hpbGQiLCJjb21wdXRlckJveCIsInBsYXllckNvb3JkIiwiYWRkRXZlbnRMaXN0ZW5lciIsInNoaXBMaXN0IiwiY29tcHV0ZXJDb29yZCIsImVuYWJsZUJ1dHRvbnMiLCJyZXNldEJ1dHRvbiIsIkNvbXB1dGVyQUkiLCJjb21wdXRlckJvYXJkIiwibmV4dE1vdmVtZW50cyIsImdldFJhbmRvbUludCIsIm1heCIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImlzVmFsaWRQb3NpdGlvbiIsInVuZGVmaW5lZCIsInZhbGlkTmV4dE1vdmUiLCJuZXh0TW92ZW1lbnQiLCJwb3AiLCJyYW5kWCIsInJhbmRZIiwiR2FtZVRpbGUiLCJTaGlwIiwiR2FtZUJvYXJkIiwicGxhY2VOZXdTaGlwIiwiaXNWYWxpZENvb3JkIiwiY2FuQmVBdHRhY2tlZCIsImhpdCIsImhhc0FkamFjZW50U2hpcCIsImhhc1NwYWNlRm9yU2hpcCIsInNpemUiLCJ2YWxpZFBvc2l0aW9uIiwiaSIsImJhc2VYIiwiYmFzZVkiLCJzcGxpY2UiLCJpbmRleCIsInB1c2giLCJyZWNlaXZlQXR0YWNrIiwiaXNDb21wdXRlciIsImFyZ3VtZW50cyIsInNoaXBzU3VuayIsImNvbXBsZXRlbHlTdW5rIiwiaXNTdW5rIiwiY29tcHV0ZXJNb3ZlIiwiZ2FtZSIsIm5leHRNb3ZlIiwiZG9WaWN0b3J5IiwiaGl0cyJdLCJzb3VyY2VSb290IjoiIn0=