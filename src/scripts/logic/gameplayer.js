import { ComputerAI } from "./computerAI";
import { GameBoard } from "./gameboard"

class GamePlayer {
    constructor(isComputer)
    {
        this.gameBoard = new GameBoard();
        this.isComputer = isComputer;
        if(isComputer)
        {
            this.computerMove = new ComputerAI();
        }
    }

    doPlayerAttack(x, y, game)
    {
        if(this.isComputer)
        {
            const nextMove = this.computerMove.validNextMove();
            game.player.gameBoard.receiveAttack(nextMove[0], nextMove[1]);
        } else {
            game.computer.gameBoard.receiveAttack(x, y, true);

            // computer fights back
            game.computer.doPlayerAttack(x, y, game);
        }
    }
}

export { GamePlayer }