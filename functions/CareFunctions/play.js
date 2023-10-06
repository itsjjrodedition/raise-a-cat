const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoClient = new MongoClient(process.env.mongodburi, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const countdown = require('@j-dotjs/countdown-library');

module.exports = {
    name: 'play',
    execute: async (interaction, cat) => {
        mongoClient.connect().then(async () => {
            const query = { guild: interaction.guild.id }
            const db = mongoClient.db(process.env.db)
            const collection = db.collection(process.env.collection)

            var time = new Date();
            var nextDay = countdown.addSeconds(time, 5);

            time = countdown.toUnix(time)
            nextDay = countdown.toUnix(nextDay)
            

            interaction.followUp({ content: `<t:${time}:R> | <t:${nextDay}:R>`, ephemeral: true })


        })
    }
}