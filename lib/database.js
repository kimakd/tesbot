const fs = require ('fs');
const { join, dirname } = require("path");
const { fileURLToPath } = require("url");

const dirr = "./database"
const file = {
    botconfig: join(dirr, "botconfig.json")
}

try {
    fs.accessSync(file.botconfig);
} catch (err) {
    if (String(err).includes("no such file or directory")) {
        fs.writeFileSync('./database/botconfig.json', JSON.stringify({}, null, 2));
    }
}

global.db = {
    botconfig: JSON.parse(fs.readFileSync(file.botconfig))
};

if (!db.botconfig.authorName) {db.botconfig.authorName = "Iwan"}
if (!db.botconfig.isPublic) {db.botconfig.isPublic = false}
if (!db.botconfig.botName) {db.botconfig.botName = "Moera"}


setInterval(() => {
    fs.writeFileSync(file.botconfig, JSON.stringify(db.botconfig, null, 2));
}, 900);
