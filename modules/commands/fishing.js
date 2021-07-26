module.exports.config = {
	name: "fishing",
	version: "1.0.0",
	credits: "CatalizCS",
	description: "Câu cá ngay trên chính boxchat của bạn?",
	usages: "fishing [sell/shop/upgrade/info/inventory/status/register]",
    commandCategory: "game-sp",
	cooldowns: 0,
	dependencies: {
        "fs-extra":"",
        "axios":""
    }
};

module.exports.onLoad = async () => {
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

	const dirMaterial = __dirname + `/cache/fishy/`;

	if (!fs.existsSync(dirMaterial)) fs.mkdirSync(dirMaterial, { recursive: true });
	if (!fs.existsSync(dirMaterial + "data.json")) (await axios({
			url: "https://raw.githubusercontent.com/catalizcs/storage-data/master/fishy/data.json",
			method: 'GET',
			responseType: 'stream'
		})).data.pipe(fs.createWriteStream(dirMaterial + "data.json"));
	
	if (!fs.existsSync(dirMaterial + "fonts/bold-font.ttf")) (await axios({
			url: "https://raw.githubusercontent.com/catalizcs/storage-data/master/fishy/items.json",
			method: 'GET',
			responseType: 'stream'
		})).data.pipe(fs.createWriteStream(dirMaterial + "items.json"));

	return;
}

module.exports.handleReaction = async ({ api, event, handleReaction, Currencies }) => {
    if (handleReaction.author != event.userID) return;
    try {
        switch (handleReaction.type) {
            case "upgradeSlotConfirm": {
                var userData = await Currencies.getData(event.userID),
                    money = userData.money,
                    fishy = userData.fishy;

                for (var i = 0; i < handleReaction.choose-1; i++) {
                    fishy.critters.push({
                        name: "Empty",
                        size: 0.0,
                        price: 0,
                    })
                }

                money = money - (handleReaction.choose * 2000);

                await Currencies.setData(event.userID, { money, fishy });
                return api.sendMessage(`[Fishing Shop] Bạn đã mua thành công ${handleReaction.choose} vị trí!`, event.threadID, event.messageID);
            }
            default:
                break;
        }
    }
    catch (e) {
        console.log(e);
        return api.sendMessage("[Fishing] Hiện tại không thể câu cá vì đã xảy ra lỗi hệ thống, vui lòng thử lại sau hoặc đợi thông báo!", event.threadID, event.messageID);
    }
}

