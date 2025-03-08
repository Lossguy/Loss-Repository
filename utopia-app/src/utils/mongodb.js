const { MongoClient } = require("mongodb");

async function main() {
  const uri = ;
  if (!uri) {
    console.log(uri)
    throw new Error('Missing environment variable: "URI"');
  }

  let client;

  try {
    client = new MongoClient(uri, {
      tls: true,
      tlsAllowInvalidCertificates: true,
    });
    await client.connect();
    console.log("Connected to MongoDB", client.db);
  } catch (e) {
    console.error("MongoDB Connection Error:", e);
  } finally {
    if (client) await client.close(); // Close only if defined
  }
}

main().catch(console.error);
