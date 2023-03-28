const catData = require('../functions/catData.js')
const refresh = require('../functions/refreshMessage.js')
const changeValues = require('../functions/changeValue.js')

async function execute(interaction, collection, query, dmMessage) {
    
    var { catDisplayEmbed, buttons1, buttons2, buttons3, catName, age, hunger, thirst, rest, bladder, mood, cleanliness, disabledButtons1, disabledButtons2, disabledButtons3 } = await catData.execute(collection, query, interaction)

    age ++
    hunger = hunger - 8
    thirst = thirst - 4
    rest = rest - 1

    interaction.message.content = ``

    catDisplayEmbed.setDescription(`**${catName}** is playing with <@${interaction.user.id}>!`)

    if(!dmMessage){
        interaction.message.edit({
            embeds: [catDisplayEmbed], 
            components: [disabledButtons1, disabledButtons2, disabledButtons3]
        });
    } else {
        dmMessage.edit({
            embeds: [catDisplayEmbed],
            components: [disabledButtons1, disabledButtons2, disabledButtons3]
        })
    }

    setTimeout(async () => {
        if(Math.sign(hunger) == -1 || Math.sign(hunger) == 0){
            hunger = 0
            if(!dmMessage){
                interaction.message.content += `**${catName}** is hungry! `
                interaction.message.edit({
                    content: interaction.message.content,
                    embeds: [catDisplayEmbed], 
                    components: [buttons1, buttons2, buttons3]
                });
            } else {
                dmMessage.edit({
                    content: interaction.message.content,
                    embeds: [catDisplayEmbed],
                    components: [buttons1, buttons2, buttons3]
                })
            }
        }
        if(Math.sign(thirst) == -1 || Math.sign(thirst) == 0){
            thirst = 0
            if(!dmMessage){
                interaction.message.content += `**${catName}** is thirsty! `
                console.log(interaction.message.content)
                interaction.message.edit({
                    content: interaction.message.content,
                    embeds: [catDisplayEmbed], 
                    components: [buttons1, buttons2, buttons3]
                });
            } else {
                dmMessage.edit({
                    content: interaction.message.content,
                    embeds: [catDisplayEmbed],
                    components: [buttons1, buttons2, buttons3]
                })
            }
        }
        if(Math.sign(rest) == -1 || Math.sign(rest) == 0){
            rest = 0
            if(!dmMessage){
                interaction.message.content += `**${catName}** is tired! `
                console.log(interaction.message.content)
                interaction.message.edit({
                    content: interaction.message.content,
                    embeds: [catDisplayEmbed], 
                    components: [buttons1, buttons2, buttons3]
                });
            } else {
                dmMessage.edit({
                    content: interaction.message.content,
                    embeds: [catDisplayEmbed],
                    components: [buttons1, buttons2, buttons3]
                })
            }
        }
        if(Math.sign(hunger) != -1 && Math.sign(hunger) != 0 && Math.sign(thirst) != -1 && Math.sign(thirst) != 0 && Math.sign(rest) != -1 && Math.sign(rest) != 0){
            changeValues.execute(interaction, collection, query, age, 'age')
            changeValues.execute(interaction, collection, query, hunger, 'hunger')
            changeValues.execute(interaction, collection, query, thirst, 'thirst')
            changeValues.execute(interaction, collection, query, rest, 'rest')
        } else {
            return
        }
    }, 1000)
    setTimeout(async () => {
        refresh.execute(interaction, collection, query, dmMessage)
    }, 2000)

}

module.exports = { execute };