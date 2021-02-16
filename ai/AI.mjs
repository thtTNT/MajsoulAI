class AI {

    constructor(manager) {
        this.manager = manager;
    }

    getDiscard() {
        return this.manager.getHand().tiles[0];
    }

    operation(opList) {
        for (let op of opList) {
            if (op.type === 7) {
                return op;
            }
            if (op.type === 1) {
                op.discard = this.getDiscard();
                return op;
            }
            if (op.type === 2 || op.type === 3) {
                op.cancel = true;
                return op;
            }
        }
    }


}

export default AI;
