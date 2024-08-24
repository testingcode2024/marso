const { MessageEmbed, MessageSelectMenu, MessageActionRow } = require('discord.js');
const { prefix } = require('../config.json');

module.exports = {
    name: 'help',
    aliases: ['h'],
    description: 'List commands.',
    async execute(message, args) {

        let zap = "\`⚡ استجابة البرق\`";
        let green = "\`🟢 استجابة جيدة\`";
        let yellow = "\`🟡 استجابة معتدلة\`";
        let red = "\`🔴 استجابة بطيئه\`";

        var botState = zap;
        var apiState = zap;
        var timediff = zap;

        let apiPing = message.client.ws.ping;
        let botPing = Math.floor(Date.now() - message.createdTimestamp);

        if (apiPing >= 40 && apiPing < 200) {
            apiState = green;
        } else if (apiPing >= 200 && apiPing < 400) {
            apiState = yellow;
        } else if (apiPing >= 400) {
            apiState = red;
        }

        if (botPing >= 40 && botPing < 200) {
            botState = green;
        } else if (botPing >= 200 && botPing < 400) {
            botState = yellow;
        } else if (botPing >= 400) {
            botState = red;
        }

        if (botPing >= 40 && botPing < 200) {
            timediff = green;
        } else if (botPing >= 200 && botPing < 400) {
            timediff = yellow;
        } else if (botPing >= 400) {
            timediff = red;
        }

        const embed = new MessageEmbed()
            .setColor('#2c2c34')
            .setImage("https://cdn.discordapp.com/attachments/1254132794293092363/1260381040221093888/4s.jpg?ex=668f1cd0&is=668dcb50&hm=953ca2dc5431f6c62b47641e7bfff98c2c7622e44abd499772d37a6c75e1e83d&")
            .setTimestamp()
            .setFooter({ text: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setAuthor({ name: `${message.client.user.username} أهلاً بكم في البوت الخاص بالـ`, iconURL: message.guild.iconURL({ dynamic: true }) })
            .setDescription(`> **🤖 قواعد استخدام أوامر البوت**\n\n1. ⚠️ تجنب إرسال الأوامر بشكل متكرر للحفاظ على أداء البوت واستقرار السيرفر.\n2. 📌 تعريف عام للأوامر : \`🟢\` : عام | \`🟠\` : إداري | \`🔴\` : تجريبي.\n3. 🚫 قصر الأوامر على القنوات المناسبة للحفاظ على تدفق المحادثات.\n4. 🛑 احترام قواعد السيرفر وتجنب الأوامر المزعجة أو المسيئة.\n5. 🛠 إذا واجهت مشكلة، يرجى التحدث مع المطور.\n6. 🔧 \` ${prefix} \` : البرفكس لاستخدام أوامر البوت.\n7. 🎛 حالة البوت: ${botState}\n8. 📚 جميع الأوامر : 40.`);

        const selectMenu = new MessageSelectMenu()
            .setCustomId('help-menu')
            .setPlaceholder('📂 اختر فئة الأمر')
            .addOptions([
                {
                    label: '💬 الأوامر العامة',
                    description: '📜 أوامر عامة لجميع المستخدمين',
                    value: 'general_command',
                    emoji: '🌐'
                },
                {
                    label: '🛠️ الأوامر الإدارية',
                    description: '📜 الأوامر للإدارين فقط',
                    value: 'admin_command',
                    emoji: '🛡️'
                },
                {
                    label: '🎮 أوامر نظام الليفلينج',
                    description: '📜 الأوامر المتعلقة بنظام الليفلينج',
                    value: 'leveling_system',
                    emoji: '📈'
                },
                {
                    label: '↩️ القائمة الرئيسية',
                    description: '📜 العودة إلى القائمة الرئيسية',
                    value: 'main_menu',
                    emoji: '🏠'
                },
            ]);

        const row = new MessageActionRow().addComponents(selectMenu);

        const messageReply = await message.reply({ embeds: [embed], components: [row] });

        const filter = interaction => interaction.customId === 'help-menu';
        const collector = messageReply.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async interaction => {
            if (interaction.user.id !== message.author.id) {
                await interaction.reply({ content: 'Only the person who wrote the command can use the buttons', ephemeral: true });
                return;
            }

            if (interaction.values[0] === 'general_command') {
                const updatedEmbed = new MessageEmbed()
                    .setAuthor({ name: `General Commands`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .addFields(
                        { name: `>  💬 الأمر`, value: `\u2003`, inline: true },
                        { name: `📜 الوصف`, value: `\u2003`, inline: true },
                        { name: `\u2003`, value: `\u2003`, inline: false },
                        { name: `\`🟢\` \`server-banner\`\n`, value: `\u2003`, inline: true },
                        { name: 'يعرض صورة شعار الخادم.\n', value: `\u2003`, inline: true },
                        { name: `\u2003`, value: `\u2003`, inline: false },
                        { name: `\`🟢\` \`message-info\`\n\`🟢\` \`channel-info\`\n\`🟢\` \`member-list\``, value: `\u2003`, inline: true },
                        { name: 'يعرض معلومات حول الرسالة.\nيعرض معلومات مفصلة عن القناة.\nيعرض قائمة أعضاء الخادم.', value: `\u2003`, inline: true },
                        { name: `\u2003`, value: `\u2003`, inline: false },
                        { name: `\`🟢\` \`user-banner\`\n\`🟢\` \`user-avatar\`\n\`🟢\` \`server-info\``, value: `\u2003`, inline: true },
                        { name: 'جلب شعار المستخدم.\nيستعيد الصورة الرمزية للمستخدم.\nيوفر معلومات مفصلة عن الخادم.', value: `\u2003`, inline: true },
                        { name: `\u2003`, value: `\u2003`, inline: false },
                        { name: `\`🟢\` \`emoji-list\`\n\`🟢\` \`user-info\`\n\`🟢\` \`role-info\``, value: `\u2003`, inline: true },
                        { name: 'يسرد جميع الرموز التعبيرية المتاحة على الخادم.\nيسترد ملخص معلومات المستخدم التفصيلي.\nيوفر معلومات حول دور محدد.', value: `\u2003`, inline: true },
                        { name: `\u2003`, value: `\u2003`, inline: false },
                        { name: `\`🟢\` \`role-list\`\n\`🟢\` \`profile\`\n\`🟢\` \`ping\``, value: `\u2003`, inline: true },
                        { name: 'يوفر معلومات مفصلة حول الدور.\nإظهار ملف التعريف الخاص بك في الخادم.\nتحقق من زمن استجابة الروبوت وواجهة برمجة التطبيقات.', value: `\u2003`, inline: true },
                        { name: `\u2003`, value: `\u2003`, inline: false },
                        { name: `\n\`🟢\` \`tax\`\n\`🟢\` \`bot\``, value: `\u2003`, inline: true },
                        { name: 'حساب ضريبة الكريدت الخاصة بالـProBot\nعرض معلومات حول البوت.', value: `\u2003`, inline: true },
                    );

                await interaction.update({ embeds: [updatedEmbed] });
            } else if (interaction.values[0] === 'admin_command') {
                const updatedEmbed = new MessageEmbed()
                    .setAuthor({ name: `Admin Command`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .addFields(
                        { name: `>  💬 الأمر`, value: `\u2003`, inline: true },
                        { name: `📜 الوصف`, value: `\u2003`, inline: true },
                        { name: `\u2003`, value: `\u2003`, inline: false },
                        { name: `\`🟠\` \`test-welcome\`\n\`🟠\` \`edit-message\`\n\`🟠\` \`say\``, value: `\u2003`, inline: true },
                        { name: 'يحاكي رسالة ترحيب تجريبية.\nيعدل محتوى رسالة موجودة.\nيكرر نصك.', value: `\u2003`, inline: true },
                        { name: `\u2003`, value: `\u2003`, inline: false },
                        { name: `\`🟠\` \`rename-system\`\n\`🟠\` \`report-system\`\n\`🟠\` \`rules-system\``, value: `\u2003`, inline: true },
                        { name: 'نظام تغيير اسم السيرفر.\nنظام التبليغ في السيرفر.\nنظام قواعد السيرفر.', value: `\u2003`, inline: true },
                        { name: `\u2003`, value: `\u2003`, inline: false },
                        { name: `\`🟠\` \`suggestions-system\`\n\`🟠\` \`broadcast-system\`\n\`🟠\` \`time-system\``, value: `\u2003`, inline: true },
                        { name: 'نظام اقتراحات السيرفر.\nنظام البث في السيرفر.\nنظام الوقت في السيرفر.', value: `\u2003`, inline: true },
                        { name: `\u2003`, value: `\u2003`, inline: false },
                        { name: `\`🔴\` \`user-data\`\n\`🔴\` \`user-kick\`\n\`🔴\` \`user-ban\``, value: `\u2003`, inline: true },
                        { name: 'عرض بيانات الشخص على السيرفر\nطرد شخص من السيرفر\nحظر شخص من السيرفر.', value: `\u2003`, inline: true },
                        { name: `\u2003`, value: `\u2003`, inline: false },
                        { name: `\`🔴\` \`show-room\`\n\`🔴\` \`hide-room\`\n\`🔴\` \`look-room\``, value: `\u2003`, inline: true },
                        { name: 'إظهار القناة.\nإخفاء القناة.\nتعطيل إرسال الرسائل في القنوات.', value: `\u2003`, inline: true },
                    );

                await interaction.update({ embeds: [updatedEmbed] });
            } else if (interaction.values[0] === 'leveling_system') {
                const updatedEmbed = new MessageEmbed()
                    .setAuthor({ name: `Leveling System`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .addFields(
                        { name: `>  💬 الأمر`, value: `\u2003`, inline: true },
                        { name: `📜 الوصف`, value: `\u2003`, inline: true },
                        { name: `\u2003`, value: `\u2003`, inline: false },
                        { name: `\`🔴\` \`reset-leveling-server\`\n\`🟠\` \`reset-level-member\`\n\`🟠\` \`add-level\``, value: `\u2003`, inline: true },
                        { name: 'تصفير جميع مستويات الأعضاء في السيرفر.\nتصفير مستوى شخص معين.\nإضافة مستوى لشخص معين معي.', value: `\u2003`, inline: true },
                        { name: `\u2003`, value: `\u2003`, inline: false },
                        { name: `\`🟠\` \`add-xp\`\n\`🟢\` \`rank\`\n\`🟢\` \`top\``, value: `\u2003`, inline: true },
                        { name: 'إضافة نقاط خبرة لشخص معين معي.\nعرض ترتيبك في السيرفر.\nعرض أكثر الأعضاء نشاطًا على السيرفر.', value: `\u2003`, inline: true },
                        { name: `\u2003`, value: `\u2003`, inline: false },
                        { name: `\`🟢\` \`xp\``, value: `\u2003`, inline: true },
                        { name: 'عرض نقاط الخبرة الخاصة بك في السيرفر.', value: `\u2003`, inline: true },
                        { name: `\u2003`, value: `\u2003`, inline: false }
                    );

                await interaction.update({ embeds: [updatedEmbed] });
            } else if (interaction.values[0] === 'main_menu') {
                await interaction.update({ embeds: [embed] });
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                messageReply.edit({ components: [] });
            }
        });

        setTimeout(() => {
            messageReply.edit({ components: [] }).catch(console.error);
        }, 300000); // 300000 ms = 5 minutes
    },
};
