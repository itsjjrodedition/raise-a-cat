const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoClient = new MongoClient(process.env.mongodburi, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const qol = require('qol-date-functions');

module.exports = {
    name: 'play',
    execute: async (interaction, cat) => {
        mongoClient.connect().then(async () => {
            const query = { guild: interaction.guild.id }
            const db = mongoClient.db(process.env.db)
            const collection = db.collection(process.env.collection)

            var time = new Date();
            var nextDay = qol.addSeconds(time, 5);

            time = qol.toUnix(time)
            nextDay = qol.toUnix(nextDay)
            

            interaction.followUp({ content: `<t:${time}:R> | <t:${nextDay}:R>`, ephemeral: true })


        })
    }
}