import operator from "./ai/operator.mjs";
import AIManager from "./ai/AIManager.mjs";
import MJSoul from "mjsoul"

let mjsoul = new MJSoul({
    url: "wss://gateway-v2.maj-soul.com:6443", //雀魂ws连接地址，可以修改为日服或者国际服的地址
    timeout: 5000 //异步超时时间，超时则会reject
})
let game = new MJSoul({
    url: "wss://gateway-v2.maj-soul.com:7443", //雀魂ws连接地址，可以修改为日服或者国际服的地址
    timeout: 5000 //异步超时时间，超时则会reject
})

let account_id = -1;
let tiles = [];
let seat = -1;
//登陆功能
let login = async () => {
    console.log("登陆中...")
    let data = await mjsoul.sendAsync("login", {
        account: "thtmajsoul@163.com",
        password: mjsoul.hash("thtmajsoul")
    })

    account_id = data.account_id

    console.log("加入房间...")
    await mjsoul.sendAsync("joinRoom", {
        room_id: 96767
    })

    console.log("准备...")
    await mjsoul.sendAsync("readyPlay", {
        ready: true
    })

}

mjsoul.on("NotifyRoomGameStart", async (data) => {
    console.log("游戏开始！")
    let game_uuid = data.game_uuid
    let token = data.connect_token
    console.log("连接游戏...")
    game.open(async () => {
        let gameData = await game.sendAsync("authGame", {
            account_id: account_id,
            token: token,
            game_uuid: game_uuid
        });
        seat = gameData.seat_list.indexOf(account_id);
        console.log("座位号:" + seat)
        await game.sendAsync("enterGame", {})
    })

});

let aiIns = new AIManager(new operator(game));


game.on("ActionPrototype", async (data) => {

    console.log(data);
    if (data.name === "ActionMJStart") {
        console.log("进入游戏!");
    }
    if (data.name === "ActionNewRound") {
        await aiIns.onGameStart(data.data.tiles)
    }
    if (data.name === "ActionDealTile") {
        if (data.data.seat === undefined){
            data.data.seat = 0;
        }

        if (data.data.seat === seat) {
            aiIns.onTileAdd(data.data.tile)
        }

        //处理吃碰杠
        if (data.data.operation !== null){
            if (data.data.operation.seat === seat){
                let operationList = data.data.operation.operation_list;
                if (operationList != null) {
                    await aiIns.waitOperation(data);
                }
            }
        }

    }
    if (data.name === "ActionDiscardTile") {
        if (data.data.seat === undefined){
            data.data.seat = 0;
        }

        if (data.data.seat === seat) {
            console.log("自己切牌: " + data.data.seat)
        } else {
            console.log(data.data.seat + "位切牌: " + data.data.tile)
        }

        if (data.data.operation !== null){
            if (data.data.operation.seat === seat){
                let operationList = data.data.operation.operation_list;
                if (operationList != null) {
                    await aiIns.waitOperation(data);
                }
            }
        }
    }
})


mjsoul.open(login)
