const { MongoClient } = require('mongodb');
const uri = process.env.uri;

async function main() {
    uri;

    const client = new MongoClient(uri);
    try {
        await client.connect();
    
        await listDatabases(client);
    
    } catch (e) {
        console.error(e);
    }
    finally {
        await client.close();
    }
 }

 main().catch(console.error);
 async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${Utopia}`));
};