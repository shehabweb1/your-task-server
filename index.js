const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// Middleware
app.use(express.json());
app.use(cors());

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
    const tasksCollection = client.db('yourTask').collection('tasks');

    app.post("/api/users", async (req, res)=>{
      const cursor = req.body;
      const result = await userCollection.insertOne(cursor);
      res.send(result);
    })

    app.get("/api/users", async (req, res)=>{
      const result = await userCollection.find().toArray();
      res.send(result);
    })

    
    app.post('/api/tasks', async (req, res) => {
      const addTask = req.body;
      const result = await tasksCollection.insertOne(addTask);
      res.send(result);
    });
    
    app.get('/api/tasks/:email', async (req, res) => {
      const query = { email: req.params.email }
      const result = await tasksCollection.find(query).toArray();
      res.send(result);
    });
  
    app.patch('/api/tasks/:id', async (req, res) => {
      const { category } = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          category: category,
        },
      };
      const result = await tasksCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.put('/api/tasks/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedTask = req.body;
      const updatedDoc = {
        $set: {
          ...updatedTask,
        },
      };
      const result = await tasksCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    app.delete('/api/tasks/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await tasksCollection.deleteOne(query);
      res.send(result);
    });


  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send("Welcome to YourTask Server");
})
 
app.listen(port, () => {
  console.log(`web server listening on port ${port}`)
})