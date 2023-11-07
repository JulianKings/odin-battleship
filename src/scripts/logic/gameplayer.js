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
            if(game.player.gameBoard.receiveAttack(nextMove[0], nextMove[1]))
            {
                // computer hits, it gets another turn
                // add adjacents
                if(game.player.gameBoard.canBeAttacked(nextMove[0]+1, nextMove[1]))
                {
                    this.computerMove.nextMovements.push(this.gameBoard.currentBoard[nextMove[1]][nextMove[0]+1]);
                }

                if(game.player.gameBoard.canBeAttacked(nextMove[0]-1, nextMove[1]))
                {
                    this.computerMove.nextMovements.push(this.gameBoard.currentBoard[nextMove[1]][nextMove[0]-1]);
                }

                if(game.player.gameBoard.canBeAttacked(nextMove[0], nextMove[1]+1))
                {
                    this.computerMove.nextMovements.push(this.gameBoard.currentBoard[nextMove[1]+1][nextMove[0]]);
                }

                if(game.player.gameBoard.canBeAttacked(nextMove[0], nextMove[1]-1))
                {
                    this.computerMove.nextMovements.push(this.gameBoard.currentBoard[nextMove[1]-1][nextMove[0]]);
                }

                // computer fights back
                this.doPlayerAttack(x, y, game);
            }

            if(game.player.gameBoard.shipsSunk())
            {
                game.computer.doVictory(game);
            }
        } else {
            if(game.computer.gameBoard.receiveAttack(x, y, true))
            {
                // player hits, he gets another turn
            } else if(!game.computer.gameBoard.shipsSunk()) {
                // computer fights back if the game hasn't ended
                game.computer.doPlayerAttack(x, y, game);
            }

            if(game.computer.gameBoard.shipsSunk())
            {
                game.player.doVictory(game);
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