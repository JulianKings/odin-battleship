import { GameManager } from "./gameManager";

let gameManager;

const _clickHandler = (event) => {
    if(gameManager.status === 'started')
    {
        if(event.target.classList.contains('computer-box-grid-item'))
        {
            if(!event.target.classList.contains('hit') && !event.target.classList.contains("hit_enemy_ship"))
            {
                const obj = event.target.getAttribute("data-pos").split(',');
                const setX = obj[0], setY = obj[1];
                gameManager.player.doPlayerAttack(setX, setY, gameManager);

                if(gameManager.computer.gameBoard.currentBoard[setY][setX].ship !== null)
                {
                    event.target.classList.add("hit_enemy_ship");
                } else {
                    event.target.classList.add('hit');
                }
            }
        }
    } else if(gameManager.status === 'starting')
    {
        // drag and drop logic
    }

    if(event.target.id === 'startButton')
    {
        event.target.setAttribute('disabled', '');
        const textBox = document.querySelector('.text-holder');
        textBox.textContent = 'Game running...';
        gameManager.startGame();
    }

    if(event.target.id === 'resetButton')
    {
        const startButton = document.querySelector('#startButton');
        if(startButton !== null)
        {
            if(startButton.getAttribute('disabled') === '')
            {
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
}

const _dragstartHandler = (event) => {
    if(gameManager.status === 'starting')
    {
        // drag and drop logic
        event.dataTransfer.setData("text/plain", event.target.getAttribute('data-pos'));
        event.dataTransfer.setData("text/html", event.target.outerHTML);
        event.dataTransfer.dropEffect = "move";
    }
}

const _dropHandler = (event) => {
    event.preventDefault();
    if(gameManager.status === 'starting')
    {
        const dataPos = (event.dataTransfer.getData("text/plain"));
        if(dataPos)
        {
            const posSplit = dataPos.split(',');
            if(gameManager.player.gameBoard.currentBoard[+posSplit[1]][+posSplit[0]].ship !== null)
            {
                const posShip = gameManager.player.gameBoard.currentBoard[+posSplit[1]][+posSplit[0]].ship;
                const goalPos = event.target.getAttribute('data-pos').split(',');
                if(goalPos.length > 0)
                {
                    if(gameManager.player.gameBoard.specialHasSpaceForShip(+goalPos[0], +goalPos[1], posShip.length, posShip.rotation, posShip))
                    {
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
}

const _dragoverHandler = (event) => {
    event.preventDefault();
    if(gameManager.status === 'starting')
    {
        // drag and drop logic
        event.dataTransfer.setData("text/plain", event.target.getAttribute('data-pos'));
        event.dataTransfer.setData("text/html", event.target.outerHTML);
        event.dataTransfer.dropEffect = "move";
    }
}

const hitPlayerBoard = (x, y, isShip) => {
    const shipCoord = document.querySelector(`.player-box-grid-item[data-pos='${x},${y}']`);
    if(shipCoord !== null)
    {
        if(isShip)
        {
            shipCoord.classList.add("hit_ship");
        } else {
            shipCoord.classList.add("hit");
        }
    }

}

const notifyVictory = (computerWon) => {
    if(!computerWon)
    {
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
}

const _removeShipFromLayout = (x, y) => {
    if(gameManager.player.gameBoard.currentBoard[y][x].ship !== null)
    {
        gameManager.player.gameBoard.currentBoard[y][x].ship.gameTiles.forEach(tile => {
            const shipCoord = document.querySelector(`.player-box-grid-item[data-pos='${tile.x},${tile.y}']`);
            if(shipCoord !== null)
            {
                if(shipCoord.classList.contains("ship"))
                {
                    shipCoord.classList.remove("ship");
                }
            }
        })
    }
}

const _addShipToLayout = (ship) => {
    ship.gameTiles.forEach(tile => {
            const shipCoord = document.querySelector(`.player-box-grid-item[data-pos='${tile.x},${tile.y}']`);
            if(shipCoord !== null)
            {
                if(!shipCoord.classList.contains("ship"))
                {
                    shipCoord.classList.add("ship");
                }
            }
        });
}

const _cleanupLayout = () => {
    const playerBox = document.querySelector('.player-box-grid');
    while(playerBox.firstChild)
    {
        playerBox.removeChild(playerBox.lastChild);
    }

    const computerBox = document.querySelector('.computer-box-grid');
    while(computerBox.firstChild)
    {
        computerBox.removeChild(computerBox.lastChild);
    }

    const textBox = document.querySelector('.text-holder');
    while(textBox.firstChild)
    {
        textBox.removeChild(textBox.lastChild);
    }
}

const generateLayout = () => {
    gameManager = new GameManager();
    const playerBox = document.querySelector('.player-box-grid');

    for(let y = 0; y < 10; y++)
    {
        for(let x = 0; x < 10; x++)
        {
            const playerCoord = document.createElement("div");
            playerCoord.classList.add("player-box-grid-item")
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
            if(shipCoord !== null)
            {
                shipCoord.classList.add("ship");
            }
        });
    });

    const computerBox = document.querySelector('.computer-box-grid');

    for(let y = 0; y < 10; y++)
    {
        for(let x = 0; x < 10; x++)
        {
            const computerCoord = document.createElement("div");
            computerCoord.classList.add("computer-box-grid-item")
            computerCoord.setAttribute("data-pos", x + "," + y);
            computerBox.appendChild(computerCoord);

            computerCoord.addEventListener("click", _clickHandler);
        }
    }

}

const enableButtons = () => {
    const startButton = document.querySelector('#startButton');
    startButton.addEventListener('click', _clickHandler);

    const resetButton = document.querySelector('#resetButton');
    resetButton.addEventListener('click', _clickHandler);
}

export default generateLayout;
export { enableButtons, hitPlayerBoard, notifyVictory }