const { Client, Modal, version, Intents, Permissions, MessageButton, TextInputComponent, DiscordAPIError, MessageSelectMenu, MessageAttachment, MessageEmbed, MessageActionRow } = require('discord.js');
const Discord = require('discord.js');
const { resolveImage, Canvas} = require("canvas-constructor/cairo");
const Keyv = require('keyv');
const { inviteTracker } = require("discord-inviter");
const { joinVoiceChannel, entersState, VoiceConnectionStatus } = require('@discordjs/voice');
const { TextDecoder, TextEncoder, ReadableStream } = require("node:util")

Object.defineProperties(globalThis, {
  TextDecoder: { value: TextDecoder },
  TextEncoder: { value: TextEncoder },
  ReadableStream: { value: ReadableStream },
})

const { Blob, File } = require("node:buffer")
const { fetch, Headers, FormData, Request, Response } = require("undici")

Object.defineProperties(globalThis, {
  fetch: { value: fetch, writable: true },
  Blob: { value: Blob },
  File: { value: File },
  Headers: { value: Headers },
  FormData: { value: FormData },
  Request: { value: Request },
  Response: { value: Response },
})
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const moment = require('moment-timezone');
require('moment-hijri');
require("moment-duration-format");
const db = new Keyv('sqlite://./storage/database.sqlite');
const express = require('express');
const app = express();
const path = require("path");

//تعريفات ملف interactions
const { handleAddMemKikMem } = require('./interactions/handleAddMemKikMem');
const { handleMsgSendControl } = require('./interactions/handleMsgSendControl');
const { handleMsgControl } = require('./interactions/handleMsgControl');
const { handleSendMemberId } = require('./interactions/handleSendMemberId');
const { handleSendMsgEmbed } = require('./interactions/handleSendMsgEmbed');
const { handleSendMsgPost } = require('./interactions/handleSendMsgPost');
const { handleMsgDeleted } = require('./interactions/handleMsgDeleted');
const { handleAddNote } = require('./interactions/handleAddNote');
const { handleSendOwnTick } = require('./interactions/handleSendOwnTick');
const { handleClaimTicket } = require('./interactions/handleClaimTicket');
const { handleTranscript } = require('./interactions/handleTranscript');
const { handleSendMsgDisabled } = require('./interactions/handleSendMsgDisabled');
const rules = require('./rules.json');
// قائمة الملفات والدوال المستوردة


// فحص حالة كل ملف
//تعريف ملف config.json
const {
    token,
    prefix,
    categoryIDs,
    welcomeRoomId,
    welcomeLogChannelId,
    claimPermissionRoleId,
    TicketReportChannelId,
    suggestionschannel,
    ServerReportChannelId,
    sugaccptorreject,
    rulesbackground,
    rankbanner,
    levelUpChannelId,
    TicketSaveChannelId,
    logChannelId,
    accshinsug,
    selectMenuOptions,
} = require('./config.json');
//منع ظهور الاخطاء البسيطه في console log
process.on("uncaughtException" , err => {
return;
})
 
process.on("unhandledRejection" , err => {
return;
})
 
process.on("rejectionHandled", error => {
  return;
});
// يمكنك استخدام mergedConfig في الشيفرة الخاصة بك الآن
let canvax = require('canvas')
canvax.registerFont("./storage/Uni Sans Heavy.otf", { family: 'Discord' })
canvax.registerFont("./storage/DejaVuSansCondensed-Bold.ttf", { family: 'Discordx' })
const client = new Client({
intents: [
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MEMBERS,
  Intents.FLAGS.GUILD_VOICE_STATES,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  Intents.FLAGS.MESSAGE_CONTENT,
  Intents.FLAGS.GUILD_PRESENCES 
],
}); // Declare client to be a new Discord Client (bot)
require('http').createServer((req, res) => res.end(`
</> Dveloper Bot : Ahmed Clipper
</> Discord User : ahm.clipper
</> Server Support : https://dsc.gg/clipper-tv
</> Servers : ${client.guilds.cache.size}
</> Users : ${client.users.cache.size}
</> channels : ${client.channels.cache.size}
</> Name : ${client.user.username}
`)).listen(3000) //Dont remove this 


const { EventEmitter } = require('events');
EventEmitter.defaultMaxListeners = 30; // أو أي قيمة تعتقد أنها مناسبة
require("events").EventEmitter.defaultMaxListeners = 30;

client.on('ready', () => {
  console.log(``);
  console.log(`</> Logged In : ${client.user.tag}!`);
  console.log(`</> Servers : ${client.guilds.cache.size}`);
  console.log(`</> Users : ${client.users.cache.size}`);
  console.log(`</> channels : ${client.channels.cache.size}`);
  client.user.setStatus('dnd');///dnd/online/idle
  client.user.setActivity(`/help | ${prefix}help`, { type: 'WATCHING' });
});

// استيراد جميع الملفات في مجلد handlers
const handlersDir = path.join(__dirname, 'handlers');
fs.readdirSync(handlersDir).forEach(file => {
  if (file.endsWith('.js')) {
    const handler = require(path.join(handlersDir, file));
    handler(client);
  }
});


client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

// قراءة الملفات داخل المجلد "commands"
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const commands = new Map();

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);

    if (command.aliases) {
        command.aliases.forEach(alias => {
            client.aliases.set(alias, command.name);
        });
    }
}

client.on('messageCreate', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.get(client.aliases.get(commandName));

    if (!command) return;

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('هناك خطأ ما أثناء تنفيذ الأمر.');
    }
});

// قراءة الملفات داخل المجلد "slashcommand"
const slashCommandFiles = fs.readdirSync('./slashcommand').filter(file => file.endsWith('.js'));

const slashCommands = [];

for (const file of slashCommandFiles) {
    const command = require(`./slashcommand/${file}`);
    slashCommands.push(command);
}

client.once('ready', async () => {
    try {
        await client.application?.commands.set(slashCommands);
    } catch (error) {
        console.error('Error registering slash commands:', error);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = slashCommands.find(cmd => cmd.name === interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error('Error executing command:', error);
        await interaction.reply({ content: 'There was an error executing that command!', ephemeral: true });
    }
});

client.on('messageCreate', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!commands.has(commandName)) return;

    const command = commands.get(commandName);

    try {
        command.execute(message, args, client, prefix, Discord); // تمرير client و prefix و Discord إلى ملف الأمر
    } catch (error) {
        console.error(error);
        message.reply('There was an error executing this command!');
    }
});

let nextAzkarIndex = 0;

let background2 = ''; // Initialize background2 variable

client.on('messageCreate', async message => {
  if (message.content === `${prefix}rules-system`) {
    
    if (!message.member.permissions.has('ADMINISTRATOR')) {
      return message.reply("You don't have permission to use this command.");
    }
    
    if (message.member.permissions.has("ADMINISTRATOR")) {
      const row = new MessageActionRow()
        .addComponents(
          new MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('List of Laws')
            .addOptions(rules.map(rule => ({
              label: rule.title,
              value: rule.id,
            }))),
        );

      const embed = new MessageEmbed()
        .setThumbnail(message.guild.iconURL({ dynamic: true, size: 4096 }))
        .setTitle("<a:ejgif1036:1250132334502739979> Server Rules Community <a:ejgif1006:1241743608617504788>")
        .setDescription(`<a:ejgif1001:1241743492032757852> to read the laws, choose from the list below \n<a:ejgif1001:1241743492032757852> please do not violate server rules`)
        .setImage(rulesbackground);

      const sentMessage = await message.channel.send({ embeds: [embed], components: [row] });
      await message.delete();
    } else {
      await message.reply({ content: "You need to be an administrator to use this command.", ephemeral: true });
    }
  }
});




/////////////////////////////////////////////////////////////////////////////////////////////////// TIME SYSTEM

/////////////////////////////////////////////////////////////////////////////////////////////////// TIME SYSTEM




/////////////////////////////////////////////////////////////////////////////////////////////////// LEVELING SYSTEM
module.exports = {
    getUserData
    // قم بتصدير الدوال الأخرى إذا لزم الأمر
};


const xpPerMessage = 77;
const xpPerLevel = 1111;
const levelUpFilePath = './levelup.json';

function getUserData(userId) {
    try {
        const userData = JSON.parse(fs.readFileSync(levelUpFilePath, 'utf8'));
        return userData[userId];
    } catch (err) {
        console.error('Error reading file:', err);
        return null;
    }
}

async function generateLeaderboardEmbed(sortedUsers, page = 1, itemsPerPage = 8, message) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const users = sortedUsers.slice(start, end);

    const leaderboardEmbed = new MessageEmbed()
        .setColor('#302c34')
        .setTimestamp()
        .setAuthor({ name: `قائمة التصنيف الخاصة بمستوي الاعضاء 📋`, iconURL: message.guild.iconURL({ dynamic: true }) })
        .setFooter(`${message.author.tag} • صفحة ${page} من ${Math.ceil(sortedUsers.length / itemsPerPage)}`, message.author.displayAvatarURL({ dynamic: true }));

    let description = '';

    for (let index = 0; index < users.length; index++) {
        const [userId, xp] = users[index];
        const { level } = getUserLevelAndXP(xp);
        const user = client.users.cache.get(userId);
        const position = start + index + 1;

        if (user) {
            if (user.id === message.author.id) {
                description += `**#${position} 〢 ${message.author.toString()}・المستوي : \`${level}\` | نقاط الخبرة : \`${xp}\`**\n`;
            } else {
                description += `#${position} 〢 ${user.toString()}・المستوي : \`${level}\` | نقاط الخبرة : \`${xp}\`\n`;
            }
        }
    }

    leaderboardEmbed.setDescription(description);

    return leaderboardEmbed;
}



function getSortedUserData() {
    let userData = {};
    try {
        userData = JSON.parse(fs.readFileSync(levelUpFilePath, 'utf8'));
    } catch (err) {
        console.error('Error reading file:', err);
    }
    return Object.entries(userData).sort((a, b) => b[1] - a[1]);
}


function getUserLevelAndXP(userData) {
    const level = Math.floor(userData / xpPerLevel);
    const xp = userData % xpPerLevel;
    return { level, xp };
}

function getLeaderboardPosition(userId) {
    const userData = JSON.parse(fs.readFileSync(levelUpFilePath, 'utf8'));
    const userXP = userData[userId] || 0;
    let position = 1;

    for (const id in userData) {
        if (userData[id] > userXP) {
            position++;
        }
    }

    return position;
}