module.exports.handleReply = async function({ api, event, handleReply, Currencies }) {
    if (handleReply.author != event.senderID) return;
    const { readFileSync } = require("fs-extra");
    const emptyItem = {
        name: "Empty",
        size: 0.0,
        price: 0,
    };

    var dataItems = readFileSync(__dirname + "/cache/fishy/items.json", "utf-8");
    dataItems = JSON.parse(dataItems);

    switch (handleReply.type) {
        case "shop": {
            switch (event.body) {
                case "1": {
                    var entryList = []
                        i = 1;
                    for (const item of dataItems.items) {
                        entryList.push(`${i}. ${item.name}: ${item.price} coins - Độ bền: ${item.duribility}, thời gian chờ: ${item.time} giây`);
                        i++;
                    }
            
                    return api.sendMessage(
                        "=== Fishing Shop buy) ===" +
                        "\n» Mời bạn nhập lựa chọn «\n\n" +
                        entryList.join("\n") +
                        "\n\n» Hãy reply tin nhắn và chọn theo số «"
                    , event.threadID, (error, info) => {
                        global.client.handleReply.push({
                            name: this.config.name,
                            messageID: info.messageID,
                            author: event.senderID,
                            type: "buyShop"
                        });
                    }, event.messageID);
                }
                case "2": {
                    var userData = (await Currencies.getData(event.senderID)),
                        moneyAll = 0,
                        index = 0,
                        fishy = userData.fishy;

                    for (item of fishy.critters) {
                        moneyAll += item.price;
                        fishy.critters[index] = emptyItem;
                        index++;
                    }
                    const money = userData["money"] += moneyAll;
                    await Currencies.setData(event.senderID,{ money, fishy });
                    return api.sendMessage(`[ Fishing Sell ] Tổng số tiền bạn bán được là: ${moneyAll} coins`, event.threadID, event.messageID);
                }
                case "3": {
                    const userData = (await Currencies.getData(event.senderID)).fishy;
                    return api.sendMessage(`=== Fishing Shop (Upgrade) ===\n\n[!] Hiện tại bạn đang có ${userData.critters.length += 1} vị trí có thể chứa đồ trong kho đồ của bạn\n» Để nâng cấp túi, bạn cần nhập số chỗ cần mở rộng «`, event.threadID, (error, info) => {
                        global.client.handleReply.push({
                            name: this.config.name,
                            messageID: info.messageID,
                            author: event.senderID,
                            type: "upgradeSlot"
                        })
                    })
                }
                default:
                    break;
            }
            return;
        }
        //Shop
        case "buyShop": {
            try {
                const choose = parseInt(event.body);
                var userData = (await Currencies.getData(event.senderID));
                if (isNaN(event.body)) return api.sendMessage("[Fishing Shop] Lựa chọn của bạn không phải là một con số!", event.threadID, event.messageID);
                if (choose > dataItems.length || choose < dataItems.length) return api.sendMessage("[Fishing Shop] Lựa chọn của bạn vượt quá danh sách", event.threadID, event.messageID);
                const itemUserChoose = dataItems.items[choose - 1];
                if (userData.money < itemUserChoose.price) return api.sendMessage("[Fishing Shop] Bạn không đủ tiền để có thể mua cần câu mới", event.threadID, event.messageID);
                userData["fishy"].fishingrod = itemUserChoose;
                userData.money = userData.money - itemUserChoose.price;
                await Currencies.setData(event.senderID, {money: userData.money, fishy: userData.fishy});
                return api.sendMessage(`[Fishing Shop] Bạn đã mua thành công: ${itemUserChoose.name} với giá ${itemUserChoose.price} coins!`, event.threadID, event.messageID);
            }
            catch (e) {
                console.log(e);
                return api.sendMessage("[Fishing] Hiện tại không thể mở shop vì đã xảy ra lỗi hệ thống, vui lòng thử lại sau hoặc đợi thông báo!", event.threadID, event.messageID); 
            }
        }
        //upgrade
        case "upgradeSlot": {
            try {
                const choose = parseInt(event.body);
                var userData = (await Currencies.getData(event.senderID));
                if (isNaN(event.body)) return api.sendMessage("[Fishing Shop] Lựa chọn của bạn không phải là một con số!", event.threadID, event.messageID);
                if (choose <= 0) return api.sendMessage("[Fishing Shop] Lựa chọn của bạn không phải là số âm!", event.threadID, event.messageID);
                const moneyOfUpgrade = choose * 2000;
                if (userData.money < moneyOfUpgrade) return api.sendMessage(`[Fishing Shop] Bạn không đủ tiền để có thể mua thêm chỗ cho túi đồ, bạn còn thiếu khoảng ${moneyOfUpgrade - userData.money}`, event.threadID, event.messageID);
                return api.sendMessage(`[Fishing Shop] Bạn đang cần mua ${choose} vị trí với giá ${moneyOfUpgrade} coins, nếu bạn đồng ý có thể reaction tin này!`, event.threadID, (error, info) => {
                    global.client.handleReaction.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                        choose,
                        type: "upgradeSlotConfirm"
                    })
                })
            }
            catch (e) {
                console.log(e);
                return api.sendMessage("[Fishing] Hiện tại không thể câu cá vì đã xảy ra lỗi hệ thống, vui lòng thử lại sau hoặc đợi thông báo!", event.threadID, event.messageID);
            }
        }
    
        default:
            break;
    }
}

module.exports.makeEmptyCritterList = () => {
    var fishList = [];
    for (i = 0; i < 9; i++) {
        fishList.push({
            name: "Empty",
            size: 0.0,
            price: 0,
        });
    }
    return fishList;
}

