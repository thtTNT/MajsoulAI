import operator from "../operator.mjs";
import Hand from "./Hand.mjs";

class ai {

    constructor(operator) {
        this.hand = new Hand();
        this.operator = operator;
    }

    onGameStart(tiles) {
        console.log("初始手牌: " + tiles);
        this.hand.initHand(tiles);
    }

    onTileAdd(tile) {
        console.log("摸排: " + tile)
        this.hand.inTile(tile);
    }

    async waitOperation(opList) {

        //判断是否为出牌
        if (opList.length === 1 && opList[0].type === 1){
            console.log("[等待]出牌");
            let tile = this.hand.getTiles()[0];

            console.log("[AI]出牌: " + tile);
            await this.operator.discard(tile);
            this.hand.discard(tile);
            return;
        }

        //判断是否为吃碰杠
        for (const op of opList) {

            //吃
            if (op.type === 2){
                console.log("[AI]吃");
                await this.operator.chi()
            }

            //碰
            if (op.type === 3){
                console.log("[AI]碰");
                await this.operator.peng()
            }
        }
    }
}

export default ai;