async function generateCanvas5(member, levelUps, leaderboardPosition, oldLevel) {
    try {
        const background = await Canvas.loadImage("image/levelback.png");
        const { weirdToNormalChars } = require('weird-to-normal-chars');
        const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ 'size': 2048, 'format': "png" }));
        const name = weirdToNormalChars(member.user.username);

        let canvas = new Canvas.createCanvas(852, 324)
            .getContext('2d')
            .drawImage(background, 0, 0, 852, 324)
            .beginPath()
            .arc(150, 160, 85, 0, Math.PI * 2, true)
            .closePath()
            .clip()
            .drawImage(avatar, 65, 75, 170, 170)
            .fillStyle = "#FFFFFF"
            .font = '18px Discord'
            .textAlign = 'center'
            .fillText(`Your Level`, 710, 110)
            .fillStyle = "#FFFFFF"
            .font = '18px Discord'
            .textAlign = 'center'
            .fillText(`Your Name`, 435, 110)
            .fillStyle = "#FFFFFF"
            .font = '20px Discordx'
            .textAlign = 'center'
            .fillText(`${name}`, 440, 170)
            .fillStyle = "#FFFFFF"
            .font = '15px Discordx'
            .textAlign = 'center'
            .fillText(`${oldLevel} > ${levelUps}・#${leaderboardPosition}`, 710, 170);

        return await canvas.toBufferAsync();
    } catch (error) {
        console.log('Error generating canvas:', error);
    }
}

client.on('guildMemberRemove', member => {
    try {
        const userData = JSON.parse(fs.readFileSync(levelUpFilePath, 'utf8'));

        if (userData[member.id]) {
            delete userData[member.id];
            fs.writeFileSync(levelUpFilePath, JSON.stringify(userData), 'utf8');
            console.log(`Removed data for user ${member.id} who left the server.`);
        }
    } catch (err) {
        console.error('Error updating file:', err);
    }
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const args = message.content.trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === `${prefix}add-xp`) {
        if (!message.member.permissions.has("ADMINISTRATOR")) {
            message.reply('You do not have permission to use this command.7');
            return;
        }

        const userId = args[0]?.replace(/\D/g, '');
        const xpAmount = parseInt(args[1]);

        if (!userId || !xpAmount || isNaN(xpAmount)) {
            message.reply('Invalid command usage. Correct usage: !add-xp [@mention or id] [xp amount]');
            return;
        }

        let userData = {};
        try {
            userData = JSON.parse(fs.readFileSync(levelUpFilePath, 'utf8'));
        } catch (err) {
            console.error('Error reading file:', err);
        }

        userData[userId] = (userData[userId] || 0) + xpAmount;

        fs.writeFileSync(levelUpFilePath, JSON.stringify(userData), 'utf8');

        message.reply(`Added ${xpAmount} XP to user with ID ${userId}.`);
        return;
    }

    if (command === `${prefix}add-level`) {
        if (!message.member.permissions.has("ADMINISTRATOR")) {
            message.reply('You do not have permission to use this command.8');
            return;
        }

        const userId = args[0]?.replace(/\D/g, '');
        const levelAmount = parseInt(args[1]);

        if (!userId || !levelAmount || isNaN(levelAmount)) {
            message.reply('Invalid command usage. Correct usage: !add-level [@mention or id] [level amount]');
            return;
        }

        let userData = {};
        try {
            userData = JSON.parse(fs.readFileSync(levelUpFilePath, 'utf8'));
        } catch (err) {
            console.error('Error reading file:', err);
        }

        userData[userId] = (userData[userId] || 0) + levelAmount * xpPerLevel;

        fs.writeFileSync(levelUpFilePath, JSON.stringify(userData), 'utf8');

        message.reply(`Added ${levelAmount} level(s) to user with ID ${userId}.`);
        return;
    }

    if (command === `${prefix}reset-level-member`) {
        if (!message.member.permissions.has("ADMINISTRATOR")) {
            message.reply('You do not have permission to use this command.9');
            return;
        }

        const userId = args[0]?.replace(/\D/g, '');

        if (!userId) {
            message.reply('Invalid command usage. Correct usage: !reset-leveling [@mention or id]');
            return;
        }

        let userData = {};
        try {
            userData = JSON.parse(fs.readFileSync(levelUpFilePath, 'utf8'));
        } catch (err) {
            console.error('Error reading file:', err);
        }

        userData[userId] = 0;

        fs.writeFileSync(levelUpFilePath, JSON.stringify(userData), 'utf8');

        message.reply(`Reset leveling for user with ID ${userId}.`);
        return;
    }

    if (command === `${prefix}xp`) {
        let targetUserId = message.author.id;

        if (message.mentions.users.size > 0) {
            targetUserId = message.mentions.users.first().id;
        } else if (args[0]) {
            targetUserId = args[0].replace(/\D/g, '');
        }

        const userData = getUserData(targetUserId);

        if (!userData) {
            message.channel.send('User not found in the leveling system.');
            return;
        }

        const { level, xp } = getUserLevelAndXP(userData);
        const leaderboardPosition = getLeaderboardPosition(targetUserId);
        const user = await client.users.fetch(targetUserId);
        const userAvatarURL = user.displayAvatarURL({ format: 'png', dynamic: true, size: 2048 });
        const username = user.username;

        const embed = new MessageEmbed()
            .setTitle('> Rank Information')
            .setThumbnail(userAvatarURL)
            .setFooter({ text: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()
            .addFields(
                { name: 'Level', value: `\`\`\`${level}\`\`\``, inline: true },
                { name: 'Rank', value: `\`\`\`#${leaderboardPosition}\`\`\``, inline: true },
                { name: 'Total XP', value: `\`\`\`${level * xpPerLevel + xp}\`\`\``, inline: true },
                { name: 'XP Point', value: `\`\`\`${xp}/${xpPerLevel}\`\`\``, inline: true },
                { name: 'Username', value: `\`\`\`${username}\`\`\``, inline: true },
                { name: 'Joined Server', value: `\`\`\`${moment(user.joinedAt).format('YYYY/MM/DD')}\`\`\``, inline: true }
            );

        message.channel.send({ embeds: [embed] });
        return;
    }

if (command === `${prefix}top`) {
    const sortedUsers = getSortedUserData();
    let page = 1;
    const itemsPerPage = 8;
    const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

    const leaderboardEmbed = await generateLeaderboardEmbed(sortedUsers, page, itemsPerPage, message);

    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('first')
                .setEmoji('⏪')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('prev')
                .setEmoji('◀️')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('home')
                .setEmoji('🏠')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('next')
                .setEmoji('▶️')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('last')
                .setEmoji('⏩')
                .setStyle('PRIMARY')
        );

    const messageEmbed = await message.reply({ embeds: [leaderboardEmbed], components: [row] });

    const filter = i => ['first', 'prev', 'home', 'next', 'last'].includes(i.customId) && i.user.id === message.author.id;
    const collector = messageEmbed.createMessageComponentCollector({ filter, time: 60000 });

    collector.on('collect', async i => {
        if (i.customId === 'first') page = 1;
        if (i.customId === 'prev' && page > 1) page--;
        if (i.customId === 'home') page = 1;
        if (i.customId === 'next' && page < totalPages) page++;
        if (i.customId === 'last') page = totalPages;

        const newEmbed = await generateLeaderboardEmbed(sortedUsers, page, itemsPerPage, message);
        await i.update({ embeds: [newEmbed], components: [row] });
    });

    collector.on('end', collected => {
        row.components.forEach(component => component.setDisabled(true));
        messageEmbed.edit({ components: [row] });
    });

    return;
}



    const authorId = message.author.id;
    const levelUpChannel = message.guild.channels.cache.get(levelUpChannelId);

    let userData = {};
    try {
        userData = JSON.parse(fs.readFileSync(levelUpFilePath, 'utf8'));
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log('Level up file does not exist, creating new file.');
            fs.writeFileSync(levelUpFilePath, JSON.stringify(userData), 'utf8');
        } else {
            console.error('Error reading file:', err);
        }
    }

    userData[authorId] = (userData[authorId] || 0) + xpPerMessage;

    const remainingXP = userData[authorId] % xpPerLevel;
    const levelUps = Math.floor(userData[authorId] / xpPerLevel);

    if (levelUps > (userData[`${authorId}_level`] || 0)) {
        const oldLevel = userData[`${authorId}_level`] || 0;
        const leaderboardPosition = getLeaderboardPosition(authorId);
        userData[`${authorId}_level`] = oldLevel + 1;
        userData[`${authorId}_level`] = levelUps;
        fs.writeFileSync(levelUpFilePath, JSON.stringify(userData), 'utf8');

        const member = message.guild.members.cache.get(authorId);
        if (member) {
            try {
                let buffer_attach = await generateCanvas5(member, levelUps, leaderboardPosition, oldLevel);
                const attachment = new MessageAttachment(buffer_attach, 'image/levelback.png');

                levelUpChannel.send({ content: `<a:ejgif1015:1241777034531831808> Congratulations <a:ejgif1016:1241777039564996640> ${member} <a:ejgif1035:1246168092438954076> You Have Now Leveled Up To <a:ejgif1034:1246101314224521248> **LEVEL ${levelUps}** <a:ejgif1034:1246101314224521248>`, files: [attachment] });
            } catch (error) {
                console.error('Error generating level up canvas:', error);
            }
        } else {
            console.error('Member not found in the guild.');
        }
    } else {
        fs.writeFileSync(levelUpFilePath, JSON.stringify(userData), 'utf8');
    }
});
/////////////////////////////////////////////////////////////////////////////////////////////////// LEVELING SYSTEM



// زيادة الحد الأقصى لعدد مستمعي الأحداث لعميل Discord
client.setMaxListeners(30); // تعيين العدد الذي ترغب فيه للحد الأقصى


