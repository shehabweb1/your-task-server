const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
 

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@learning.axf2sgn.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    
    const userCollection = client.db("yourTask").collection("users");

    app.post("/api/users", async (req, res)=>{
      const cursor = req.body;
      const result = await userCollection.insertOne(cursor);
      res.send(result);
    })

    app.get("/api/users", async (req, res)=>{
      const result = await userCollection.find(cursor).toArray();
      res.send(result);
    })


  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', function(req, res){
  res.send("Server is running")
});
 
app.listen(port, () => {
  console.log(`web server listening on port ${port}`)
})