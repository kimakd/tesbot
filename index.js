const fs = require('fs')
const makeWASocket = require("@whiskeysockets/baileys").default
const moment = require('moment-timezone')
const color = require('cli-color')
const qrcode = require("qrcode-terminal")
const pino = require('pino')
const { delay, useMultiFileAuthState, BufferJSON, fetchLatestBaileysVersion, PHONENUMBER_MCC, DisconnectReason, makeInMemoryStore, jidNormalizedUser, makeCacheableSignalKeyStore, downloadContentFromMessage,generateWAMessageFromContent,proto,getAggregateVotesInPollMessage } = require("@whiskeysockets/baileys")
const Pino = require("pino")
const NodeCache = require("node-cache")
const chalk = require("chalk")
const readline = require("readline")
const { parsePhoneNumber } = require("libphonenumber-js")

const pairingCode = true||process.argv.includes("--pairing-code")
const useMobile = process.argv.includes("--mobile")

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))
const store = makeInMemoryStore({
   logger: Pino().child({
      level: 'silent',
      stream: 'store'
   })
});

async function startBot() {
//--------------------------------------
let { version, isLatest } = await fetchLatestBaileysVersion()
const {  state, saveCreds } =await useMultiFileAuthState(`./sesixixy`)
const msgRetryCounterCache = new NodeCache()

const xixy = makeWASocket({
      logger: pino({ level: 'silent' }),
      printQRInTerminal: !pairingCode, 
      auth: {
         creds: state.creds,
         keys: makeCacheableSignalKeyStore(state.keys, Pino({ level: "fatal" }).child({ level: "fatal" })),
      },
      browser: ['Chrome (Linux)', '', ''],
      markOnlineOnConnect: true,
      generateHighQualityLinkPreview: true,
      getMessage: async (key) => {
         let jid = jidNormalizedUser(key.remoteJid)
         let msg = await store.loadMessage(jid, key.id)

         return msg?.message || ""
      },
      msgRetryCounterCache, // Resolve waiting messages
      defaultQueryTimeoutMs: undefined, 
   })

store?.bind(xixy.ev)
//Login dengan Kode Pairing
if (!xixy.authState.creds.registered) {
  let phoneNumber
phoneNumber = await question(chalk.bgBlack(chalk.greenBright(`Masukan Nomor WhatsApp Anda\nContoh: 6281234567890 : `)))

phoneNumber = phoneNumber.replace(/[^0-9]/g, '')

//Tanya kembali jika salah memasukan Nomer
if(!Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {

phoneNumber = await question(chalk.bgBlack(chalk.red("\nMasukan Nomor WhatsApp Anda dimulai dengan kode Negara Anda\nContoh: 6281234567890 : ")))

  if(!Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
    console.log(chalk.black(chalk.bgRed("\nKesalahan Terulang Sistem di matikan")))
    process.exit(0)
  }
phoneNumber = phoneNumber.replace(/[^0-9]/g, '')
rl.close()
}

// Tanyakan kode Pairing

setTimeout(async () => {
let code = await xixy.requestPairingCode(phoneNumber)

code = code?.match(/.{1,4}/g)?.join("-") || code

console.log(chalk.black(chalk.bgGreen(`\nKode Pairing Whatsapp Anda : `)), chalk.black(chalk.bgGreen(code)),"\n")
}, 3000)

}
//------------------------------------
async function getMessage(key){
if(store) {
const msg = await store.loadMessage(key.remoteJid, key.id)
return msg?.message || undefined
}

// only if store is present
return proto.Message.fromObject({})
}
//Manajemen Koneksi
  xixy.ev.on("connection.update",async  (koneksi) => {
  const {connection, lastDisconnect} = koneksi

  if(connection == "open"){
  console.log(chalk.black(chalk.bgGreen(`Berhasil Tersambung ke Whatsapp`)))
}

  if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401){
  startBot()
  }
  })


xixy.ev.on('creds.update', saveCreds)
xixy.ev.on("messages.upsert",  async (m) => {
  const {fiturauto} = require('./fiturauto.js');
  await fiturauto(xixy, m)
});
  
}
startBot()

process.on('uncaughtException', function (err) {
let e = String(err)
if (e.includes("Socket connection timeout")) return
if (e.includes("rate-overlimit")) return
if (e.includes("Connection Closed")) return
if (e.includes("Timed Out")) return
if (e.includes("Value not found")) return
console.log('Caught exception: ', err)
})