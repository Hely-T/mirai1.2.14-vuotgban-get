module.exports.config = {
	name: "safety-check",
	version: "1.0.0",
	credits: "CatalizCS",
	hasPermssion: 1,
	description: "Kiểm tra/báo cáo trang web bạn hoặc ai đó không an toàn!",
	commandCategory: "safety",
	usages: "safety-check args",
	dependencies: ["safe-browse-url-lookup"],
	cooldowns: 5,
	info: [
		{
			key: 'args => on/off',
			prompt: 'Bật hoặc tắt chức năng kiểm tra tự động!',
			type: 'Boolean',
			example: 'on'
		},
        {
            ket: 'args => url',
            prompt: 'Nhập trang web bạn cần kiểm tra mức độ an toàn!',
            type: 'Url',
            example: "https://github.com"
        }
	],
    envConfig: {
        APIKEY: "AIzaSyAyPQHnnLU2S6Fqy2x6eZIyFOQGe6Xwiek"
    }
};

module.exports.event = async ({ event, api, __GLOBAL, client }) => {
    let { messageID, threadID, body } = event;
    let data = client.threadSetting.get(threadID) || {};
    if (data["safety-check"] != true) return;
    const lookup = require("safe-browse-url-lookup")({ apiKey: __GLOBAL["safety-check"].APIKEY });
    const regex = /([\w+]+\:\/\/)?([\w\d-]+\.)*[\w-]+[\.\:]\w+([\/\?\=\&\#]?[\w-]+)*\/?/gm;
    let match_regex = body.match(regex) || [];
    let msg = "";
    if (typeof match_regex == "undefined" || match_regex.length == 0) return;
    lookup.checkMulti(match_regex)
    .then(urlMap => {
        for (let url in urlMap) {
            urlMap[url] ? msg += `Trang web ${url} có thể đã bị nhiễm mã độc! vui lòng cẩn thận!!\n` : msg += `Trang web ${url} an toàn!`;
        }
        return api.sendMessage(msg, threadID, messageID);
    })
    .catch(err => {
        console.log('Something went wrong.');
        console.log(err);
    });
}

module.exports.run = async ({ api, event, __GLOBAL, client, Threads, args, utils }) => {
    let settings = (await Threads.getData(event.threadID)).settings;
    switch (args[0]) {
        case "on": {
            settings["safety-check"] = true;
            await Threads.setData(event.threadID, options = { settings });
            client.threadSetting.set(event.threadID, settings);
            api.sendMessage("[ SAFETY-CHECK ] Đã bật chế độ tự động!", event.threadID, event.messageID);
            break;
        }
        case "off": {
            settings["safety-check"] = false;
            await Threads.setData(event.threadID, options = { settings });
            client.threadSetting.set(event.threadID, settings);
            api.sendMessage("[ SAFETY-CHECK ] Đã tắt chế độ tự động!", event.threadID, event.messageID);
            break;
        }
        default: {
            const lookup = require("safe-browse-url-lookup")({ apiKey: __GLOBAL["safety-check"].APIKEY });
            const regex = /([\w+]+\:\/\/)?([\w\d-]+\.)*[\w-]+[\.\:]\w+([\/\?\=\&\#]?[\w-]+)*\/?/gm;
            let match_regex = args.join(" ").match(regex) || [], msg = "";
            if (typeof match_regex == "undefined" || match_regex.length == 0) return utils.throwError("safety-check", event.threadID, event.messageID);
            //utils.throwError("safety-check", event.threadID, event.messageID);
            lookup.checkMulti(match_regex)
            .then(urlMap => {
                for (let url in urlMap) {
                    urlMap[url] ? msg += `Trang web ${url} có thể đã bị nhiễm mã độc! vui lòng cẩn thận!!\n` : msg += `Trang web ${url} an toàn!`;
                }
                return api.sendMessage(msg, event.threadID, event.messageID);
            })
            .catch(err => {
                console.log('Something went wrong.');
                console.log(err);
            });
            break;
        }
    }
}