module.exports.config = {
    name: "abala trap",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "HelyT",
    description: "nhạc mà không dùng prefix :)",
    commandCategory: "Group",
    usages: "abalatrap",
    cooldowns: 5,
    denpendencies: {
        "fs": "",
        "request": ""
    }
};
module.exports.handleEvent = async ({ event, api, Currencies, Users, args, utils, global, client }) => {
const fs = require("fs");
var msg = {
    body: `Alo Alo đang ở đâu vậy!?`,
    attachment: fs.createReadStream(__dirname + `/cache/abalatrap.mp3`)
}
if (event.body.toLowerCase() == "abala trap" || (event.body.toLowerCase() == "Abala trap")) {
        return api.sendMessage(msg, event.threadID, event.messageID);
    }
}
module.exports.run = function({ api, event, args }) {
    const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
    return api.sendMessage(`Dùng sai rồi bạn 😡 \n\n[ Sử Dụng${(threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX}help lệnh để biết cách sử dụng nhé bạn! ]`,event.threadID, event.messageID);
}