const fs = require('fs');
const format = require('util').format;
const path = require('path');
const axios = require('axios');
const { exec } = require('child_process');
require("./lib/database.js")
const {getBuffer,fetchJson} = require('./lib/myfunc.js')
const {
   default: makeWASocket,
   useMultiFileAuthState,
   DisconnectReason,
   makeInMemoryStore, 
   msgRetryCounterMap,
   proto,
   downloadMediaMessage,
   downloadContentFromMessage,
   makeCacheableSignalKeyStore,
   MessageType,
   Mimetype,
   getContentType,
   generateWAMessage,
   generateWAMessageFromContent,
   generateForwardMessageContent,
   generateThumbnail,
   extractImageThumb,
   prepareWAMessageMedia,
   WAMessageProto,
   delay,
   jidDecode,
  getAggregateVotesInPollMessage
} = require("@whiskeysockets/baileys");

//-----------
const fiturauto = async(xixy,m) => {
const {messages,type} = m
//console.log(messages[0]?.message)
var botno = xixy?.user?.id.split(':')[0]
let botName = db.botconfig.botName
const pesan = messages[0].message?.conversation||messages[0].message?.extendedTextMessage?.text||messages[0]?.message?.imageMessage?.caption||messages[0]?.message?.videoMessage?.caption||messages[0]?.message?.viewOnceMessageV2?.message?.imageMessage?.caption||messages[0]?.message?.viewOnceMessageV2?.message?.videoMessage?.caption;
const id = messages[0]?.key?.remoteJid;
const fromMe = messages[0]?.key?.fromMe;
const isGroup = id?.endsWith('@g.us')||false
const isPrivatChat = id?.endsWith('@s.whatsapp.net')||false
const sender = isGroup ? messages[0]?.key?.participant : ''
const pushName = messages[0]?.pushName||"Tanpa Nama"
const isImage = messages[0]?.message?.imageMessage||messages[0]?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage||messages[0]?.message?.viewOnceMessageV2?.message?.imageMessage||messages[0]?.message?.viewOnceMessageV2?.message?.videoMessage||messages[0]?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessageV2?.message?.imageMessage||false
const isVideo = messages[0]?.message?.videoMessage||messages[0]?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage||messages[0]?.message?.viewOnceMessageV2?.message?.videoMessage||messages[0]?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessageV2?.message?.videoMessage||false
const isAudio = messages[0]?.message?.audioMessage||messages[0]?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.audioMessage||messages[0]?.message?.viewOnceMessageV2?.message?.audioMessage||messages[0]?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessageV2?.message?.audioMessage||false
const isStiker = messages[0]?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.stickerMessage||false
const isImageQuoted = messages[0]?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage||false
const isVideoQuoted = messages[0]?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage||false
const viewoncequoted = messages[0]?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessageV2?.message?.imageMessage||messages[0]?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessageV2?.message?.videoMessage
const oncetype = viewoncequoted?.mimetype?.split('/')[0]
const quotedSender = messages[0]?.message?.extendedTextMessage?.contextInfo?.participant
const mentionedJid = messages[0]?.message?.extendedTextMessage?.contextInfo?.mentionedJid
const cmd = pesan?.split(' ')[0]
const argsdat = pesan?.slice(cmd.length+1)||false
//----------Area Const V2----------
const getGroupAdmins = (participants) => {
let admins = []
for (let i of participants){
i.admin === "superadmin" ? admins.push(i.id) : i.admin === "admin" ? admins.push(i.id) : ''
  }
return admins || []
}
const groupMetadata = isGroup ? await xixy.groupMetadata(id).catch(e => {}) : ''
const groupName = isGroup ? groupMetadata.subject : ''
const participants = isGroup ? await groupMetadata.participants : ''
const groupAdmins = isGroup ? await getGroupAdmins(participants) : ''
const isBotAdmins = isGroup ? groupAdmins.includes(botno+'@s.whatsapp.net') : false
const isAdmins = isGroup ? groupAdmins.includes(sender) : false
const isOwnerBot = isGroup ? db.botconfig.owner.includes(sender) : isPrivatChat ? db.botconfig.owner.includes(id) : false
const groupOwner = isGroup ? groupMetadata.owner : ''
const authorName = db.botconfig.authorName

//Area Fungsi
//Fungsi List Member
const member = async (idgrup) => {
const groupMetadata = await xixy.groupMetadata(id).catch(e => {})
  const participants = await groupMetadata.participants||[]
  return participants
}

//Fungsi List Admin
const admin = async (idgrup) => {
const groupMetadata = await xixy.groupMetadata(id).catch(e => {})
  const participants = await groupMetadata.participants||[]
  const groupAdmins = await participants.filter(v => v.admin !== null).map(v => v.id)||[]
  return groupAdmins
}
  
//---------------------
// Function Reply
const replyv2 = async (teks,judul,target) => {
await xixy.sendMessage(target||id,
{ text: teks,
contextInfo:{
//mentionedJid:[messages[0].key.participant],
//forwardingScore: 9999999,
//isForwarded: true, 
"externalAdReply": {
"showAdAttribution": true,
"renderLargerThumbnail": true,
"title": judul||"MENU", 
"containsAutoReply": true,
"mediaType": 1, 
"thumbnail": fs.readFileSync(`./media/logogc.jpg`),
"mediaUrl": `${db.botconfig.officialgc}`,
"sourceUrl": `${db.botconfig.officialgc}` }}}) } 

const officialreply = async (teks,judul,target) => {
await xixy.sendMessage(target||id,
{ text: teks,
contextInfo:{
//mentionedJid:[messages[0].key.participant],
//forwardingScore: 9999999,
//isForwarded: true, 
"externalAdReply": {
"showAdAttribution": true,
"renderLargerThumbnail": true,
"title": judul||"MENU", 
"containsAutoReply": true,
"mediaType": 1, 
"thumbnail": fs.readFileSync(`./media/logo.jpg`),
"mediaUrl": `${db.botconfig.officialgc}`,
"sourceUrl": `${db.botconfig.officialgc}`
}}},
{ quoted: messages[0]})
}

const officialreply2 = async (teks,judul,target) => {
await xixy.sendMessage(id,
{ text: teks,
contextInfo:{
//mentionedJid:[sender],
//forwardingScore: 9999999,
//isForwarded: true, 
"externalAdReply": {
"showAdAttribution": true,
"containsAutoReply": true,
"title": judul||`${botName}`,
"previewType": "PHOTO",
"thumbnailUrl": ``,
"thumbnail": fs.readFileSync(`./media/logo.jpg`),
"sourceUrl": `${db.botconfig.officialgc}`}}},
{ quoted: messages[0]})
}

const notichat = async (text) =>{
  await xixy.relayMessage(id, { scheduledCallCreationMessage: { callType: "2", scheduledTimestampMs: 1500, title: `\n${text}\n\n`}},{ messageId: messages[0].key.id  })
}
const reply = async (teks) =>{
await xixy.sendMessage(id, {text: teks}, {quoted: messages[0]})
}

//---------------------
  const totalpengguna = async () => {
let membersize = 0
let allfetch = await xixy.groupFetchAllParticipating();
let fullgckeys = Object.keys(allfetch)

for(let gckey of fullgckeys){
var metagc = await xixy.groupMetadata(gckey)
const size = metagc.size
membersize = membersize + size
delay(3000)
}
return membersize
}

if(!isGroup){
  await xixy.readMessages([messages[0].key])
}
  
const loading = async () => {
    var hawemod = [
      "《 █▒▒▒▒▒▒▒▒▒▒▒》10%",
      "《 ████▒▒▒▒▒▒▒▒》30%",
      "《 ███████▒▒▒▒▒》50%",
      "《 ██████████▒▒》80%",
      "《 ████████████》100%",
      "𝙻𝙾𝙰𝙳𝙸𝙽𝙶 𝙲𝙾𝙼𝙿𝙻𝙴𝚃𝙴𝙳..."
    ]
    let { key } = await xixy.sendMessage(id, {text:"《 ▒▒▒▒▒▒▒▒▒▒▒▒》0%"})//Pengalih isu

    for (let i = 0; i < hawemod.length; i++) {
    await delay(1000)
    await xixy.sendMessage(id, {text: hawemod[i], edit: key });//PESAN LEPAS
    }
    }
//---------------------

let command = cmd;

switch(command) {
//------------------------------
  case ".allmenu":
  case ".menu":{
  const textnya = fs.readFileSync('./database/menu.json').toString()
  await loading()
  const menutx = `*Info Bot*\n\n*Total Pengguna : ${await totalpengguna()} User*\n\n${textnya}\n\n*Created By ${authorName} @2023*`
  officialreply(menutx)
}
    break;
//------------------------------
  //AREA OWNER
  case '.editfile':{
    if(!isOwnerBot) return reply("Fitur Ini Khusus OwnerBot");
  try{
  const pathedit = argsdat.split(" ")[0]
  const isistr = argsdat.slice(pathedit.length+1).toString()
await fs.writeFileSync(pathedit,isistr);
await xixy.sendMessage(id,{text:"File Berhasil di edit"},{quoted:messages[0]})
}catch(err){
await xixy.sendMessage(id,{text:`${err.toString()}`},{quoted:messages[0]})
} 
  }
  break ;
  case '.bacafile':{
  const txf = await fs.readFileSync(argdat).toString()
  await reply(txf)
  }
  break;
  case '.bash':{
    if(!isOwnerBot) return reply("Fitur Ini Khusus OwnerBot");
    exec(`${argsdat}`,async (error, stdout, stderr) => {
  if (error) {
    await reply(`Terjadi kesalahan:\n${error}`);
    return
  }
  if(stdout){
  await reply(`Output:\n${stdout}`);
  }
  if(stderr){
  await reply(`Error:\n${stderr}`);
  }
});
  }
  break;
  case "=>":
  case "run": {
    if(!isOwnerBot) return reply("Fitur Ini Khusus OwnerBot");
    let query = argsdat
    if (fromMe) return;
    let evaluate = false
    try {
      evaluate = await eval(query);
      try {
        evaluate = format(evaluate)
      } catch { }
    } catch (e) {
      evaluate = e.stack.toString();
    };
    await xixy.sendMessage(id, { text: format(evaluate) });
  }
  break;
  case ".restart": {
    if(!isOwnerBot) return await reply("Fitur Ini Khusus OwnerBot");
    await reply("Sedang Memulai Ulang Sistem...Memerlukan 30 deitk untuk Bot aktif kembali")
    process.exit()
  }
  break;
//------------------------------
case '.pushkontak':{
 if(!isOwnerBot)return reply("Khusus OwnerBot");
 if(!argsdat)return reply("Format salah\n\nContoh:\n*.pushkontak 1234567890@g.us|Halo Save no gw ya*")
const idgc = argsdat.split("|")[0]||id
const jpm = argsdat.slice(idgc.length+1)
await reply("Mohon tunggu sedang mengirim pesan ke semua member grup")
await xixy.groupMetadata(idgc).then(async (res)=>{
 const arrno = res.participants.map((v)=>v.id)
for(let mem of arrno){
   await xixy.sendMessage(mem,{text:jpm})
  await delay(5000)
}
  reply("Berhasil Share Pesan")
}).catch(async (err)=>{
    const infe = err.toString()
 await reply(infe)
})
}
break;
//------------------------------
case '.pushkontakv2':{
 if(!isOwnerBot)return reply("Khusus OwnerBot");
 if(!argsdat)return reply("Format salah\n\nContoh:\n*.pushkontakv2 1234567890@g.us|Halo Save no gw ya*")
const idgc = argsdat.split("|")[0]||id
const jpm = argsdat.slice(idgc.length+1)
await reply("Mohon tunggu sedang mengirim pesan ke semua member grup")
await xixy.groupMetadata(idgc).then(async (res)=>{
 const arrno = res.participants.map((v)=>v.id)
for(let mem of arrno){
   await replyv2(jpm,"Lumine Official Grup",mem)
  await delay(5000)
}
  reply("Berhasil Share Pesan")
}).catch(async (err)=>{
    const infe = err.toString()
 await reply(infe)
})
}
break;
//------------------------------
 case '.ceksemuagrup':{
 if(!isOwnerBot)return reply("Khusus OwnerBot");
let textgc = '*DAFTAR SEMUA GRUP*\n\n'
const allgc = await xixy.groupFetchAllParticipating().then(res=>Object.entries(res).slice(0).map((entry) => entry[1])).then(res2=>res2.map((v,i)=>`${i+1}.Grup:${v.subject} ID:${v.id}`).join("\n"))
textgc+=allgc
await reply(textgc)
 }
 break;
//------------------------------
case '.cekidgrup':{
 if(!isOwnerBot)return reply("Khusus OwnerBot");
 await xixy.groupMetadata(id).then(async (res)=>{
 let infres =`Nama Grup:${res.subject}\nID:${id}`
 await reply(infres)
 }).catch(async (err)=>{
    const infe = err.toString()
 await reply(infe)
})
}
 break;
//------------------------------
  default:{
}
//------------------------------
}    


//--------------------- 
}
module.exports ={fiturauto}