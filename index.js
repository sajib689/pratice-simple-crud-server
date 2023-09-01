const { MongoClient, ObjectId } = require('mongodb');
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const uri = "mongodb+srv://simple-crud:simple-crud@cluster0.2m0rny5.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  useNewUrlParser: true,  // Added this option
  useUnifiedTopology: true, // Added this option
});

async function run() {
  try {
    await client.connect();
    const database = client.db("usersDatabase");
    const usersCollection = database.collection("users");
// The post api for data send in mongoDb database
    app.post('/users', async(req, res) => {
      try {
        const user = req.body;
        const result = await usersCollection.insertOne(user);
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
    });
// The get api for get data from database to ui
app.get('/users', async (req, res) => {
  const result = await usersCollection.find().toArray()
  res.send(result)
})

// The delete api for get Delete data from database to ui
app.delete('/users/:id', async(req, res) => {
  const id = req.params.id
  const query = {_id: new ObjectId(id)}
  const result = await usersCollection.deleteOne(query)
  res.send(result)
})
// The get api for called a single data by id from the database
app.get('/users/:id', async(req, res) => {
  const id = req.params.id
  const query = { _id: new ObjectId(id)}
  const user = await usersCollection.findOne(query)
  res.send(user)
})
// The put api for update data from ui to database
app.put('/users/:id', async(req, res) => {
  const id = req.params.id
  const updateUser = req.body
  const filter = {_id: new ObjectId(id)}
  const options = {upsert: true}
  const updatedUser = {
    $set: {
      firstName: updateUser.firstName,
      lastName: updateUser.lastName,
      email: updateUser.email,

    }
  }
  const result = await usersCollection.updateOne(filter,updatedUser,options)
  res.send(result)
})
// app.put('/users/:id', async(req, res) => {
//   const id = req.params.id
//   const updateUser = req.body
//   const filter = {_id: new ObjectId(id)}
//   const options ={upsert: true}
//   const updatedUser = {
//     $set: {
//       firstName: updateUser.firstName,
//       lastName: updateUser.lastName,
//       email: updateUser.email,
//     }
//   }
//   const result = await usersCollection.updateOne(filter,updatedUser,options)
//   res.send(result)
// })
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Do not close the client here; you want it to stay connected while the server is running
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Welcome the server is running');
});

app.listen(port, () => {
  console.log(`The server is running on ${port}`);
});
