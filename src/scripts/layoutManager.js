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
    } else {
        const playerInput = document.querySelector('.computer-box-title');
        playerInput.textContent = 'Computer (WON!)';
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

export default generateLayout;
export { hitPlayerBoard, notifyVictory }