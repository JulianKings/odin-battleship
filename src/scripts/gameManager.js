import { GamePlayer } from "./logic/gameplayer"

class GameManager {
    constructor () {
        this.player = new GamePlayer(false);
        this.computer = new GamePlayer(true);
        this.status = 'started';

        this.player.gameBoard.generateBoard();
        this.computer.gameBoard.generateBoard();
    }

    playerClicks(x, y)
    {
        this.player.doPlayerAttack(x, y);
    }
}

export { GameManager }