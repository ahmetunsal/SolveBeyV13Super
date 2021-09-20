const { MessageActionRow, MessageEmbed  } = require('discord.js');
const { MessageButton } = require('discord-buttons');
const settings = require('../Settings/settings.json');
const {vectraDatabase} = require('../Functions/vectraDatabase')



module.exports = {
    name: "k",
    description: "br",
    options: [ // Types: 1, 2, 3, 4, 5, 6, 7
        { type: 1, name: 'user', description: 'Mention user.' },
        { type: 4, name: 'name', description: 'İsim yaz.' },
        { type: 5, name: 'age', description: 'Yaş yaz.'}
    ],
    run: async (client, interaction) => {
        
        const name = interaction.options.getString('name');
        const user = interaction.options.getUser('user');
        const age = interaction.options.getInteger('age');


        /*
         interaction.options.get<optionType>('<optionName>');
        */

        if(!interaction.member.roles.cache.some(x => settings.RegisterHammer.includes(x.id)) && !interaction.member.permissions.has("MANAGE_ROLES")) return;
        if(!user) return interaction.reply({content: "Geçerli bir kullanıcı etiketlemelisin."})
        if(!name) return interaction.reply({content: "Bir isim girmelisin."})
        if(!age) return interaction.reply({content: "Bir yaş girmelisin."})

        let fix = user.user.username.includes(settings.Tag) ? settings.Tag : settings.Untag
        let name_2
        if(age) name_2 = `${fix} ${name} | ${age}`
        if(!age) name_2 = `${fix} ${name}`
        await user.setNickname(name_2);



        var button_1 = new MessageButton()
        .setID("MAN")
        .setLabel("🚹 Erkek")
        .setStyle("gray")

        var button_2 = new MessageButton()
        .setID("WOMAN")
        .setLabel("🚺 Kadın")
        .setStyle("gray")

        
        var button_3 = new MessageButton()
        .setID("isimDegisme")
        .setLabel("İsim Değiştirme")
        .setStyle("gray")
        
        let msgembed = new MessageEmbed()
        .setColor("RANDOM")
        .setAuthor('v13 Kayıt Deneme')
        .setDescription(`${user} kullanıcının adı başarıyla \`"${name_2}"\` olarak değiştirildi.\n\nLütfen 30 saniye alttaki butonlara basarak kullanıcının cinsiyetini belirleyin.\n\nKullanıcının eski isimlerine bakarak kaydetmeniz önerilir, eski isimler için \`${settings.botPrefix}isimler <user>\``)
        .setFooter('Developed By Vectra!')
        .setTimestamp();

        let msg = await interaction.reply({ content: 'Kayıt', components : [ button_1, button_2, button_3 ], embeds: [msgembed]})
        var filter = (button) => button.clicker.user.id === interaction.member.id;
        let collector = await msg.createButtonCollector(filter, { time: 30000 })

        
      collector.on("collect", async (button) => {
        if(button.id === "MAN") {
            await vectraDatabase.man(user, interaction.member);
            await vectraDatabase.ykayit(interaction.member)
            await button.think(true)
            await button.reply.edit(`${user} adlı kullanıcı başarıyla <@&${settings.ManRole}> rolüyle kayıt edildi`)
        }
        if(button.id === "WOMAN") {            
        await vectraDatabase.woman(user, interaction.member);
        await vectraDatabase.ykayit(interaction.member)
        await button.think(true)
        await button.reply.edit(`${user} adlı kullanıcı başarıyla <@&${settings.WomanRole}> rolüyle kayıt edildi`)
    }
    if(button.id === "isimDegisme") {    
        await user.setNickname(name_2)        
        await vectraDatabase.username(user, interaction.member, name_2);
        await button.think(true)
        await button.reply.edit(`${user} adlı kullanıcının ismi başarıyla ${name_2} olarak değiştirildi.`)
    }
      });

    collector.on("end", async () => {
        msg.delete();
      });
    }
}