module.exports.getRarity = () => this.getRarityRecursion(Math.floor(Math.random() * Math.floor(100)), -1, 0);


module.exports.getRarityRecursion = (chance, index, number) => {
    const catchChance = {
        'Very Common': 40,
        'Common': 30,
        'Uncommon': 20,
        'Rare': 9,
        'Very Rare': 2
    }
    const rarityList = [
        'Very Common',
        'Common',
        'Uncommon',
        'Rare',
        'Very Rare'
    ]

    if (index === 0 && chance <= catchChance[rarityList[0]]) return rarityList[0]
    else if (index >= rarityList.length - 1 && chance >= catchChance[rarityList[rarityList.length - 1]]) return rarityList[rarityList.length - 1]
    else if (chance > number && chance <= (number + catchChance[rarityList[index + 1]])) return rarityList[index + 1];
    else return this.getRarityRecursion(chance, index + 1, (number + catchChance[rarityList[index + 1]]));
}

module.exports.getFish = (fishRarity, currentHour, currentMonth) => {
    const { readFileSync } = require("fs-extra");
    var dataFish = readFileSync(__dirname + "/cache/fishy/data.json", "utf-8");
    dataFish = JSON.parse(dataFish);
    var newFishData = dataFish.fish.filter(fish => fish.time.includes(currentHour) && fish.months.includes(currentMonth) && fish.rarity.includes(fishRarity));
    return newFishData;
}

module.exports.addCritter = (user, critter, api, event) => {
    if (user.critters[user.critters.length - 1].price != 0 || typeof user.critters[user.critters.length - 1].price == "undefined") api.sendMessage("[Fishing] Túi của bạn không còn đủ không gian lưu trữ!", event.threadID, event.messageID);
    else {
        for (i = 0; i < user.critters.length; i++) {
            if (user.critters[i].price === 0) {
                user.critters[i] = critter;
                i = user.critters.length;
            }
        }
    }
    return user.critters;
}

