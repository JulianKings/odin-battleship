class Ship {
    constructor (length, rotation = 0)
    {
        this.length = length;
        this.rotation = rotation;
        this.hits = 0;        
        this.gameTiles = [];
    }

    hit () {
        if(this.hits < this.length)
        { 
            this.hits += 1;
            return true;
        }

        return false;
    }

    isSunk() {
        return (this.hits >= this.length);
    }
    
}

export { Ship }