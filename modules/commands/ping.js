module.exports.config = {
	name: "ping",
	version: "1.0.5",
	hasPermssion: 1,
	credits: "Mirai Team",
	description: "tag toàn bộ thành viên",
	commandCategory: "system",
	usages: "[Text]",
	cooldowns: 80
};

module.exports.run = async function({ api, event, args }) {
	try {
		const botID = api.getCurrentUserID();
		var listAFK, listUserID;
		global.moduleData["afk"] && global.moduleData["afk"].afkList ? listAFK = Object.keys(global.moduleData["afk"].afkList || []) : listAFK = []; 
		listUserID = event.participantIDs.filter(ID => ID != botID && ID != event.senderID);
		listUserID = listUserID.filter(item => !listAFK.includes(item));
		var body = (args.length != 0) ? args.join(" ") : "🤤😘😍Vào đây nhanh để cho bot địt cái alo🤤🖕🥴", mentions = [], index = 0;
		
		for(const idUser of listUserID) {
			body = "‎" + body;
			mentions.push({ id: idUser, tag: "‎", fromIndex: index - 1 });
			index -= 1;
		}

		return api.sendMessage({ body, mentions }, event.threadID, event.messageID);

	}
	catch (e) { return console.log(e); }
}