client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content.toLowerCase() === `${prefix}report-system`) {
    
    if (!message.member.permissions.has('ADMINISTRATOR')) {
      return message.reply("You don't have permission to use this command.");
    }
    
    const buttonRow = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('report-server-modal')
          .setStyle('PRIMARY')
          .setLabel('📝 Send Report')
      );

    const embed = new MessageEmbed()
      .setTitle('> <a:ejgif1036:1250132334502739979> Submit A Report <a:ejgif1006:1241743608617504788>')
      .setThumbnail(message.guild.iconURL({ dynamic: true, size: 4096 }))
      .setImage("https://cdn.discordapp.com/attachments/1232668066069086248/1237501284551229511/E77wRD1KOLAfsd4tp6_standard.gif?ex=663be061&is=663a8ee1&hm=91a04116ef47ac24d61a2a8dea69fe3f2fa3c56d770a5122efe27ba470b3075a&")
      .setDescription(' **Rules Send Report** \n 1. Clearly state the violation observed. \n2. Provide relevant evidence, such as screenshots. \n3. Specify the time and location of the incident. \n4. Avoid using inflammatory language. \n5. Respect confidentiality and privacy concerns. \n6. Follow the server reporting guidelines. \n7. Await moderation team response patiently. \n8. Refrain from submitting false accusations.')
      .setColor('#2c2c34');

    message.channel.send({
      embeds: [embed],
      components: [buttonRow]
    });
  }
});
client.on('interactionCreate', async (interaction) => {
  if (interaction.isButton()) {
    if (interaction.customId === 'accept_sug') {
      // التحقق مما إذا كان لدى المستخدم الرتبة المطلوبة
      if (!interaction.member.roles.cache.has('1221887006502686720')) {
        return interaction.reply({ content: 'You do not have permission to do that.', ephemeral: true });
      }

      // تعديل الـ Embed
      const embed = interaction.message.embeds[0];
      embed.fields.find(field => field.name === 'Status').value = '✅ Accepted';
      
      // تعطيل الزر بعد الضغط عليه
      interaction.component.setDisabled(true);

      // إعادة إرسال الرسالة مع التعديلات وتحديث الزر
      await interaction.update({ embeds: [embed], components: [interaction.message.components[0]] });
    }
    if (interaction.customId === 'unaccept_sug') {
      // التحقق مما إذا كان لدى المستخدم الرتبة المطلوبة
      if (!interaction.member.roles.cache.has('1221887006502686720')) {
        return interaction.reply({ content: 'You do not have permission to do that.', ephemeral: true });
      }

      // تعديل الـ Embed
      const embed = interaction.message.embeds[0];
      embed.fields.find(field => field.name === 'Status').value = '❌ Reject';
      
      // تعطيل الزر بعد الضغط عليه
      interaction.component.setDisabled(true);

      // إعادة إرسال الرسالة مع التعديلات وتحديث الزر
      await interaction.update({ embeds: [embed], components: [interaction.message.components[0]] });
    }
    // التحقق مما إذا كان العضو قد قام بالتصويت مسبقًا

    // Check if the button is part of the voting system
    if (interaction.customId === 'report-server-modal') {
      const modal = new Modal()
        .setCustomId('report-server-modal')
        .setTitle('Send Report Message')
        .addComponents([
          new MessageActionRow().addComponents(
            new TextInputComponent()
              .setCustomId('report-server-input')
              .setLabel('Report Title')
              .setStyle('SHORT')
              .setMinLength(1)
              .setMaxLength(200)
              .setPlaceholder('Enter Report Title Here')
              .setRequired(true),
          ),
          new MessageActionRow().addComponents(
            new TextInputComponent()
              .setCustomId('2report-server-input')
              .setLabel('what Is The Report')
              .setStyle('PARAGRAPH')
              .setMinLength(1)
              .setMaxLength(4000)
              .setPlaceholder('Enter Report Here')
              .setRequired(true),
          ),
          new MessageActionRow().addComponents(
            new TextInputComponent()
              .setCustomId('3report-server-input')
              .setLabel('Image Link / Not Mandatory')
              .setStyle('SHORT')
              .setMinLength(1)
              .setMaxLength(200)
              .setPlaceholder('Enter Image Link Here')
              .setRequired(false),
          ),
        ]);

      await interaction.showModal(modal);
    }
  }

if (interaction.isModalSubmit()) {
  if (interaction.customId === 'report-server-modal') {
    const response = interaction.fields.getTextInputValue('report-server-input');
    const response2 = interaction.fields.getTextInputValue('2report-server-input');
    const response3 = interaction.fields.getTextInputValue('3report-server-input');
    const startTimestamp = Math.floor(Date.now() / 1000) - 27;
    let currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 1);
    const userId = interaction.user.id;
    const egyptianDate = new Date().toLocaleDateString('en-US', { timeZone: 'Africa/Cairo' });
    const egyptianDate2 = currentTime.toLocaleTimeString('en-EG', { timeZone: 'Africa/Cairo', hour12: true, hour: 'numeric', minute: 'numeric' });
    
    const embed2 = new MessageEmbed()
      .setColor('#2c2c34')
      .setTitle('> 📝 New Report')
      .setImage(`${response3}`)
      .setDescription(`**Report Title** \`\`\`${response}\`\`\` \n**Report Description** \`\`\`${response2}\`\`\``)
      .addFields(
          { name: 'Status', value: `⏳ Pending Review`, inline: true },
          { name: 'Report Since', value: `┕<t:${startTimestamp}:R>`, inline: true },
          { name: 'Report By', value: `<@${userId}>`, inline: true },
          { name: 'Report Data', value: `\`\`\`${egyptianDate2},${egyptianDate}\`\`\``, inline: true }
      );
    
    const accept_sug = new MessageButton()
        .setCustomId('accept_sug')
        .setLabel('Aceept')
        .setStyle('SUCCESS')

    const unaccept_sug = new MessageButton()
        .setCustomId('unaccept_sug')
        .setLabel('Reject')
        .setStyle('DANGER');
    
    const row1 = new MessageActionRow()
    .addComponents(accept_sug, unaccept_sug);

    // إرسال رسالة بصيغة Embed
    const embed = new MessageEmbed()
      .setColor('#2c2c34')
      .setTitle('> Your notification has been successfully sent to the administrators \n> Your report is being reviewed')

    interaction.reply({ embeds: [embed], ephemeral: true })
      .then(() => {
        // إرسال رسالة إلى القناة المحددة بصيغة Embed
        const channel = interaction.client.channels.cache.get(ServerReportChannelId);
        if (channel && channel.isText()) {
          channel.send({ embeds: [embed2], components: [row1] });
        } else {
          console.error('لا يمكن العثور على القناة أو القناة غير صالحة.');
        }
      })
      .catch(error => console.error('حدث خطأ في الرد:', error));
  }
}
});

client.on('messageCreate', async message => {
    // تأكد من أن الرسالة ليست من البوت
    if (message.author.bot) return;

    // تحقق مما إذا كان اسم البوت تم ذكره بشكل صحيح
    const botMentioned = message.mentions.users.has(client.user.id);

    if (botMentioned) {
        // إضافة السطر التالي لبدء الرمز "الكتابة"
        await message.channel.sendTyping();

        const embed = new MessageEmbed()
            .setColor('#2c2c34')
            .setTitle(`My commands : \`${prefix}help\` or </help:1239056012434997341>`)

        // إرسال الـ embed إلى الشخص الذي قام بمنشن البوت
        message.reply({ embeds: [embed] });
    }
});




//testing code modal
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content.toLowerCase() === `${prefix}suggestions-system`) {
    
    if (!message.member.permissions.has('ADMINISTRATOR')) {
      return message.reply("You don't have permission to use this command.");
    }
    
    const buttonRow = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('suggestions-modal')
          .setStyle('PRIMARY')
          .setLabel('🤝 إرسال اقتراح أو ملاحظة')
      );

    const embed = new MessageEmbed()
      .setTitle('> قوانين إرسال الاقتراحات و الملاحظات')
      .setDescription(" - الاقتراحات والملاحظات يجب أن تكون موجهة بإحترام ووضوح، دون تجاوز الحدود.\n2. تجنب إرسال المحتوى الغير لائق أو المسيء أو المحتوى الذي ينتهك سياسات الخادم.\n3. يجب أن يتضمن كل اقتراح أو ملاحظة توضيحاً موجزاً للفكرة والهدف منه.\n4. تجنب إرسال الاقتراحات أو الملاحظات المكررة، يُفضل البحث عن محتوى مشابه قبل الإرسال.\n5. يجب الامتناع عن إرسال الرسائل الضارة أو التي تحتوي على فيروسات أو روابط مشبوهة.\n6. تجنب إرسال الاقتراحات أو الملاحظات التي لا تتعلق بموضوع الخادم أو القناة.\n7. تحديد عنوان واضح ومناسب لكل اقتراح أو ملاحظة يُرسل، لتسهيل تصنيفه ومتابعته.\n8. الامتناع عن استخدام اللغة البذيئة أو الإساءة اللفظية في الاقتراحات والملاحظات.\n9. يجب أن يكون الاقتراح أو الملاحظة مفهوماً وواضحاً للجميع دون الحاجة لتفسير إضافي.\n10. تجنب إرسال الرسائل الطويلة جداً، واختصار الفكرة في أطر موجزة ومفيدة.\n11. يُشجع على تقديم الاقتراحات التي تتماشى مع هدف الخادم ومبادئه الأساسية.\n12. الامتناع عن إرسال الاقتراحات أو الملاحظات العنيفة أو الهجومية.\n13. توجيه المقترحات للقنوات المناسبة وتجنب الإزعاج غير الضروري للأعضاء الآخرين.\n14. الإدارة تحتفظ بحقها في تعديل أو حذف أو تجاهل المقترحات غير متوافقة مع القوانين والتوجيهات.")
      .setColor('#2c2c34');

    message.channel.send({
      embeds: [embed],
      components: [buttonRow]
    });
  }
});

const votedMembersPerMessage = new Map();
const votedMembers = new Set();
const reportedMembersPerMessage = new Map();
const reportedMembers = new Set();
let votedEmbedIds = new Set();
client.on('interactionCreate', async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === 'accept_sug22') {
            // Check if the user has the required role or admin permissions
            const requiredRoles = ['1221886968019812443'];
            const isAdmin = interaction.member.permissions.has('ADMINISTRATOR');
            const hasRequiredRole = requiredRoles.some(roleId => interaction.member.roles.cache.has(roleId));

            if (!isAdmin && !hasRequiredRole) {
                return interaction.reply({ content: 'You do not have permission to perform this action.', ephemeral: true });
            }

            // Modify the Embed
            const memberMention = interaction.member.toString();
            const embed = interaction.message.embeds[0];
            const statusField = embed.fields.find(field => field.name.includes('الحالة'));
            if (statusField) {
              statusField.name = `الحالة | ✅`;
              statusField.value = `${memberMention}`;
            }

            // Disable the button after clicking it
            interaction.component.setDisabled(true);

            // Resend the message with the modifications and update the button
            await interaction.update({ embeds: [embed], components: [interaction.message.components[0]] });

            // Send a message to the log channel
            const suggestionChannel = interaction.guild.channels.cache.get(sugaccptorreject);
            if (suggestionChannel) {
                const suggestedBy = interaction.user;
                const sourceMessage = interaction.message;
                let currentTime = new Date();
                currentTime.setHours(currentTime.getHours() + 1);
                const startTimestamp = Math.floor(Date.now() / 1000) - 32;
                const egyptianDate = new Date().toLocaleDateString('en-US', { timeZone: 'Africa/Cairo' });
                const egyptianDate2 = currentTime.toLocaleTimeString('en-EG', { timeZone: 'Africa/Cairo', hour12: true, hour: 'numeric', minute: 'numeric' });
                const acceptEmbed = new Discord.MessageEmbed()
                    .setColor('#00FF00') // Green color
                    .setTitle(`> تم قبول هذا الاقتراح`)
                    .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 4096 }))
                    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                    .addFields(
                        { name: `\u2003`, value: `\u2003`, inline: false },
                        { name: 'تم قبول الاقتراح بواسطة', value: `┕${suggestedBy}`, inline: true },
                        { name: 'تاريخ قبول الاقتراح', value: `┕\`${egyptianDate2},${egyptianDate}\``, inline: true },
                        { name: `\u2003`, value: `\u2003`, inline: false },
                        { name: 'الوقت المنقضي منذ', value: `┕<t:${startTimestamp}:R>`, inline: true },
                        { name: 'الاقتراح المقبول', value: `[رابط الاقتراح](${sourceMessage.url})┕`, inline: true },
                    );


                suggestionChannel.send({ embeds: [acceptEmbed] });
            }
        }
    if (interaction.customId === 'unaccept_sug22') {
    // Checking if the user has the required role
    const requiredRoles = ['1221886968019812443'];
    const isAdmin = interaction.member.permissions.has('ADMINISTRATOR');
    const hasRequiredRole = requiredRoles.some(roleId => interaction.member.roles.cache.has(roleId));

    if (!isAdmin && !hasRequiredRole) {
        return interaction.reply({ content: "Sorry, you don't have permission to perform this action.", ephemeral: true });
    }

    // Modifying the Embed
    const memberMention = interaction.member.toString();
    const embed = interaction.message.embeds[0];
    const statusField = embed.fields.find(field => field.name.includes('الحالة'));
     if (statusField) {
       statusField.name = `الحالة | ❌`;
       statusField.value = `${memberMention}`;
     }

    // Disabling the button after it's been clicked
    interaction.component.setDisabled(true);

    // Resending the message with the modifications and updating the button
    await interaction.update({ embeds: [embed], components: [interaction.message.components[0]] });

    // Sending a message to the log channel
    const suggestionChannel = interaction.guild.channels.cache.get(sugaccptorreject);
    if (suggestionChannel) {
        const suggestedBy = interaction.user;
        const sourceMessage = interaction.message;
        let currentTime = new Date();
        currentTime.setHours(currentTime.getHours() + 1);
        const startTimestamp = Math.floor(Date.now() / 1000) - 32;
        const egyptianDate = new Date().toLocaleDateString('en-US', { timeZone: 'Africa/Cairo' });
        const egyptianDate2 = currentTime.toLocaleTimeString('en-EG', { timeZone: 'Africa/Cairo', hour12: true, hour: 'numeric', minute: 'numeric' });
        const unacceptEmbed = new Discord.MessageEmbed()
             .setColor('#FF0000') // Red color
             .setTitle(`> تم رفض هذا الاقتراح`)
             .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 4096 }))
             .setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }))
             .addFields(
                 { name: `\u2003`, value: `\u2003`, inline: false },
                 { name: 'تم رفض الاقتراح بواسطة', value: `┕${suggestedBy}`, inline: true },
                 { name: 'تاريخ رفض الاقتراح', value: `┕\`${egyptianDate2},${egyptianDate}\``, inline: true },
                 { name: `\u2003`, value: `\u2003`, inline: false },
                 { name: 'الوقت المنقضي منذ العملية', value: `┕<t:${startTimestamp}:R>`, inline: true },
                 { name: 'الاقتراح المرفوض', value: `[رابط الاقتراح](${sourceMessage.url})┕`, inline: true },
             );



        suggestionChannel.send({ embeds: [unacceptEmbed] });
    }
}


      
      

      // التحقق مما إذا كان العضو قد قام بالتصويت مسبقًا

      // Check if the button is part of the voting system    
