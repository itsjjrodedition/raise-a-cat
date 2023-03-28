const catData = require('../functions/catData.js')
const refresh = require('../functions/refreshMessage.js')
const changeValues = require('../functions/changeValue.js')

async function execute(interaction, collection, query, dmMessage) {
    
    var { catDisplayEmbed, buttons1, buttons2, buttons3, catName, age, hunger, thirst, rest, bladder, mood, cleanliness, disabledButtons1, disabledButtons2, disabledButtons3 } = await catData.execute(collection, query, interaction)

    age ++
    hunger = 100

    catDisplayEmbed.setDescription(`**${catName}** is eating!`)

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

    setTimeout(() => {
        changeValues.execute(interaction, collection, query, hunger, 'hunger')
    }, 1000);
    setTimeout(async () => {
        refresh.execute(interaction, collection, query, dmMessage)
    }, 2000)

}

module.exports = { execute }