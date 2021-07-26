module.exports.config = {
	name: "ip",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "loi",
	description: "lấy thông tin vùng qua ip",
	commandCategory: "other",
	usages: "ip",
	cooldowns: 5
};
module.exports.run = async function({ api, event, args, utils }) {
const axios = require('axios');
      if (!args.join("") != " " ){
      api.sendMessage("Bạn phải ngập IP !!!", event.threadID, event.messageID);
}
	else {
	var data = (await axios.get(`http://ip-api.com/json/${args.join(" ")}`)).data;
  if (data.status == 'fail'){ 
	api.sendMessage("Ngu", event.threadID);
}   	
  else { 
 api.sendMessage({body: `=====✅${data.status}✅=====\n🌍Lục địa: \n🏷Tên vùng: ${data.regionName}\n🏴‍Quốc gia:${data.country}\n🗺️Khu vực: ${data.region}\n🏞Thành Phố: ${data.city}\n🏛Mã quốc gia: ${data.countryCode}\n⛽️Mã zip: ${data.zip}\n⏱Múi giờ: ${data.timezone}\n💵Đơn vị Tiền: ${data.currency}\n📉Kinh độ: ${data.lon}\n📈Vĩ độ: ${data.lat}\n 🔍Tên tổ chức: ${data.org}\n👀Truy vấn: ${data.query}\n` , location: {
				latitude: data.lat,
				longitude: data.lon,
				current: true
}}, event.threadID);
     }  
    } 
}
                              
