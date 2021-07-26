const fs = require("fs");
module.exports.config = {
name: "prefix",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "VanHung",
	description: "prefix",
	commandCategory: "Other",
	usages: "noprefix",
	cooldowns: 5,
};
module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;
	if (event.body.indexOf("Prefix")==0 || (event.body.indexOf("prefix")==0)) {
		var msg = {
				body: "[ - ]",
				attachment: fs.createReadStream(__dirname + `/noprefix/Prefix.gif`)
			}
			api.sendMessage(msg, threadID, messageID);
		}
	}
	module.exports.run = function({ api, event, client, __GLOBAL }) {

}