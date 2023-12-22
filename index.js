const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion } = require('mongodb');


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

    app.post('/jwt', async(req, res)=>{
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN, {expiresIn: 3600000})
      res.send({token});
    });

    const verifyToken = (req, res, next) => {
      if(!req.headers.authorization){
        return res.status(401).send({message: "unauthorized access"});
      }
      const token = req.headers.authorization.split(' ')[1];
      jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
        if(err){
          return res.status(401).send({message: "unauthorized access"})
        }
        req.decoded = decoded;
        next();
      });
    }


    app.post("/api/users", async (req, res)=>{
      const cursor = req.body;
      const result = await userCollection.insertOne(cursor);
      res.send(result);
    })

    app.get("/api/users", async (req, res)=>{
      const result = await userCollection.find(cursor).toArray();
      res.send(result);
    })

    app.post('/api/tasks', async (req, res) => {
      const addTask = req.body;
      const result = await tasksCollection.insertOne(addTask);
      res.send(result);
    });


    app.get('/api/tasks', async (req, res) => {
      let query = {};
      const email = req.query.email;
      if (email) {
        query.email = email;
      }
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