if (interaction.customId === 'like_sug' || interaction.customId === 'dis_sug') {
        // تحقق مما إذا كانت الرسالة موجودة في الخريطة
        if (!votedMembersPerMessage.has(interaction.message.id)) {
          // إذا لم تكن موجودة، قم بإضافة مفتاح الرسالة مع مجموعة جديدة لتتبع الأعضاء الذين قاموا بالتصويت
          votedMembersPerMessage.set(interaction.message.id, new Set());
        }

        // استخدم مجموعة الأعضاء المحددة للرسالة الحالية
        const votedMembers = votedMembersPerMessage.get(interaction.message.id);

        // التحقق مما إذا كان العضو قد قام بالتصويت مسبقًا
        if (votedMembers.has(interaction.user.id)) {
          return interaction.reply({ content: 'لقد صوت بالفعل.', ephemeral: true });
        } else {
          // إذا لم يكن قد قام بالتصويت، قم بإضافة معرف العضو إلى مجموعة الأعضاء المصوتين
          votedMembers.add(interaction.user.id);
        }
      }
if (interaction.customId === 'like_sug') {
    const embed = interaction.message.embeds[0];
    const voteField = embed.fields.find(field => field.name === 'جيد');
    const currentLikes = parseInt(voteField.value.split(' ')[1]);
    voteField.value = `┕\`👍 ${currentLikes + 1}\``; // Update the number of likes only

    // Add the member to the list of those who voted
    const votedMember = interaction.user.id;
    let currentTime = new Date();
    const sourceMessage = interaction.message;
    currentTime.setHours(currentTime.getHours() + 1);
    const startTimestamp = Math.floor(Date.now() / 1000) - 32;
    const egyptianDate = new Date().toLocaleDateString('en-US', { timeZone: 'Africa/Cairo' });
    const egyptianDate2 = currentTime.toLocaleTimeString('en-EG', { timeZone: 'Africa/Cairo', hour12: true, hour: 'numeric', minute: 'numeric' });
    const logEmbed = new MessageEmbed()
    .setColor('#00FF00') // لون أخضر
    .setAuthor({ name: `تم التفاعل مع هذا الاقتراح`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
    .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 4096 }))
    .setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
    .addFields(
        { name: `\u2003`, value: `\u2003`, inline: false },
        { name: 'تم التفاعل بواسطة', value: `<@${votedMember}>`, inline: true },
        { name: 'تاريخ التفاعل', value: `<t:${Math.floor(startTimestamp / 1000)}:R>`, inline: true },
        { name: `\u2003`, value: `\u2003`, inline: false },
        { name: `\u2003`, value: `\`\`\`diff\n+👍 ${currentLikes + 1} تفاعلات حالية\`\`\``, inline: false },
        { name: `\u2003`, value: `\u2003`, inline: false },
        { name: 'منذ التفاعل', value: `<t:${startTimestamp}:R>`, inline: true },
        { name: 'مصدر التفاعل', value: `[رابط الاقتراح](${sourceMessage.url})`, inline: true },
    );


    // Send the log to the specified channel
    const logChannel = interaction.guild.channels.cache.get(accshinsug);
    if (logChannel) {
        await logChannel.send({ embeds: [logEmbed] });
    } else {
        console.log('Unable to find log channel.');
    }

    await interaction.update({ embeds: [embed] });
}
if (interaction.customId === 'dis_sug') {
    const embed = interaction.message.embeds[0];
    const voteField = embed.fields.find(field => field.name === 'سيئ');
    const currentDislikes = parseInt(voteField.value.split(' ')[1]);
    voteField.value = `┕\`👎 ${currentDislikes + 1}\``; // Update the number of dislikes only

    // Add the member to the list of those who voted
    const votedMember = interaction.user.tag;
    let currentTime = new Date();
    const sourceMessage = interaction.message;
    currentTime.setHours(currentTime.getHours() + 1);
    const startTimestamp = Math.floor(Date.now() / 1000) - 32;
    const egyptianDate = new Date().toLocaleDateString('en-US', { timeZone: 'Africa/Cairo' });
    const egyptianDate2 = currentTime.toLocaleTimeString('en-EG', { timeZone: 'Africa/Cairo', hour12: true, hour: 'numeric', minute: 'numeric' });
    const logEmbed = new MessageEmbed()
        .setColor('#FF0000') // لون أحمر
        .setAuthor({ name: `تم التفاعل مع هذا الاقتراح`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 4096 }))
        .setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .addFields(
            { name: `\u2003`, value: `\u2003`, inline: false },
            { name: 'تم التفاعل بواسطة', value: `${votedMember}`, inline: true },
            { name: 'تاريخ التفاعل', value: `\`${egyptianDate2},${egyptianDate}\``, inline: true },
            { name: `\u2003`, value: `\u2003`, inline: false },
            { name: `\u2003`, value: `\`\`\`diff\n-👎 ${currentDislikes + 1} تفاعلات حالية\`\`\``, inline: false },
            { name: `\u2003`, value: `\u2003`, inline: false },
            { name: 'منذ التفاعل', value: `<t:${startTimestamp}:R>`, inline: true },
            { name: 'مصدر التفاعل', value: `[رابط الاقتراح](${sourceMessage.url})`, inline: true },
        );


    // Send the log to the specified channel
    const logChannel = interaction.guild.channels.cache.get(accshinsug);
    if (logChannel) {
        await logChannel.send({ embeds: [logEmbed] });
    } else {
        console.log('Unable to find log channel.');
    }

    await interaction.update({ embeds: [embed] });
}
if (interaction.customId === 'suggestions-modal') {
    const modal = new Modal()
        .setCustomId('suggestions-modal')
        .setTitle('إرسال اقتراح أو ملاحظه')
        .addComponents([
            new MessageActionRow().addComponents(
                new TextInputComponent()
                    .setCustomId('suggestions-input')
                    .setLabel('ما هو عنوان اقتراحك؟')
                    .setStyle('SHORT')
                    .setMinLength(1)
                    .setMaxLength(200)
                    .setPlaceholder('اكتب عنوان اقتراحك هنا')
                    .setRequired(true),
            ),
            new MessageActionRow().addComponents(
                new TextInputComponent()
                    .setCustomId('2suggestions-input')
                    .setLabel('ما هي فكرة الاقتراح؟')
                    .setStyle('PARAGRAPH')
                    .setMinLength(1)
                    .setMaxLength(4000)
                    .setPlaceholder('اكتب فكرة اقتراحك هنا')
                    .setRequired(true),
            ),
        ]);

    await interaction.showModal(modal);
}

}
if (interaction.isModalSubmit()) {
    if (interaction.customId === 'suggestions-modal') {
        const response = interaction.fields.getTextInputValue('suggestions-input');
        const response2 = interaction.fields.getTextInputValue('2suggestions-input');
        const startTimestamp = Math.floor(Date.now() / 1000) - 32;
        let currentTime = new Date();
        currentTime.setHours(currentTime.getHours() + 1);
        const userId = interaction.user.id;
        const egyptianDate = new Date().toLocaleDateString('en-US', { timeZone: 'Africa/Cairo' });
        const egyptianDate2 = currentTime.toLocaleTimeString('en-EG', { timeZone: 'Africa/Cairo', hour12: true, hour: 'numeric', minute: 'numeric' });

        const embed2 = new MessageEmbed()
            .setColor('#2c2c34')
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTitle('> 📝 اقتراح جديد')
            .setDescription(`**عنوان الاقتراح** \`\`\`${response}\`\`\` \n**فكرة الاقتراح** \`\`\`${response2}\`\`\``)
            .addFields(
                { name: 'الحالة', value: `⏳ قيد المراجعة`, inline: true },
                { name: 'تاريخ تقديم الاقتراح', value: `┕\`${egyptianDate2},${egyptianDate}\``, inline: true },
                { name: 'المقترح تقديمه من قبل', value: `<@${userId}>`, inline: true },
                { name: 'مدة الاقتراح', value: `┕<t:${startTimestamp}:R>`, inline: true },
                { name: 'جيد', value: `┕\`👍 0\``, inline: true },
                { name: 'سيئ', value: `┕\`👎 0\``, inline: true }
            );

        const accept_sug = new MessageButton()
            .setCustomId('accept_sug22')
            .setLabel('قبول')
            .setStyle('SUCCESS');

        const unaccept_sug = new MessageButton()
            .setCustomId('unaccept_sug22')
            .setLabel('رفض')
            .setStyle('DANGER');

        const like = new MessageButton()
            .setCustomId('like_sug')
            .setLabel('👍')
            .setStyle('PRIMARY');

        const unlike = new MessageButton()
            .setCustomId('dis_sug')
            .setLabel('👎')
            .setStyle('SECONDARY');

        const report_sug = new MessageButton()
            .setCustomId('report-modal22')
            .setLabel('الإبلاغ عن الاقتراح')
            .setStyle('DANGER');

        const row1 = new MessageActionRow()
            .addComponents(accept_sug, unaccept_sug, like, unlike, report_sug);

        // إرسال رسالة في شكل Embed
        const embed = new MessageEmbed()
            .setColor('#2c2c34')
            .setTitle('> تم إرسال الاقتراح')
            .setDescription(`تم إرسال اقتراحك هنا <#${suggestionschannel}>`)

        interaction.reply({ embeds: [embed], ephemeral: true })
            .then(() => {
                // إرسال رسالة إلى القناة المحددة في شكل Embed
                const channel = interaction.client.channels.cache.get(suggestionschannel);
                if (channel && channel.isText()) {
                    channel.send({ embeds: [embed2], components: [row1] });
                } else {
                    console.error('تعذر العثور على القناة أو القناة غير صالحة.');
                }
            })
            .catch(error => console.error('حدث خطأ أثناء الرد:', error));
    }
}


});







