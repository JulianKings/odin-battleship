class ComputerAI {
    constructor()
    {
        this.computerBoard = [
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
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    isValidPosition(x, y)
    {
        if(x > 9 || y > 9 || x < 0 || y < 0)
        {
            return false;
        }

        if(this.computerBoard[y][x] === undefined || this.computerBoard[y][x] === null)
        {
            return false;
        }

        if(this.computerBoard[y][x] !== '')
        {
            return false;
        }

        return true;
    }

    validNextMove() {
        const randX = this.getRandomInt(10);
        const randY = this.getRandomInt(10);

        if(this.isValidPosition(randX, randY))
        {
            this.computerBoard[randY][randX] = 'X';
            return [randX, randY];
        } else {
            return this.validNextMove();
        }
    }
}

export { ComputerAI }