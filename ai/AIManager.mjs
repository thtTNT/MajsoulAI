import operator from "./operator.mjs";
import Hand from "./Hand.mjs";
import AI from "./AI.mjs";
import Operation from "./Operation.js";

//AI的主控程序
class AIManager {

    constructor(operator) {
        this.hand = new Hand();
        this.ai = new AI(this);
        this.operator = operator;
    }

    async onGameStart(tiles) {
        console.log("初始手牌: " + tiles);
        this.hand.initHand(tiles);
        if (tiles.length === 14) {
            await this.waitDiscard();
        }
    }

    onTileAdd(tile) {
        console.log("摸排: " + tile)
        this.hand.inTile(tile);
    }

    async waitOperation(data) {
        let opList = data.data.operation.operation_list;

        let aiOpList = [];
        for (let op of opList) {
            const aiOp = new Operation();
            switch (op.type) {
                case 1:
                    aiOp.type = 1;
                    aiOpList.push(aiOp);
                    break;
                case 2:
                    aiOp.type = 2;
                    aiOp.tile = data.data.tile;
                    aiOpList.push(aiOp);
                    break;
                case 3:
                    aiOp.type = 3;
                    aiOp.tile = data.data.tile;
                    aiOpList.push(aiOp);
                    break;
                case 7:
                    aiOp.type = 7;
                    aiOpList.push(aiOp);
                    break;
            }
        }

        this.ai.operation(aiOpList);
        // //判断是否为出牌
        // if (opList.length === 1 && opList[0].type === 1) {
        //     await this.waitDiscard();
        //     return;
        // }
        //
        // //判断是否为吃碰杠
        // for (const op of opList) {
        //
        //     //吃
        //     if (op.type === 2) {
        //         console.log("[等待]吃")
        //         console.log("[AI]吃");
        //         await this.operator.chi()
        //         await this.waitDiscard();
        //     }
        //
        //     //碰
        //     if (op.type === 3) {
        //         console.log("[AI]碰");
        //         await this.operator.peng();
        //         await this.waitDiscard();
        //     }
        // }
    }

    async waitDiscard() {
        console.log("[等待]出牌");
        let tile = this.ai.getDiscard();

        console.log("[AI]出牌: " + tile);
        await this.operator.discard(tile);
        this.hand.discard(tile);
    }

    getHand() {
        return this.hand;
    }
}

export default AIManager;
