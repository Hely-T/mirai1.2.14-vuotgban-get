module.exports.config = {
    name: "chuilientuc",
    version: "1.0.0",
    hasPermssion: 1,
    credits: "HelyT",
    description: "Tag liên tục người bạn tag trong 5 lần\nCó thể gọi là gọi hồn người đó",
    commandCategory: "group",
    usages: "chuilientuc @mention",
    cooldowns: 10,
    dependencies: {
        "fs-extra": "",
        "axios": ""
    }
}

module.exports.run = async function({ api, args, Users, event}) {
    var mention = Object.keys(event.mentions)[0];
    if(!mention) return api.sendMessage("Cần phải tag 1 người bạn muốn chửi", event.threadID);
    let data = await api.getUserInfo(mention);
    let name = data[parseInt(mention)].name;
    var arraytag = [];
        arraytag.push({id: mention, tag: name});
    var a = function (a) { api.sendMessage(a, event.threadID); }
a("Bắt đầu chửi !");
setTimeout(() => {a({body: "Đ!t con mẹ mày" + " " + name, mentions: arraytag})}, 3000);
setTimeout(() => {a({body: "Mày ra đây tao bảo" + " " + name, mentions: arraytag})}, 5000);
setTimeout(() => {a({body: "Hiện hồn nhanh con chó" + " " + name, mentions: arraytag})}, 7000);
setTimeout(() => {a({body: "Hiện hồn bố mày hỏi tội" + " " + name, mentions: arraytag})}, 9000);
setTimeout(() => {a({body: "Mày trốn khi nào mới hiện hồn đây" + " " + name, mentions: arraytag})}, 12000);
setTimeout(() => {a({body: "Đ!t cụ mày nữa hiện hồn" + " " + name, mentions: arraytag})}, 15000);
setTimeout(() => {a({body: "Hiện hồn nhanh không tao đốt nhà mày giờ" + " " + name, mentions: arraytag})}, 17000);
setTimeout(() => {a({body: "Nhanh ra chửi nhau với tao" + " " + name, mentions: arraytag})}, 20000);
setTimeout(() => {a({body: "Tao ném trứng thối đổ dầu đổ xăng vào nhà mày giờ" + " " + name, mentions: arraytag})}, 23000);
setTimeout(() => {a({body: "Con cặc địt mẹ mày" + " " + name, mentions: arraytag})}, 25000);
setTimeout(() => {a({body: "Đéo ra nữa bố mày đốt nhà mày" + " " + name, mentions: arraytag})}, 28500);
setTimeout(() => {a({body: "Bố mày bắn rap chết cụ mày giờ" + " " + name, mentions: arraytag})}, 31000);
setTimeout(() => {a({body: "Mày vẫn đéo dám ra à" + " " + name, mentions: arraytag})}, 36000);
setTimeout(() => {a({body: "Vậy thì xin mời nghe tao rap địt chết cả lò mày nhà con" + " " + name, mentions: arraytag})}, 39000);
setTimeout(() => {a({body: "Trước đó cho tao xin nghỉ 1p nhé" + " " + name, mentions: arraytag})}, 40000);
setTimeout(() => {a({body: "Xin phép mở đầu thì" + " " + name, mentions: arraytag})}, 65000);
setTimeout(() => {a({body: "Đầu tiên tao xin phép địt từ trên xuống dưới con" + " " + name, mentions: arraytag})}, 70000);
setTimeout(() => {a({body: "Tao địt từ lỗ lồn đến lỗ nhị con lồn" + " " + name, mentions: arraytag})}, 75000);
setTimeout(() => {a({body: "Lồn thì to như lồn trâu thủ dâm ống cống ấy nhé con" + " " + name, mentions: arraytag})}, 80000);
setTimeout(() => {a({body: "Tao địt chắc 2 thằng như tao chưa đủ lấp cái lỗ lồn nhà mày đâu" + " " + name, mentions: arraytag})}, 85000);
setTimeout(() => {a("Tao mệt rồi đéo chửi nữa")} , 90000);
setTimeout(() => {a({body: "Nào ông chủ update lyric thì chửi tiếp nhé" + " " + name, mentions: arraytag})}, 95000);
setTimeout(() => {a({body: "Cảm ơn bạn đã nghe mình chửi nha" + " " + name, mentions: arraytag})}, 100000);
setTimeout(() => {a({body: "Xin chào và hẹn gặp lại bạn ở chương trình lần sau nha" + " " + name, mentions: arraytag})}, 105000);
setTimeout(() => {a("Chào tạm biệt 🥺")} , 110000);


  
  }