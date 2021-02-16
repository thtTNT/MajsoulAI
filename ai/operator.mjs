import * as MJSoul from "mjsoul";

class operator {

    constructor(game) {
        this.game = game;
    }

    async discard(tile) {
        await this.game.sendAsync("inputOperation", {
            type: 1,
            tile: tile,
            timeuse: 3
        })
    }

    async peng() {
        await this.game.sendAsync("inputChiPengGang", {
            type: 3,
            timeuse: 3
        })
    }

    async chi() {
        await this.game.sendAsync("inputChiPengGang", {
            type: 2,
            timeuse: 3
        })
    }

    async liqi(tile) {
        await this.game.sendAsync("inputOperation", {
            type: 7,
            timeuse: 3
        })
    }

    async cancelChiPengGang() {
        await this.game.sendAsync("inputChiPengGang", {
            cancel_operation: 1,
            timeuse: 1
        })
    }

}

export default operator;