module.exports.run = async function({ api, event, args, Currencies }) {
	const emptyItem = {
        name: "None",
        price: 0,
        time: 120
    };
    var dataUser = (await Currencies.getData(event.senderID)).fishy || {};

    switch (args[0]) {
        case "register": {
            try {
                console.log(typeof dataUser);
                if (Object.entries(dataUser).length != 0) return api.sendMessage("[Fishing Register] Bạn đã từng đăng ký vào hội!", event.threadID, event.messageID);
                var fishy = {};
                fishy.fishingrod = emptyItem;
                fishy.critters = this.makeEmptyCritterList();
                await Currencies.setData(event.senderID, {fishy});
                return api.sendMessage("[Fishing Register] Bạn đã đăng ký vào hội thành công", event.threadID, event.messageID);
            }
            catch (e) {
                console.log(e);
                return api.sendMessage("[Fishing] Hiện tại không thể đăng ký vì đã xảy ra lỗi hệ thống, vui lòng thử lại sau hoặc đợi thông báo!", event.threadID, event.messageID);
            }
        }
        case "shop": {
            if (Object.entries(dataUser).length == 0)return api.sendMessage("[Fishing] Bạn cần đăng ký vào hội câu cá, hãy sử dụng 'fishing register'", event.threadID, event.messageID);
            return api.sendMessage(
                "=== Fishing Shop ===" +
                "\n» Mời bạn nhập lựa chọn «" +
                "\n\n1. Buy." +
                "\n2. Sell." +
                "\n3. upgrade." +
                "\n\n» Hãy reply tin nhắn và chọn theo số «"
            , event.threadID, (error, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "shop"
                });
            }, event.messageID);
        }
        case "inventory": {
            if (Object.entries(dataUser).length == 0)return api.sendMessage("[Fishing] Bạn cần đăng ký vào hội câu cá, hãy sử dụng 'fishing register'", event.threadID, event.messageID);
            var listCritters = [],
                msg = "",
                index = 1;
            for (const items of dataUser.critters) {
                listCritters.push({
                    name: items.name,
                    rarity: items.rarity,
                    price: items.price,
                    size: items.size
                })
            }

            listCritters.sort((a, b) => {
                if (a.size > b.size) return -1;
                if (a.size < b.size) return 1;

                if (a.price > b.price) return -1;
                if (a.price < b.price) return 1;
            })

            for (const sorted of listCritters) {
                if (index == 6 || sorted.name == "Empty") ""
                else {
                    msg += `\n${index}/ ${sorted.name}: ${sorted.size}cm - ${sorted.price} coins`;
                    index += 1;
                }
            }
            if (msg.length == 0) msg = "[!] Hiện tại inventory của bạn chưa có gì [!]";
            const filter = listCritters.filter(items => items.name !== "Empty");

            return api.sendMessage(`=== Fishing Inventory ===\n${msg}\n\n=== FishingRod Info ===\n\n» Fishing Rod Name: ${dataUser.fishingrod.name || 'Chưa có'}\n» Duribility left: ${dataUser.fishingrod.duribility} lần câu\n» Tình trạng: ${(dataUser.fishingrod.duribility == 0) ? "Đã bị gãy" : "Hoạt động tốt!"}\n\n=== Inventory Info ===\n\n» Slots: ${dataUser.critters.length += 1}\n» Tình trạng: ${((dataUser.critters.length - filter.length) == 0) ? "Túi đã đầy" : "Túi vẫn còn chỗ trống"}`, event.threadID, event.messageID);
        }
        default: {
            try {
                const format = new Intl.NumberFormat();
                if (Object.entries(dataUser).length == 0)return api.sendMessage("[Fishing] Bạn cần đăng ký vào hội câu cá, hãy sử dụng 'fishing register'", event.threadID, event.messageID);
                var dates = Math.floor((Math.abs(dataUser.time - new Date()) / 1000) / 60);
                if (dataUser.fishingrod.price === 0) return api.sendMessage("[Fishing] Bạn cần mua cần câu, hãy sử dụng 'fishing shop' để mua mới!", event.threadID, event.messageID);
                else if (dates < dataUser.fishingrod.time) return api.sendMessage("[Fishing] Bạn đang trong thời gian cooldown, hãy thử lại sau!", event.threadID, event.messageID);
                else if (dataUser.fishingrod.duribility < 1) {
                    dataUser.fishingrod = emptyItem;
                    return api.sendMessage("[Fishing] Cần câu của bạn đã bị gãy, sử dụng 'fishing shop' để mua cần câu mới!", event.threadID, event.messageID);
                }

                var fishRarity = this.getRarity();
                var currentHour = new Date().getHours();
                var currentMonth = new Date().getMonth();
                const fishData = await this.getFish(fishRarity, currentHour, currentMonth);
                if (!fishData) return api.sendMessage("[Fishing] Hiện tại trong hồ không có cá để câu", event.threadID, event.messageID);

                var caught = fishData[Math.floor(Math.random() * ((fishData.length - 1) - 0 + 1)) + 0];
                caught.size = ((Math.random() * (caught.size[0] - caught.size[1]) + caught.size[1]).toFixed(1));
                dataUser.critters = this.addCritter(dataUser, caught, api, event);
                dataUser.fishingrod.duribility--;
                dataUser.time = new Date();
                await Currencies.setData(event.senderID, {fishy: dataUser});

                return api.sendMessage(
                    "=== Bạn đã bắt được một con: " + caught.name + " ===" +
                    "\n\n» Kích cỡ: " + caught.size + "cm" +
                    "\n» Độ hiếm: " + caught.rarity +
                    "\n» Tổng số tiền có thể kiếm được: " + format.format(caught.price) + " coins" +
                    "\n» " + dataUser.time + " «"
                , event.threadID, event.messageID);
            }
            catch (e) {
                console.log(e);
                return api.sendMessage("[Fishing] Hiện tại không thể câu cá vì đã xảy ra lỗi hệ thống, vui lòng thử lại sau hoặc đợi thông báo!", event.threadID, event.messageID);
            }
        }
    }
}