//rename ticket
client.on('interactionCreate', async (interaction) => {
  try {
    if (interaction.isButton()) {
      if (interaction.customId === 'rename-ticket-button') {
        // التحقق من إذن التعديل
        if (!hasClaimPermission(interaction.member)) {
          await interaction.reply({ content: 'ليس لديك الصلاحية لأداء هذا الإجراء', ephemeral: true });
          return;
        }

        // إنشاء وعرض نافذة الإدخال المودالية
        const modal = new Modal()
          .setCustomId('rename-ticket-modal')
          .setTitle('إعادة تسمية التذكرة')
          .addComponents([
            new MessageActionRow().addComponents(
              new TextInputComponent()
                .setCustomId('rename-ticket-input')
                .setLabel('أدخل اسم التذكرة الجديد')
                .setStyle('SHORT')
                .setMinLength(1)
                .setMaxLength(15)
                .setPlaceholder('أدخل الاسم هنا')
                .setRequired(true),
            ),
          ]);

        await interaction.showModal(modal);
      }
    }

    if (interaction.isModalSubmit()) {
      if (interaction.customId === 'rename-ticket-modal') {
        const response = interaction.fields.getTextInputValue('rename-ticket-input');

        if (interaction.member.permissions.has('MANAGE_CHANNELS')) {
          // الحصول على اسم التذكرة السابق
          const oldTicketName = interaction.channel.name;

          // تغيير اسم القناة
          await interaction.channel.setName(response);

          // تعطيل الزر بعد تغيير الاسم
          const updatedComponents = interaction.message.components.map(row => {
            const updatedRow = new MessageActionRow();
            row.components.forEach(comp => {
              if (comp.customId === 'rename-ticket-button') {
                updatedRow.addComponents(comp.setDisabled(true));
              } else {
                updatedRow.addComponents(comp);
              }
            });
            return updatedRow;
          });

          // تحديث الرسالة الأصلية بالزر المعطل
          await interaction.message.edit({ components: updatedComponents });

          // إنشاء وإرسال Embed بشكل خاص
          const embed = new MessageEmbed()
            .setColor('#2c2c34')
            .setTitle('> تم تغيير اسم التذكرة بنجاح')
            .addFields(
              { name: 'الاسم القديم للتذكرة', value: `\`\`\`diff\n- ${oldTicketName}\`\`\``, inline: true },
              { name: 'الاسم الجديد للتذكرة', value: `\`\`\`diff\n+ ${response}\`\`\``, inline: true }
            );

          await interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
          await interaction.reply({ content: "لا أملك الصلاحية لإعادة تسمية القنوات!", ephemeral: true });
        }
      }
    }
  } catch (error) {
    console.error('حدث خطأ:', error);
    await interaction.reply({ content: 'حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى لاحقًا.', ephemeral: true });
  }
});






let ticketOpenerId;
const ticketsFilePath = path.join(__dirname, 'ticket-date.json');

client.on('messageCreate', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'ticket-panel') {
        const ticketOpenerId = message.author.id;

const selectMenuOptions = [
    {
        label: '📌 لجنة الرقابة',
        value: 'ticket_1',
        description: '📜 قسم للإبلاغ عن مخالفات',
        emoji: '🕵️'
    },
    {
        label: '📌 طلب عقوبة إدارية',
        value: 'ticket_2',
        description: '📜 طلب طرد أو عقوبة للمستخدم',
        emoji: '⚖️'
    },
    {
        label: '📌 بلاغ ضد مخرب',
        value: 'ticket_3',
        description: '📜 الإبلاغ عن سلوك مخرب',
        emoji: '🛡️'
    },
    {
        label: '📌 بلاغ عن مشكلة تقنية',
        value: 'ticket_4',
        description: '📜 الإبلاغ عن مشكلة تقنية',
        emoji: '💻'
    },
    {
        label: '📌 طلب تعويض',
        value: 'ticket_5',
        description: '📜 طلب تعويض عن خسارة',
        emoji: '💰'
    },
    {
        label: '📌 تقديم لاعب معتمد',
        value: 'ticket_6',
        description: '📜 تقديم طلب لاعب معتمد  ',
        emoji: '✅'
    },
    {
        label: '📌 تقديم صانع محتوى',
        value: 'ticket_7',
        description: '📜 تقديم طلب صانع محتوى',
        emoji: '🎥'
    },
    {
        label: '📌 المواقع',
        value: 'ticket_8',
        description: '📜 للإبلاغ عن مشكلة او الشراء من الموقع',
        emoji: '🌐'
    },
    {
        label: '📌 وزارة الداخلية',
        value: 'ticket_9',
        description: '📜 قسم وزارة الداخلية',
        emoji: '🏛️'
    },
    {
        label: '📌 وزارة الصحة والسكان',
        value: 'ticket_10',
        description: '📜 قسم الصحة والسكان',
        emoji: '⚕️'
    },
    {
        label: '📌 وزارة الدفاع',
        value: 'ticket_11',
        description: '📜 قسم الدفاع والأمان',
        emoji: '🛡️'
    },
    {
        label: '📌 شركة السحب والصيانة',
        value: 'ticket_12',
        description: '📜 قسم السحب والصيانه',
        emoji: '🔧'
    }
];

        const selectMenu = new MessageSelectMenu()
            .setCustomId('ticket_panel')
            .setPlaceholder('🎫 يرجى اختيار القسم الذي تريده')
            .addOptions(selectMenuOptions);

        const row = new MessageActionRow().addComponents(selectMenu);

        const embed = new MessageEmbed()
            .setColor("#2c2c34")
            .setTitle('> THE 4 SEASON | TICKET ')
            .setDescription(` - **شروط وتعليمات التذكرة**\n1. اختر نوع التذكرة المناسب لموضوعك\n2. اتبع الإرشادات واكمل المتطلبات المذكورة في التذكرة\n3. لا تفتح تذكرة جديدة بنفس الموضوع إذا تم إغلاق التذكرة، ستصلك نسخة من الرد على طلبك على الخاص \n4. تغلق التذكرة إذا تم الرد على موضوعك أو إذا تبين عدم اختصاص التذكرة بموضوعك \n5. يتم إغلاق التذكرة بعد مرور 30 دقيقة من آخر رد \n6. ممنوع فتح مواضيع جانبية أو طلب مستلم التذكرة بروم صوتي أو بموضوع خارج اختصاص التذكرة \n7. ممنوع طلب شخص محدد لاستلام التذكرة \n8. في حالة مخالفة شروط التذكرة، ستتم إغلاق الطلب وإعطاء رول مخالف لشروط التذكرة لفترة مؤقتة \n9. إذا كان موضوعك يتعلق بالبان، فقد يتم إحالة التذكرة إلى تظلم من البان خطأ. تطبق \n10. لا يمكن طلب شخص محدد للرد عليك في التذكرة \n11. يجب أن يكون طلبك مكتوبًا في التذكرة، ولن يتم الرد على طلبات في الصورة أو مقطع صوتي أو مقطع فيديو \n12. يعاقب التعديل أو التزوير في الأدلة أو الحلف كذبًا في التذكرة بتصفير حساب اللاعب وحظره نهائي \n13. لا يمكن الاعتراض أو الاستفسار بسبب إجراءات المراقب البسيطة مثل الإنذار (التنبيه) وسحب التأشيرة إلخ \n14. نشكرك على حسن التفهم ونسعى لتقديم الدعم عن طريق التذكرة لأفضل خدمة`);

        message.channel.send({ embeds: [embed], components: [row] });
    }
});



// Counter for ticket numbers
let ticketCounter = 1;
const userTickets = new Map();

// Define a set to store roles with permission to claim
const claimPermissions = new Set();

// Function to check if a member has permission to claim
function hasClaimPermission(member) {
    return member.roles.cache.some(role => claimPermissions.has(role.id));
}

module.exports = {
  hasClaimPermission,
};

// Add roles with permission to claim
claimPermissions.add('1184800280198533131');
claimPermissions.add('1218349464817897533');
claimPermissions.add('1223814666958934096');
claimPermissions.add('1223814667638407299');
claimPermissions.add('1224346531310604399');
claimPermissions.add('1224349559006826616');
claimPermissions.add('1224346550080241817');
claimPermissions.add('1224349445781586112');
claimPermissions.add('1223814666543697971');
claimPermissions.add('1223814665356705823');
claimPermissions.add('1218325891361538201');
claimPermissions.add('1218333911839543316');
claimPermissions.add('1218613841785782413');
claimPermissions.add('1184800280198533131');


// Add more roles as needed



