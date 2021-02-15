class AI {

    constructor(manager) {
        this.manager = manager;
    }

    getDiscard() {
        return this.manager.getHand().tiles[0];
    }

    operation(opList) {

    }


}

export default AI;
