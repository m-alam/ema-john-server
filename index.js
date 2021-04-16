const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

const port = 5000
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vyn5p.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());

app.use(cors());

client.connect(err => {
  const collection = client.db("emaJohnStore").collection("products");
  const orderCollection = client.db("emaJohnStore").collection("orders");
  
  app.post('/addProduct', (req, res) => {
    const product =req.body;
    collection.insertMany(product)
    .then(result=>{
      res.send(result.insertedCount>0)
    })    
  })

  app.get('/products', (req, res) => {
    collection.find({}).limit(50)
    .toArray((err, documents)=>{
      res.send(documents);
    })    
  })

  app.get('/product/:key', (req, res) => {
    collection.find({key: req.params.key})
    .toArray((err, documents)=>{
      res.send(documents[0]);
    })    
  })

  app.post('/cartProduct', (req, res) => {
    const cartProduct = req.body;
    collection.find({key: {$in:cartProduct}})
    .toArray((err, documents)=>{
      res.send(documents);
    })    
  })

  app.post('/addOrder', (req, res) => {
    const order =req.body;
    orderCollection.insertOne(order)
    .then(result=>{
      res.send(result.insertedCount>0)
    })    
  })

});



app.listen(process.env.PORT || port)
  