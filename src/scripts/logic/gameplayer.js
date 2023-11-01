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
}

export { GamePlayer }