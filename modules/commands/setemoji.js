module.exports.config = {
    name: "anime",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "SpermLord",
    description: "Random lấy ảnh anime! (Safe For Work)",
    commandCategory: "random-img",
    usages: "anime tag",
    cooldowns: 5,
    dependencies: ['request', 'fs-extra'],
    info: [
        {
            key: "tag => Để trống",
            prompt: "Lấy danh sách các tag có",
            type: "null",
            example: ""
        },
        {
            key: "tag => tag tồn tại trong danh sách",
            prompt: "Nhập tag tồn tại để lấy ảnh đúng với chủ đề của tag!",
            type: "string",
            example: "kiss"
        }
    ],
};

module.exports.onLoad = () => {
    const { existsSync, createWriteStream } = require("fs-extra");
    const request = require('request');

    const exist = existsSync(__dirname + "/cache//canvasanime.json");
    const writeData = createWriteStream(__dirname + "/cache//canvasanime.json");
    if (!exist) return request("https://raw.githubusercontent.com/catalizcs/storage-data/master/anime/anime.json").pipe(writeData);
    else return;
};

module.exports.run = ({ event, api, args }) => {
    const { readFileSync, createReadStream, createWriteStream, unlinkSync } = require("fs-extra");
    const request = require("request");

    let animeData = JSON.parse(readFileSync(__dirname + "/cache/canvas/anime.json"));
    if (!animeData.hasOwnProperty(args[0])) {
        let list = [];
        Object.keys(animeData).forEach(endpoint => list.push(endpoint));
        return api.sendMessage(`=== Tất cả các tag của Anime ===\n${list.join(", ")}`, event.threadID, event.messageID);
    }
    else return request(animeData[args[0]], (error, response, body) => {
        let picData = JSON.parse(body);
        let URL = "";
        (!picData.data) ? URL = picData.url : URL = picData.data.response.url;
        let ext = URL.substring(URL.lastIndexOf(".") + 1);
        request(URL)
        .pipe(createWriteStream(__dirname + `/cache/canvas/anime.${ext}`))
        .on("close", () => api.sendMessage({ attachment: createReadStream(__dirname + `/cache//canvas/anime.${ext}`) }, event.threadID, () => unlinkSync(__dirname + `/cache/canvas/anime.${ext}`), event.messageID));
    });
};