// Map to store user ticket count
client.on('interactionCreate', async interaction => {
    if (!interaction.isSelectMenu() && !interaction.isButton()) return;

    const { member, guild } = interaction;

   // استدعاء الدالة المناسبة بناءً على customId
    switch (interaction.customId) {
        case 'msg_control':
            await handleMsgControl(interaction, hasClaimPermission);
            break;
        case 'addmem_kikmem':
            await handleAddMemKikMem(interaction, hasClaimPermission);
            break;
        case 'msg_sendcontrol':
            await handleMsgSendControl(interaction, hasClaimPermission);
            break;
        case 'sendmemberid':
            await handleSendMemberId(interaction, hasClaimPermission);
            break;
        case 'sendmsgembed':
            await handleSendMsgEmbed(interaction, hasClaimPermission);
            break;
        case 'sendmsgdisabled':
            await handleSendMsgDisabled(interaction, hasClaimPermission);
            break;
        case 'sendmsgpost':
            await handleSendMsgPost(interaction, hasClaimPermission); // استدعاء دالة لإرسال رسالة عادية
            break;
        case 'msgdeleted':
            await handleMsgDeleted(interaction, hasClaimPermission);
            break;
        case 'add_note':
            await handleAddNote(interaction, hasClaimPermission); // تأكد من تمرير دالة التحقق من الصلاحية هنا
            break;
        case 'sendowntick':
            await handleSendOwnTick(interaction, hasClaimPermission); // Call the function for handling sendowntick interaction
            break;
        case 'claim_ticket':
            await handleClaimTicket(interaction, hasClaimPermission);
            break;
        case 'transscript':
            await handleTranscript(interaction, guild); // قم بتمرير ال guild الخاص بك هنا
            break;
    }
  


// دالة لإرسال رسالة بـ Embed
async function sendEmbedMessage(interaction, content) {
    // إنشاء الـ Embed بناءً على النص المستلم
    const embed = {
        description: content,
        color: "#2c2c34", // يمكنك تعيين اللون كما تشاء
    };
    await interaction.channel.send({ embeds: [embed] });
}

// دالة لإرسال رسالة عادية
async function sendMessage(interaction, content) {
    await interaction.followUp({ content: content, ephemeral: true });
}


// التحقق من الضغط على زر "cancel_close"
if (interaction.customId === 'cancel_close') {
    // حذف الرسالة
    await interaction.deleteReply();
    // لاحظ أنه بعد حذف الرسالة، لن يكون هناك شيء للرد عليه
    return;
}

// إذا كان الضغط على زر "close_id_note" ولم يكن "cancel_close"
if (interaction.customId === 'close_id_note') {
    // Create the embed message
    const embed = new MessageEmbed()
        .setColor('#2c2c34')
        .setTitle('> هل أنت متأكد أنك تريد إغلاق هذه التذكرة؟')
        .setDescription("- \`إغلاق التذكرة\` سيقوم بإغلاق هذه التذكرة عنك\n- \`إلغاء\` سيقوم بإلغاء عملية إغلاق هذه التذكرة");

    // Send a message to confirm closure
    const message = await interaction.reply({
        embeds: [embed],
        ephemeral: true,
        components: [
            new MessageActionRow().addComponents(
                new MessageButton().setCustomId('confirm_close').setLabel('إغلاق').setStyle('DANGER').setEmoji('🔒'),
                new MessageButton().setCustomId('cancel_close').setLabel('إلغاء').setStyle('SECONDARY').setEmoji('❌')
            )
        ]
    });

    // Respond to the button to cancel
    const filter = i => i.customId === 'cancel_close';
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async i => {
        await i.deferUpdate(); // You can use this if you're using older buttons.
        await interaction.deleteReply(); // Delete the message
    });

    collector.on('end', async () => {
        if (!message.deleted) await message.delete().catch(console.error); // Make sure to delete the message in case the button press event doesn't occur
    });
} else if (interaction.customId === 'confirm_close') {
    try {
        // Defer the interaction to avoid timeout
        await interaction.deferUpdate();

        // Send a loading message
        const loadingMessage = await interaction.followUp({ embeds: [new MessageEmbed().setDescription('**جاري التجميل - يرجي الانتظار... 🛡**').setColor('#2c2c34')] });

        // Delay the display of the embed for 3 seconds
        setTimeout(async () => {
            // Delete the loading message
            await loadingMessage.delete();
          
             // Create a new embed instance
            const embed2 = new MessageEmbed()
                 .setTitle(`**لقد تم إغلاق هذه التذكرة 🔒**`)
                 .setColor('#2c2c34')

            // Reply to the interaction with the embed
            await interaction.channel.send({ embeds: [embed2] });

            // Remove permissions and send the embed
            const channel = interaction.channel;
            const permissionOverwrites = channel.permissionOverwrites.cache.filter(overwrite => overwrite.type === 'member');
            const mentionList = [];

            for (const overwrite of permissionOverwrites.values()) {
                const member = await channel.guild.members.fetch(overwrite.id);
                if (!member.permissions.has('ADMINISTRATOR')) {
                    await overwrite.delete();
                    mentionList.push(`<@${member.id}>`);
                }
            }
          
            let currentTime = new Date();

            // إضافة ساعة واحدة
            currentTime.setHours(currentTime.getHours() + 1);
            const saveticketdate = new Date().toLocaleDateString('en-US', { timeZone: 'Africa/Cairo' });
            const saveticketdate2 = currentTime.toLocaleTimeString('en-EG', { timeZone: 'Africa/Cairo', hour12: true, hour: 'numeric', minute: 'numeric' });
          
            const mentionListFormatted = mentionList.map((mention, index) => `${index + 1}. ${mention}`);
            const mentionListString = mentionListFormatted.join('\n');
            const closedEmbed = new MessageEmbed()
                .setColor('#2c2c34')
                .setTitle('> :lock: هذه التذكرة مغلقة')
                .setDescription(`**لقد تم أخفاء التذكرة كلاً من**\n${mentionListString}`)
                .addFields(
                    { name: 'تم إغلاق هذه التذكرة بواسطة', value: `${interaction.member}`, inline: true },
                    { name: '\u2003', value: `\u2003`, inline: true },
                    { name: 'تاريخ أغلاق التذكرة', value: `**\`${saveticketdate2},${saveticketdate}\`**`, inline: true }
                );

            const deleteButton = new MessageButton()
                .setCustomId('delete_ticket')
                .setLabel('⛔ حذف التذكرة')
                .setStyle('DANGER');
            const transcriptButton = new MessageButton()
                .setCustomId('transscript')
                .setLabel('📜 حقظ التذكرة')
                .setStyle('PRIMARY');
            const reopenButton = new MessageButton()
                .setCustomId('reopen_ticket')
                .setLabel('🔓 إعادة فتح التذكرة')
                .setStyle('SUCCESS');

            const row = new MessageActionRow().addComponents(deleteButton, transcriptButton, reopenButton);

            await channel.send({ embeds: [closedEmbed], components: [row] });

            // Append "-closed" to the channel name if not already present
            if (!channel.name.includes('-مغلق')) {
                await channel.setName(`${channel.name}-مغلق`);
            }

            // Get all messages in the channel
            const messages = await channel.messages.fetch({ limit: 100 });
            const ticketMessages = messages.map(message => `Author: ${message.author.tag} | Content: ${message.content}`).join('\n');

            // Add mention and ticket name before writing ticket messages to a text file
            const ticketName = channel.name.replace('-مغلق', '');
            const mention = `<@${interaction.member.id}>`;
            const finalContent = `${ticketMessages}`;

            // Write ticket messages to a text file
            fs.writeFileSync('ticket_messages.txt', finalContent);

            // Read the text file
            const fileBuffer = fs.readFileSync('ticket_messages.txt');
            const attachment = new MessageAttachment(fileBuffer, 'ticket_messages.txt');
          
            let currentTime2 = new Date();

            // إضافة ساعة واحدة
            currentTime2.setHours(currentTime2.getHours() + 1);
          
            const embed = interaction.message.embeds[0];
            const ticketOwnerField = embed.fields.find(field => field.name === 'منشئ التذكرة');
            const ticketOwnerValue = ticketOwnerField ? ticketOwnerField.value : 'غير معروف';
            const ticketOwnerField2 = embed.fields.find(field => field.name === 'قسم التذكرة');
            const ticketOwnerValue2 = ticketOwnerField2 ? ticketOwnerField2.value : 'غير معروف';
            const ticketOwnerField3 = embed.fields.find(field => field.name === 'الدعم المطلوب');
            const ticketOwnerValue3 = ticketOwnerField3 ? ticketOwnerField3.value : 'غير معروف';
        

            // Get the user who clicked the button
            const claimTicket = interaction.user;
            const startTimestamp = Math.floor(Date.now() / 1000) - 35;
            const saveticketdate22 = new Date().toLocaleDateString('en-US', { timeZone: 'Africa/Cairo' });
            const saveticketdate23 = currentTime2.toLocaleTimeString('en-EG', { timeZone: 'Africa/Cairo', hour12: true, hour: 'numeric', minute: 'numeric' });

          
            // Create an embed message
            const embed9 = new MessageEmbed()
                .setTitle('> تم إغلاق هذا التذكرة')
                .addFields(
                    { name: 'منشئ هذه التذكرة', value: `\`مذال قيد التطوير\``, inline: true },
                    { name: 'تم إغلاق التذكرة بواطسة', value: `${mention}`, inline: true },
                    { name: 'تم إستلام التذكرة بواسطة', value: `\`مذال قيد التطوير\``, inline: true },
                    { name: 'أسم التذكرة', value: `\`${ticketName}\``, inline: true },
                    { name: 'قسم التذكرة', value: `\`مذال قيد التطوير\``, inline: true },
                    { name: 'تاريخ التذكرة', value: `**\`${saveticketdate23},${saveticketdate22}\`**`, inline: true }
                )
                .setColor('#2c2c34');  // يمكنك تغيير اللون حسب رغبتك

            // Send the embed message and the file in the specified room
            const destinationChannel = interaction.guild.channels.cache.get(TicketSaveChannelId);
            await destinationChannel.send({ embeds: [embed9], files: [attachment] });

            // Delete the text file
            fs.unlinkSync('ticket_messages.txt');
        }, 1000);

    } catch (error) {
        console.error('Error handling confirm_close button:', error.message);
        await interaction.followUp({ content: 'Failed to process the request.', ephemeral: true });
    }
}

  const mentionList = [];
if (interaction.customId === 'delete_ticket') {
    // حذف التذكرة إذا تم النقر على زر "delete ticket"
    const channel = interaction.channel;
    try {
        await channel.delete();
    } catch (error) {
        console.error('Error deleting ticket:', error.message);
    }
}

    if (interaction.customId === 'reopen_ticket') {
        // Reply with a message indicating feature is under development
        await interaction.reply({ content: 'هذه الميزة قيد التطوير.', ephemeral: true });
    }

    if (interaction.customId === 'ticket_panel') {
        const selectedOption = interaction.values ? interaction.values[0] : null;
        if (!selectedOption) return;

        const selectedDepartment = selectMenuOptions.find(option => option.value === selectedOption);
        if (!selectedDepartment) return;

        try {
            // قراءة ملف ticket-date.json
            fs.readFile(ticketsFilePath, 'utf8', async (err, data) => {
                if (err && err.code === 'ENOENT') {
                    // الملف لا يوجد، تعيين ticketCounter إلى 0
                    ticketCounter = 0;
                } else if (!err) {
                    const tickets = JSON.parse(data);
                    const lastTicket = tickets[tickets.length - 1];
                    ticketCounter = lastTicket ? lastTicket.ticket_number : 0;
                } else {
                    console.error('Error reading ticket-date.json:', err);
                    return;
                }

                ticketCounter++;

                const ticketType = selectedOption.split('_')[1];
                const categoryID = categoryIDs[selectedOption];
                const ticket_open_member = member.id;

                const ticketId = interaction.id;
                const currentTime = new Date();
                currentTime.setHours(currentTime.getHours() + 1);
                const egyptianDate = new Date().toLocaleDateString('en-US', { timeZone: 'Africa/Cairo' });
                const egyptianDate2 = currentTime.toLocaleTimeString('en-EG', { timeZone: 'Africa/Cairo', hour12: true, hour: 'numeric', minute: 'numeric' });

                const channel = await guild.channels.create(`${selectedDepartment.label}-${ticketCounter}`, {
                    type: 'text',
                    permissionOverwrites: [
                        {
                            id: guild.roles.everyone,
                            deny: ['VIEW_CHANNEL']
                        },
                        {
                            id: member.id,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ADD_REACTIONS']
                        },
                        {
                            id: client.user.id,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ADD_REACTIONS']
                        },
                        ...selectedDepartment.roleticketid.map(roleId => ({
                            id: roleId,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ADD_REACTIONS']
                        }))
                    ],
                    parent: categoryID
                });

                const replyMessage = `✔ Ticket Created <#${channel.id}> Ticket Number \`${ticketCounter}\``;
                const row = new MessageActionRow().addComponents(
                    new MessageButton().setLabel('🔗 Ticket Link').setStyle('LINK').setURL(`https://discord.com/channels/${guild.id}/${channel.id}`)
                );

                currentTime.setHours(currentTime.getHours() + 1);
                const startTimestamp = Math.floor(Date.now() / 1000) - 85;
                let count = channelCounts.get(channel.parentId) || 0;
                count++;
                const user = member.user;
        
                await interaction.reply({ content: replyMessage, components: [row], ephemeral: true });

                const embedopen1 = new MessageEmbed()
                    .setImage(`${selectedDepartment.embedimage}`)
                    .setAuthor({ name: `${member.guild.name} مرحبًا بك في خادم`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setColor('#2c2c34')
                    .addFields(
                        { name: 'منشئ التذكرة', value: `<@${member.id}>`, inline: true },
                        { name: 'الدعم المطلوب', value: `${selectedDepartment.rolesupport}`, inline: true },
                        { name: 'إستلام التذكرة', value: `\`لا يوجد أحد\``, inline: true },
                        { name: 'قسم التذكرة', value: `\`${selectedDepartment.label}\``, inline: true },
                        { name: 'تاريخ التذكرة', value: `\`${egyptianDate2},${egyptianDate}\``, inline: true },
                        { name: 'الاسم', value: `\`${member.user.username}\``, inline: true },
                        { name: 'التذكرة منذ', value: `┕<t:${Math.floor(Date.now() / 1000) - 85}:R>`, inline: true },
                        { name: 'تاريخ الانضمام لديسكورد', value: `┕<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
                        { name: 'تاريخ الانضمام للخادم', value: `┕<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true }
                    );

                const closeButton = new MessageButton().setCustomId('close_id_note').setLabel('إغلاق التذكرة').setStyle('DANGER').setEmoji('🔒');
                const renameButton = new MessageButton().setCustomId('rename-ticket-button').setLabel('إعادة التسمية').setStyle('PRIMARY').setEmoji('♻');
                const addMemberButton = new MessageButton().setCustomId('addmem_kikmem').setLabel('التحكم بالأعضاء').setStyle('PRIMARY').setEmoji('👥');
                const transcButton = new MessageButton().setCustomId('transscript').setLabel('حفظ التذكرة').setStyle('PRIMARY').setEmoji('📜');
                const claimButton = new MessageButton().setCustomId('claim_ticket').setLabel('إستلام التذكرة').setStyle('SUCCESS').setEmoji('🔖');
                const noteButton = new MessageButton().setCustomId('addnote-ticket-button').setLabel('إضافة ملاحظة').setStyle('PRIMARY').setEmoji('📌');
                const msgcontrolButton = new MessageButton().setCustomId('msg_control').setLabel('التحكم بالرسائل').setStyle('PRIMARY').setEmoji('🛠️');
                const tikrepButton = new MessageButton().setCustomId('ticket_rep').setLabel('تقديم بلاغ').setStyle('PRIMARY').setEmoji('📝');

                const row1 = new MessageActionRow().addComponents(closeButton, transcButton, addMemberButton, claimButton);
                const row2 = new MessageActionRow().addComponents(tikrepButton, renameButton, msgcontrolButton, noteButton);
                channel.send({ content: `||${member} - ${selectedDepartment.rolesupport}||`, embeds: [embedopen1], components: [row1, row2] });
    
                const ticketData = {
                    member_id: member.id,
                    member_username: member.user.username,
                    ticket_openDate: `${egyptianDate2},${egyptianDate}`,
                    ticket_name: `${selectedDepartment.label}-${ticketCounter}`,
                    ticket_number: ticketCounter,
                    ticket_department: selectedDepartment.label,
                    ticket_Id: ticketId
                };

                fs.readFile(ticketsFilePath, 'utf8', (err, data) => {
                    if (err && err.code === 'ENOENT') {
                        fs.writeFile(ticketsFilePath, JSON.stringify([ticketData], null, 2), 'utf8', (err) => {
                            if (err) {
                                console.error('Error creating ticket-date.json:', err);
                            } else {
                                console.log('Ticket data saved successfully.');
                            }
                        });
                    } else if (!err) {
                        const tickets = JSON.parse(data);
                        tickets.push(ticketData);
                        fs.writeFile(ticketsFilePath, JSON.stringify(tickets, null, 2), 'utf8', (err) => {
                            if (err) {
                                console.error('Error saving ticket data:', err);
                            } else {
                                console.log('Ticket data appended successfully.');
                            }
                        });
                    } else {
                        console.error('Error reading ticket-date.json:', err);
                    }
                });
            });
        } catch (error) {
            console.error('Error creating ticket:', error);
        }
    }
});
const channelCounts = new Map();















client.on('interactionCreate', async (interaction) => {
  if (interaction.isSelectMenu()) {
    const rule = rules.find(r => r.id === interaction.values[0]);
    const text = fs.readFileSync(rule.description, 'utf-8');
    const ruleEmbed = new MessageEmbed()
      .setColor(`#2c2c34`)
      .setTitle(`> ${rule.title}`)
      .setDescription(text)
    const message = await interaction.reply({ embeds: [ruleEmbed], ephemeral: true });
    
    // Add reaction directly to the replied message
  }
});


let tracker = "10";
  tracker = new inviteTracker(client);
	// "guildMemberAdd"  event to get full invite data
tracker.on("guildMemberAdd", async (member, inviter, invite, error) => {
  const startTimestamp = Math.floor(Date.now() / 1000) - 28;
  const memberCount = member.guild.memberCount;
  
  // return when get error
  if(error) return console.error(error);
  
  // get the channel
  let channel = member.guild.channels.cache.get(welcomeLogChannelId);
  
  let welcomeMessage = {
    color: "#2c2c34",
    title: "New Member Joined",
    description: `1. New member joined the server - ${member.user}
2. Invited by - <@!${inviter.id}>
3. Invitations Count - ${invite.count}
4. Member Count - ${memberCount}
5. Joined at - <t:${startTimestamp}:R>`,
    timestamp: new Date(),
    thumbnail: {
      url: member.user.displayAvatarURL({ size: 4096 }),
    },
  };

  // change welcome message when the member is bot
  if (member.user.bot) {
    welcomeMessage.description = `1. New bot joined the server - ${member.user}
2. Invited by - <@!${inviter.id}>
3. Invitations Count - ${invite.count}
4. Member Count - ${memberCount}
5. Joined at - <t:${startTimestamp}:R>`;
  }

  // send welcome message
  channel.send({ embeds: [welcomeMessage] });
});

// وظيفة لتقسيم مصفوفة إلى مجموعات
function chunkArray2(array, chunkSize) {
    const chunkedArray = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunkedArray.push(array.slice(i, i + chunkSize));
    }
    return chunkedArray;
}





