async function execute(interaction, collection, query, value, attribute, remove) {
    if(remove){
      const removeField = {
        $unset: {
          [attribute]: value
        },
      };

      var result = await collection.updateMany(query, removeField);
    } else {
      const updateDoc = {
          $set: {
            [attribute]: value
          },
        };
      var result = await collection.updateMany(query, updateDoc);

      console.log(`${result.matchedCount} document(s) were updated.`);
    }
}

module.exports = { execute };