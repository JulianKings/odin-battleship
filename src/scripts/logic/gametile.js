class GameTile {
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
        this.hit = false;
        this.ship = null;
    }
}

export { GameTile }