import operator from "./operator.mjs";
import Hand from "./Hand.mjs";
import AI from "./AI.mjs";
import Operation from "./Operation.mjs";

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
            await this.waitOperation([{type: 1}])
        }
    }

    onTileAdd(tile) {
        console.log("摸排: " + tile)
        this.hand.inTile(tile);
    }

    async waitOperation(data) {
        let opList = data.data.operation.operation_list;

        let aiOpList = [];
        console.log("[等待]操作:");
        for (let op of opList) {
            const aiOp = new Operation();
            switch (op.type) {
                case 1:
                    aiOp.type = 1;
                    aiOpList.push(aiOp);
                    console.log("[等待]出牌");
                    break;
                case 2:
                    aiOp.type = 2;
                    aiOp.tile = data.data.tile;
                    aiOpList.push(aiOp);
                    console.log("[等待]吃");
                    break;
                case 3:
                    aiOp.type = 3;
                    aiOp.tile = data.data.tile;
                    aiOpList.push(aiOp);
                    console.log("[等待]碰");
                    break;
                case 7:
                    aiOp.type = 7;
                    aiOpList.push(aiOp);
                    console.log("[等待]立直");
                    break;
            }
        }

        let op = this.ai.operation(aiOpList);

        switch (op.type) {
            case 1:
                console.log("[AI]出牌: " + op.discard);
                await this.operator.discard(op.discard);
                this.hand.discard(op.discard);
                break;
            case 2:
                if (op.cancel) {
                    console.log("[AI]跳过");
                    await this.operator.cancelChiPengGang();
                }
                break;
            case 3:
                if (op.cancel) {
                    console.log("[AI]跳过");
                    await this.operator.cancelChiPengGang();
                }
                break;
            case 7:
                if (op.cancel) {

                }
                await this.operator.liqi(op.tile);
        }
    }

    getHand() {
        return this.hand;
    }
}

export default AIManager;
