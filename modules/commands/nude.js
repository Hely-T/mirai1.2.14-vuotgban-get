module.exports.config = {
	name: "nude",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "VanHung",
	description: "Xem ảnh trai",
	commandCategory: "Hình Ảnh",
	usages: "boy",
	cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
	const axios = require('axios');
	const request = require('request');
	const fs = require("fs");
	axios.get('Cặc.Tk/nude/nude-321.phpi').then(res => {
	let ext = res.data.data.substring(res.data.data.lastIndexOf(".") + 1);
	let callback = function () {
					api.sendMessage({
						body: `Ảnh khỏa thân nè mấy cha`,
						attachment: fs.createReadStream(__dirname + `/cache/boy.${ext}`)
					}, event.threadID, () => fs.unlinkSync(__dirname + `/cache/boy.${ext}`), event.messageID);
				};
				request(res.data.data).pipe(fs.createWriteStream(__dirname + `/cache/boy.${ext}`)).on("close", callback);
			})
}