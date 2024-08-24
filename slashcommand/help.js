const { MessageEmbed } = require('discord.js');
const {
    prefix,
    server_banner_id,
    channel_info_id,
    edit_message_id,
    message_info_id,
    test_welcome_id,
    user_banner_idd,
    server_image_id,
    server_info_id,
    emoji_list_id,
    role_info_id,
    role_list_id,
    user_info_id,
    avatar_id,
    clear_id,
    ping_id,
    say_id,
    tax_id,
    bot_id,
} = require('../config.json');

module.exports = {
    name: 'help',
    description: 'لسته بجميع أوامر البوت.',
    async execute(interaction) {
      
        let zap = "\`⚡ استجابة البرق\`";
        let green = "\`🟢 استجابة جيدة\`";
        let yellow = "\`🟡 استجابة معتدلة\`";
        let red = "\`🔴 استجابة بطيئه\`";

        var botState = zap;
        var apiState = zap;
        var timediff = zap;

        let apiPing = interaction.client.ws.ping;
        let botPing = Math.floor(Date.now() - interaction.createdTimestamp);

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
            .setTimestamp()
            .setAuthor({ name: `${interaction.client.user.username} أهلاً بكم في البوت الخاص بالـ`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`> **🤖 قواعد استخدام أوامر البوت**\n\n1. ⚠️ تجنب إرسال الأوامر بشكل متكرر للحفاظ على أداء البوت واستقرار السيرفر.\n2. 📌 تعريف عام للأوامر : \`🟢\` : عام | \`🟠\` : إداري | \`🔴\` : تجريبي.\n3. 🚫 قصر الأوامر على القنوات المناسبة للحفاظ على تدفق المحادثات.\n4. 🛑 احترام قواعد السيرفر وتجنب الأوامر المزعجة أو المسيئة.\n5. 🛠 إذا واجهت مشكلة، يرجى التحدث مع المطور.\n6. 🔧 \` ${prefix} \` : البرفكس لاستخدام أوامر البوت.\n7. 🎛 حالة البوت: ${botState}\n8. 📚 جميع الأوامر : 40.`)
            .addFields(
                { name: `\u2003`, value: `\u2003`, inline: false },
                { name: `> 💬 الأوامر`, value: `\u2003`, inline: true },
                { name: `📜 الوصف`, value: `\u2003`, inline: true },
                { name: `\u2003`, value: `\u2003`, inline: false },
                { name: `\`🟢\` </server-banner:${server_banner_id}>\n\`🟠\` </test-welcome:${test_welcome_id}>\n\`🟠\` </edit-message:${edit_message_id}>\n`, value: `\u2003`, inline: true },
                { name: 'عرض صورة بانر السيرفر.\nاختبار رسالة الترحيب.\nتعديل محتوى رسالة موجودة.', value: `\u2003`, inline: true },
                { name: `\u2003`, value: `\u2003`, inline: false },
                { name: `\`🟢\` </message-info:${message_info_id}>\n\`🟢\` </channel-info:${channel_info_id}>\n\`🟢\` </server-image:${server_image_id}>`, value: `\u2003`, inline: true },
                { name: 'عرض معلومات عن رسالة محددة.\nعرض معلومات مفصلة عن القناة.\nعرض صورة السيرفر', value: `\u2003`, inline: true },
                { name: `\u2003`, value: `\u2003`, inline: false },
                { name: `\`🟢\` </user-banner:${user_banner_idd}>\n\`🟢\` </user-avatar:${avatar_id}>\n\`🟢\` </server-info:${server_info_id}>`, value: `\u2003`, inline: true },
                { name: 'استرجاع صورة بانر المستخدم.\nاسترجاع صورة الافتراضية للمستخدم.\nتوفير معلومات مفصلة عن السيرفر.', value: `\u2003`, inline: true },
                { name: `\u2003`, value: `\u2003`, inline: false },
                { name: `\`🟢\` </emoji-list:${emoji_list_id}>\n\`🟢\` </user-info:${user_info_id}>\n\`🟢\` </role-info:${role_info_id}>`, value: `\u2003`, inline: true },
                { name: 'عرض قائمة بجميع الرموز التعبيرية المتاحة على السيرفر.\nاسترجاع ملخص مفصل لمعلومات المستخدم.\nتوفير معلومات عن دور محدد.', value: `\u2003`, inline: true },
                { name: `\u2003`, value: `\u2003`, inline: false },
                { name: `\`🟢\` </role-list:${role_list_id}>\n\`🟠\` </clear:${clear_id}>\n\`🟢\` </ping:${ping_id}>`, value: `\u2003`, inline: true },
                { name: 'توفير معلومات مفصلة عن دور معين.\nمسح الرسائل من المحادثة.\nفحص تأخر البوت والواجهة البرمجية (API).', value: `\u2003`, inline: true },
                { name: `\u2003`, value: `\u2003`, inline: false },
                { name: `\`🟠\` </say:${say_id}>\n\`🟢\` </tax:${tax_id}>\n\`🟢\` </bot:${bot_id}>`, value: `\u2003`, inline: true },
                { name: 'تكرار نصك.\nحساب ضريبة ائتمان ProBot\nعرض معلومات حول البوت.', value: `\u2003`, inline: true }
            );

        interaction.reply({ embeds: [embed] });
    },
};