client.on('guildMemberAdd', async member => {
  
    const egyptianDate = new Date().toLocaleDateString('en-US', { timeZone: 'Africa/Cairo' });
    const startTimestamp = Math.floor(Date.now() / 1000) - 27;
    let buffer_attach =  await generareCanvas(member)
    const attachment = new MessageAttachment(buffer_attach, 'welcomebanner.png')

  
    const fourSeasonButton = new MessageButton()
        .setStyle('LINK')
        .setLabel("4 Season MTA")
        .setURL('https://dsc.gg/4-season'); // رابط موقع الـ 4 SEASON
  
    const botSeasonButton = new MessageButton()
        .setStyle('LINK')
        .setLabel("4 Season FiveM")
        .setURL('https://dsc.gg/4-season-fivem'); // رابط موقع الـ 4 SEASON

    const instaButton = new MessageButton()
        .setStyle('LINK')
        .setLabel('4 Season Website')
        .setURL('https://bit.ly/The4SeasonRp'); // رابط موقع الـ 4 SEASON


    const buttonRow = new MessageActionRow()
        .addComponents([instaButton, fourSeasonButton, botSeasonButton]);

    const embed = new MessageEmbed()
        .setColor('#2c2c34')
        .setTitle(`> <:ejpic1008:1241773699544252447> __${member.guild.name}__ <:ejpic1001:1241773680556507267>`)
        .setDescription(`**<:ejpic1015:1241773719123267645> Happy to have you with us here.\n<:ejpic1015:1241773719123267645> We wish you a happy day \n\n**`)
        .addFields(
            { name: '**1. Rules Server**', value: `<#1026875367740407929>`, inline: true },
            { name: '**1. Reaction Roles**', value: `<#1026875367740407929>`, inline: true },
            { name: '\u2003', value: `\u2003`, inline: true },
            { name: '**3. Joined Discord**', value: `**<t:${startTimestamp}:R>**`, inline: true },
            { name: '**2. Joined Server**', value: `**\`\`${egyptianDate}\`\`**`, inline: true },
            { name: '\u2003', value: `\u2003`, inline: true }
          )    
        .setImage("attachment://welcomebanner.png")
        .setThumbnail("https://cdn.discordapp.com/attachments/1241270976021528637/1242353887332007967/image.png?ex=664d87b8&is=664c3638&hm=580b0f727d1fea2955bf58ffee33256937a68194fc4dcecd5e32d463f416ca23&");

        member.send({ embeds: [embed], files: [attachment],  components: [buttonRow] })
        .catch(console.error);
});
tracker = new inviteTracker(client);
// "guildMemberAdd"  event to get full invite data
tracker.on('guildMemberAdd', async (member, inviter, invite, error) => {
  if(error) return console.error(error);
  let buffer_attach =  await generareCanvas(member)
  const attachment = new MessageAttachment(buffer_attach, 'image/welcomebanner.png')
  const startTimestamp = Math.floor(Date.now() / 1000) - 42;
  const memberCount = member.guild.memberCount;

  let embed = new MessageEmbed()
    .setTitle(`> <:ejpic1008:1241773699544252447> Welcome To __${member.guild.name}__ Server <:ejpic1001:1241773680556507267>`)
    .addFields(
      { name: '<:ejpic1011:1241773707542659224> Welcome', value: `${member.user}`, inline: true },
      { name: '<:ejpic1014:1241773715801509909> Invited By', value: `<@!${inviter.id}>`, inline: true },
      { name: '<:ejpic1005:1241773691591987410> Rules', value: `<#1026875367740407929>`, inline: true },
      { name: '<:ejpic1010:1241773705189658746> User ID', value: `\`\`${member.user.id}\`\``, inline: true },
      { name: '<:ejpic1003:1241773685891666051> Member Count', value: `\`\`${memberCount}\`\``, inline: true },
      { name: '<:ejpic1002:1241773683249254523> Invite Number', value: `\`\`${invite.count}\`\``, inline: true },
      { name: '<:ejpic1009:1241773702471880785> Joined Server', value: `<t:${startTimestamp}:R>`, inline: true },
      { name: '<:ejpic1015:1241773719123267645> Joined Discord', value: `<t:${Math.floor(member.user.createdAt / 1000)}:R>`, inline: true },
      { name: '<:ejpic1006:1241773694477668473> Member User', value: `\`\`${member.user.username}\`\``, inline: true },
      { name: '<:ejpic1007:1241773697036193902> 4 Season MTA', value: `[Click Here](https://dsc.gg/4-season)`, inline: true },
      { name: '<:ejpic1012:1241773710910816256> 4 Season FiveM', value: `[Click Here](https://dsc.gg/4-season-fivem)`, inline: true },
      { name: '<:ejpic1012:1241773710910816256> 4 Season Website', value: `[Click Here](https://bit.ly/The4SeasonRp)`, inline: true }
    )
    .setColor('#2F3136')
    .setImage('attachment://welcomebanner.png');

  const welcomeChannel = member.guild.channels.cache.get(welcomeRoomId);
  if (welcomeChannel) {
    welcomeChannel.send({ content: `||${member.user}||`, embeds: [embed], files: [attachment] });
  } else {
    console.error(`Welcome channel not found with ID: ${welcomeRoomId}`);
  }
});


