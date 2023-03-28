const catData = require('../functions/catData.js')

async function execute(interaction, collection, query, dmMessage) {
    
    
    const { catDisplayEmbed, buttons1, buttons2, buttons3, catName, age, hunger, thirst, rest, bladder, mood, cleanliness } = await catData.execute(collection, query, interaction)
    
    if(!catName){
        setTimeout(() => {
            if(dmMessage){
                dmMessage.edit({ content: `No cat found! Run </cat:1068277148181340170> to create one :)`, embeds: [], components: [] })
            } else {
                interaction.message.edit({ content: `No cat found! Run </cat:1068277148181340170> to create one :)`, embeds: [], components: [buttons3] })
                interaction.deleteReply()
            }
        }, 2000);
        return
    }else{
        if(dmMessage){
            dmMessage.edit({ content: dmMessage.content, embeds: [catDisplayEmbed], components: [buttons1, buttons2, buttons3] })
        } else {
            interaction.message.edit({
                content: '',
                embeds: [catDisplayEmbed], 
                components: [buttons1, buttons2, buttons3]
            });
        }
        interaction.deleteReply()
    }
}


module.exports = { execute };
