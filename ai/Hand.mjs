class Hand {

    constructor() {
        this.tiles = [];
    }

    initHand(tiles) {
        if (tiles.length !== 13 && tiles.length !== 14) {
            throw new Error("初始手牌不为13/14张");
        }
        this.tiles = tiles;
    }

    inTile(tile) {
        this.tiles.push(tile);
    }

    discard(tile) {
        let index = this.tiles.indexOf(tile);
        if (index === -1) {
            throw new Error("需要出的牌不存在")
        }
        this.tiles.splice(index, 1);
    }

    getTiles() {
        return this.tiles;
    }

}

export default Hand;