async function generareCanvas(member) {
  const avatar = await resolveImage(member.user.displayAvatarURL({ 'size': 2048, 'format': "png" }))
  const background = await resolveImage("image/welcomebanner.png") // استخدام اسم الملف المحلي مباشرة هنا
  const { weirdToNormalChars } = require('weird-to-normal-chars')
  const name = weirdToNormalChars(member.user.username)
  let canvas = new Canvas(719, 404)
    .printImage(background, 0, 0, 719, 404)
    .setColor("#FBB917")
    .printCircle(360, 200, 86)
    .setColor("#FFFFFF")
    .printCircle(360, 200, 83)
    .printCircularImage(avatar, 360, 200, 80)
    .setTextAlign('center')
    .setTextFont('25px Discord')
    .setColor("#FBB917")
    .printText(`${member.guild.name}`, 360, 380)
    .setTextAlign("center")
    .setColor("#FBB917")
    .setTextFont('30px Discordx')
    .printText(`${name}`, 360, 330)
    .setTextAlign("center")
    .setColor("#FFFFFF")
    .setTextFont('31px Discordx')
    .printText(`${name}`, 360, 330)
    .setTextAlign('center')
    .setTextFont('26px Discord')
    .setColor("#FFFFFF")
    .printText(`${member.guild.name}`, 360, 380)
    // Adding "bot by ahmed" text above the image
  /*
    .setTextAlign('center')
    .setTextFont('bold 15px Arial')
    .setColor("#FFFFFF")
    .printText('</> Developer BOT Ahmed Clipper', 160, 25);
    // Adding "insta" text below the line
  canvas.setTextAlign('center')
    .setTextFont('bold 15px Arial')
    .setColor("#FFFFFF")
    .printText('</> instagram : ahm.depression', 150, 60);
    */
  return canvas.toBufferAsync()
}


client.on('messageCreate', async message => {
    if (message.content === `${prefix}profile`) {
        // إرسال رسالة قبل بدء إنشاء الصورة
        const creatingCardMessage = await message.reply("> <a:ejgif1004:1241743499678973952> **Creating Your Profile Card...**");
        await message.channel.sendTyping();

        const guild = message.guild;
        let buffer_attach = await generareCanvas2(message.member); // افترض أن generareCanvas هي الدالة التي تنشئ الصورة
        const attachment = new MessageAttachment(buffer_attach, 'image/profile.png');

        // حذف الرسالة السابقة وتحديثها بالصورة المنشأة
        await creatingCardMessage.delete();
        message.reply({ content: `> <a:ejgif1033:1242349759298015334> **ملاحظة : هذا الأمر لم يكتمل بعد، ومازال قيد التطوير** <a:ejgif1032:1242349755728789504>`, files: [attachment] }); // إرسال الصورة المرفقة فقط في الروم المحدد
    }
});
async function generareCanvas2(member) {
  const avatar = await resolveImage(member.user.displayAvatarURL({ 'size': 2048, 'format': "png" }))
  const background = await resolveImage("image/profile.png")
  const background2 = await resolveImage("image/backprofile.png")
  const { weirdToNormalChars } = require('weird-to-normal-chars')
  const name = weirdToNormalChars(member.user.username)
  
  // تواريخ الانضمام بالإنجليزية
  const memberSinceServerEnglish = member.joinedAt.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })
  const memberSinceDiscordEnglish = member.user.createdAt.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })

  let canvas = new Canvas(378, 536)
    .printImage(background2, 0, 0, 378, 536)
    .printImage(background, 0, 0, 378, 536)
    .setColor("#232328")
    .printCircle(100, 140, 53)
    .printCircularImage(avatar, 100, 140, 45)
    .setColor("#232328")
    .printCircle(130, 170, 15)
    // MEMBER SINCE
    .setTextAlign('ltr')
    .setColor("#FFFFFF")
    .setTextFont('14px Discord')
    .printText(`MEMBER SINCE`, 65, 430)
    // تاريخ الانضمام إلى السيرفر
    .setTextAlign("ltr")
    .setColor("#FFFFFF")
    .setTextFont('10px Discordx')
    .printText(`${memberSinceServerEnglish}`, 213, 460)
    // تاريخ الانضمام إلى ديسكورد
    .setTextAlign("ltr")
    .setColor("#FFFFFF")
    .setTextFont('10px Discordx')
    .printText(`${memberSinceDiscordEnglish}ㅤ・ㅤ`, 95, 460)
    // اسم العضو
    .setTextAlign("ltr")
    .setColor("#FFFFFF")
    .setTextFont('15px Discordx')
    .printText(`${name}`, 65, 230)

  const badge03 = await resolveImage(__dirname + "/image/badge03.png")
  canvas.printImage(badge03, 301, 165, 30, 30)
  
  const badge05 = await resolveImage(__dirname + "/image/badge05.png")
  canvas.printImage(badge05, 275, 165, 30, 30)
  
  const badge01 = await resolveImage(__dirname + "/image/badge01.png")
  canvas.printImage(badge01, 248, 165, 30, 30)  
  
  const badge06 = await resolveImage(__dirname + "/image/badge06.png")
  canvas.printImage(badge06, 221, 165, 30, 30)  
  
  const discordjoin = await resolveImage(__dirname + "/image/discordjoin.png")
  canvas.printImage(discordjoin, 65, 445, 25, 25)  
  
  const serverjoin = await resolveImage(__dirname + "/image/serverjoin2.png")
  canvas.printImage(serverjoin, 182, 445, 25, 25)  
  /*
  const online01 = await resolveImage(__dirname + "/image/online01.png")
  canvas.printImage(online01, 130, 170, 13, 13) 
  */
  const idle02 = await resolveImage(__dirname + "/image/dnd03.png")
  canvas.printImage(idle02, 122, 162, 17, 17) 
  

  return canvas.toBufferAsync()
}





async function generateCanvas3(member, level, xp, leaderboardPosition) {
    const avatar = await resolveImage(member.user.displayAvatarURL({ 'size': 2048, 'format': "png" }));
    const background = await resolveImage(`image/${rankbanner}`);
    const { weirdToNormalChars } = require('weird-to-normal-chars');
    const name = weirdToNormalChars(member.user.username);

    // تواريخ الانضمام بالإنجليزية
    const memberSinceServerEnglish = member.joinedAt.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' });
    const memberSinceDiscordEnglish = member.user.createdAt.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' });

    let canvas = new Canvas(900, 650)
        .printImage(background, 0, 0, 900, 650)
        .setColor("#232328")
        .printCircularImage(avatar, 449, 325, 90  )
        .setColor("#232328")
        // اسم العضو
        .setTextAlign("center")
        .setColor("#FFFFFF")
        .setTextFont('25px Discordx')
        .printText(`${name}`, 450, 108)
        // xp العضو
        .setTextAlign("center")
        .setColor("#FFFFFF")
        .setTextFont('25px Discordx')
        .printText(`${xp}/${xpPerLevel}`, 250, 558)
        .setTextAlign("center")
        .setColor("#FFFFFF")
        .setTextFont('25px Discordx')
        .printText(`XP`, 250, 510)
        // لفل العضو
        .setTextAlign("center")
        .setColor("#FFFFFF")
        .setTextFont('25px Discordx')
        .printText(`${level}`, 650, 558)
        .setTextAlign("center")
        .setColor("#FFFFFF")
        .setTextFont('25px Discordx')
        .printText(`Level`, 650, 510)
        // تصنيف العضو
        .setTextAlign("center")
        .setColor("#FFFFFF")
        .setTextFont('25px Discordx')
        .printText(`#${leaderboardPosition}`, 450, 558)
        .setTextAlign("center")
        .setColor("#FFFFFF")
        .setTextFont('25px Discordx')
        .printText(`Classification`, 450, 510);

    return canvas.toBufferAsync();
}


const cooldowns = new Map();
client.on('messageCreate', async message => {
    if (message.content === `${prefix}rank`) {
        const authorId = message.author.id;

        // تحقق مما إذا كان المستخدم في فترة الانتظار
        if (cooldowns.has(authorId)) {
            const cooldownTime = cooldowns.get(authorId);
            const remainingTime = (cooldownTime - Date.now()) / 1000;
            const warningMessage = await message.reply(`Please wait ${remainingTime.toFixed(1)} seconds before using this command again.`);
            
            // حذف الرسالة بعد 5 ثواني
            setTimeout(() => warningMessage.delete(), 3000);
            return;
        }

        const userData = getUserData(authorId);

        if (!userData) {
            message.reply('You have not gained any XP yet.');
            return;
        }

        const { level, xp } = getUserLevelAndXP(userData);
        const leaderboardPosition = getLeaderboardPosition(authorId);

        // بدء عملية الكتابة (Typing)
        message.channel.sendTyping();

        // إرسال رسالة قبل بدء إنشاء الصورة
        const creatingCardMessage = await message.reply("> <a:ejgif1004:1241743499678973952> **Creating Your Profile Card...**");

        // إنشاء الصورة
        let buffer_attach = await generateCanvas3(message.member, level, xp, leaderboardPosition);
        const attachment = new MessageAttachment(buffer_attach, `image/${rankbanner}`);

        // تحديث الرسالة السابقة بالصورة المنشأة
        await creatingCardMessage.edit({ content: '\u2003', files: [attachment] }); // إرسال الصورة المرفقة فقط في الروم المحدد

        // إضافة المستخدم إلى مجموعة الانتظار
        const cooldownDuration = 5000; // 5 ثواني
        cooldowns.set(authorId, Date.now() + cooldownDuration);
        setTimeout(() => cooldowns.delete(authorId), cooldownDuration);
    }
});






client.login(process.env.token);
