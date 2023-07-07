
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://Sushilsinghrathore1998:sx4ONqG0M9OaaM8j@cluster1.mqwoklf.mongodb.net/?retryWrites=true&w=majority";
const students = require('./students');
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    //await client.db("Test").command({ ping: 1 });
     //await client.db("School").createCollection("Students");
    var dbcoll= await client.db("School").collection("Students");
    await dbcoll.insertMany(students)
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
