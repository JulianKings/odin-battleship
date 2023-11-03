import { notifyVictory } from "../layoutManager";
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

            if(game.player.gameBoard.shipsSunk())
            {
                game.computer.doVictory(game);
            }
        } else {
            game.computer.gameBoard.receiveAttack(x, y, true);

            if(game.computer.gameBoard.shipsSunk())
            {
                game.player.doVictory(game);
            } else {

                // computer fights back
                game.computer.doPlayerAttack(x, y, game);
            }
        }
    }

    doVictory(game)
    {
        game.status = 'finished';
        notifyVictory(this.isComputer);        
    }
}

export { GamePlayer }