import { hitPlayerBoard } from "../layoutManager";
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

    isValidCoord(x, y)
    {
        if(x > 9 || y > 9 || x < 0 || y < 0)
        {
            return false;
        }

        return true;
    }

    canBeAttacked(x, y)
    {
        if(!this.isValidCoord(x, y))
        {
            return false;
        }

        if(this.currentBoard[y][x] === undefined || this.currentBoard[y][x] === null)
        {
            return false;
        }

        if(this.currentBoard[y][x].hit)
        {
            return false;
        }

        return true;
    }

    hasAdjacentShip(x, y)
    {
        if(this.isValidCoord(x, (y-1)))
        {
            if(this.isValidCoord((x-1), (y-1)))
            {
                if(this.currentBoard[(y-1)][(x-1)].ship !== null)
                {
                    return true;
                }
            }

            if(this.isValidCoord((x), (y-1)))
            {
                if(this.currentBoard[(y-1)][(x)].ship !== null)
                {
                    return true;
                }
            }

            if(this.isValidCoord((x+1), (y-1)))
            {
                if(this.currentBoard[(y-1)][(x+1)].ship !== null)
                {
                    return true;
                }
            }
        }

        if(this.isValidCoord((x-1), (y)))
        {
            if(this.currentBoard[(y)][(x-1)].ship !== null)
            {
                return true;
            }
        }

        if(this.isValidCoord((x+1), (y)))
        {
            if(this.currentBoard[(y)][(x+1)].ship !== null)
            {
                return true;
            }
        }

        if(this.isValidCoord(x, (y+1)))
        {
            if(this.isValidCoord((x-1), (y+1)))
            {
                if(this.currentBoard[(y+1)][(x-1)].ship !== null)
                {
                    return true;
                }
            }

            if(this.isValidCoord((x), (y+1)))
            {
                if(this.currentBoard[(y+1)][(x)].ship !== null)
                {
                    return true;
                }
            }

            if(this.isValidCoord((x+1), (y+1)))
            {
                if(this.currentBoard[(y+1)][(x+1)].ship !== null)
                {
                    return true;
                }
            }
        }

        return false;
    }

    hasSpaceForShip(x, y, size, rotation)
    {
        let validPosition = true;
        for(let i = 0; i < size; i++)
        {
            if(rotation === 0)
            {
                if(!this.isValidPosition((x+i), y))
                {
                    validPosition = false;
                }
            } else {
                if(!this.isValidPosition(x, (y+i)))
                {
                    validPosition = false;
                }
            }
        }
        return validPosition;
    }

    specialHasSpaceForShip(x, y, size, rotation, ship)
    {
        // remove ship
        ship.gameTiles.forEach(tile => {
            this.currentBoard[tile.y][tile.x].ship = null;
        })

        const validPosition = this.hasSpaceForShip(x, y, size, rotation);

        // add the ship back
        ship.gameTiles.forEach(tile => {
            this.currentBoard[tile.y][tile.x].ship = ship;
        })

        return validPosition;
    }

    isValidPosition(x, y)
    {
        if(!this.isValidCoord(x, y))
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

        if(this.hasAdjacentShip(x, y))
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

        return this.placeNewShipAt(baseX, baseY, size, rotation, this.shipList.length);
    }

    removeShipAt(x, y)
    {
        if(this.currentBoard[y][x].ship !== null)
        {
            let ship = this.currentBoard[y][x].ship;
            this.currentBoard[y][x].ship.gameTiles.forEach(tile => {
                this.currentBoard[tile.y][tile.x].ship = null;
            });

            this.shipList.splice(ship.index, 1);

            return ship.index;
        }
    }

    placeNewShipAt(baseX, baseY, size, rotation, index)
    {
        let validPosition = this.hasSpaceForShip(baseX, baseY, size, rotation);

        if(validPosition)
        {
            const newShip = new Ship(size, rotation);
            newShip.index = index;
            for(let i = 0; i < size; i++)
            {
                if(rotation === 0)
                {
                    this.currentBoard[baseY][(baseX+i)].ship = newShip;
                    newShip.gameTiles.push(this.currentBoard[baseY][(baseX+i)]);
                } else {
                    this.currentBoard[(baseY+i)][baseX].ship = newShip;
                    newShip.gameTiles.push(this.currentBoard[(baseY+i)][baseX]);
                }
            }

            this.shipList.splice(index, 0, newShip);

            return newShip;
        } else {
            return this.placeNewShip(size);
        }
    }

    receiveAttack (x, y, isComputer = false)
    {
        if(!this.canBeAttacked(x, y))
        {
            return false;
        } else {
            if(!this.currentBoard[y][x].hit)
            {
                this.currentBoard[y][x].hit = true;

                let isShip = false;

                if(this.currentBoard[y][x].ship !== null)
                {
                    this.currentBoard[y][x].ship.hit();
                    isShip = true;
                }

                if(!isComputer)
                {
                    hitPlayerBoard(x, y, isShip);
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
            if(!ship.isSunk())
            {
                completelySunk = false;
            }
        });

        return completelySunk;
    }
}

export { GameBoard }