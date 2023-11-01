import { GameTile } from "./gametile"
import { Ship } from "./ship";

class GameBoard {
    constructor ()
    {
        this.currentBoard = [
            ['','','','','','','','','',''],
            ['','','','','','','','','',''],
            ['','','','','','','','','',''],
            ['','','','','','','','','',''],
            ['','','','','','','','','',''],
            ['','','','','','','','','',''],
            ['','','','','','','','','',''],
            ['','','','','','','','','',''],
            ['','','','','','','','','',''],
            ['','','','','','','','','','']
        ];
        this.shipList = [];
    }


    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    generateBoard()
    {
        // generate basic board
        for(let y = 0; y < 10; y++)
        {
            for(let x = 0; x < 10; x++)
            {
                this.currentBoard[y][x] = new GameTile(x, y);
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

    canBeAttacked(x, y)
    {
        if(x > 9 || y > 9 || x < 0 || y < 0)
        {
            return false;
        }

        if(this.currentBoard[y][x] === undefined || this.currentBoard[y][x] === null)
        {
            return false;
        }

        return true;
    }

    isValidPosition(x, y)
    {
        if(x > 9 || y > 9 || x < 0 || y < 0)
        {
            return false;
        }

        if(this.currentBoard[y][x] === undefined || this.currentBoard[y][x] === null)
        {
            return false;
        }

        if(this.currentBoard[y][x].ship !== null)
        {
            return false;
        }

        return true;
    }

    placeNewShip(size)
    {
        const rotation = this.getRandomInt(2);
        const baseX = this.getRandomInt(10);
        const baseY = this.getRandomInt(10);

        let validPosition = true;
        for(let i = 0; i < size; i++)
        {
            if(rotation === 0)
            {
                if(!this.isValidPosition((baseX+i), baseY))
                {
                    validPosition = false;
                }
            } else {
                if(!this.isValidPosition(baseX, (baseY+i)))
                {
                    validPosition = false;
                }
            }
        }

        if(validPosition)
        {
            const newShip = new Ship(size, rotation);
            for(let i = 0; i < size; i++)
            {
                if(rotation === 0)
                {
                    this.currentBoard[baseY][(baseX+i)].ship = newShip;
                } else {
                    this.currentBoard[(baseY+i)][baseX].ship = newShip;
                }
            }

            this.shipList.push(newShip);

            return true;
        } else {
            return this.placeNewShip(size);
        }
    }

    receiveAttack (x, y)
    {
        if(!this.canBeAttacked(x, y))
        {
            return false;
        } else {
            if(!this.currentBoard[y][x].hit)
            {
                this.currentBoard[y][x].hit = true;

                if(this.currentBoard[y][x].ship !== null)
                {
                    this.currentBoard[y][x].ship.hit();
                }

                return true;
            } else {
                return false;
            }
        }
    }

    shipsSunk() {
        let completelySunk = true;
        this.shipList.forEach(ship => {
            if(!ship.isSunk())
            {
                completelySunk = false;
            }
        });

        return completelySunk;
    }
}

export { GameBoard }