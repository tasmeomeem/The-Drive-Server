const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors=require('cors');
const jwt = require('jsonwebtoken');
require ('dotenv').config();
const app = express()
const port = process.env.PORT || 3500;

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mw8og2s.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)

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

    //about get
    const aboutCollection = client.db('AboutUs').collection('about');
    app.get('/about', async(req,res)=>{
      const cursor = aboutCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    //testimonial get
    const reviewCollection = client.db('Testimonial').collection('review');
    app.get('/review', async(req,res)=>{
      const cursor = reviewCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    //car details get
    const carCollection = client.db('carDB').collection('cars');
    const cartCollection = client.db('carDB').collection('cart');
    app.get('/cars', async(req,res)=>{
      const cursor = carCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get("/cars/:brand", async(req,res)=>{
      const brand= req.params.brand;
      const query = { brand : brand }
      const cursor = carCollection.find(query);
      const result = await cursor.toArray();
      console.log(result);
      // const result = await carCollection.find(query).toArray();
      res.send(result);
    })

    app.post('/cars', async(req,res)=>{
      const addCar = req.body;
      console.log(addCar);
      const result = await carCollection.insertOne(addCar);
      res.send(result)
    })

    //brand logo//
    const brandCollection= client.db('Brands').collection('brands');
    app.get ('/brands',async(req,res)=>{
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get ('/brands/:brand', async(req,res)=>{
      const brand = req.params.brand;
      const query = {Brand_name: brand }
      
      const cursor = brandCollection.find(query)
      const result = await cursor.toArray();
      console.log(brand)
      res.send(result);
      
    })

    app.get('/products/:id',async(req,res)=>{
      const id = req.params.id;
      const filter = {_id:new ObjectId(id)}
      const result = await carCollection.findOne(filter)
      res.send(result)
    })

    app.post('/addToCart', async(req,res)=>{
      const addCart = req.body;
      
      const result = await cartCollection.insertOne(addCart);
      res.send(result)
    })
    
    // app.post('/jwt', async(req,res)=>{
    //   const user = req.body;
    //   console.log(user);
    //   res.send(user)
    // });

    app.get('/My-Carts',async(req,res)=>{
      // const email = req.params.email
      // const query = {user:email}
      const result = await cartCollection.find().toArray()
      res.send(result)
    })

    app.get('/allCar',async(req,res)=>{
      
      const result = await carCollection.find().toArray()
      res.send(result)
    })

    app.delete('/delete/:id', async(req,res)=>{
      const id= req.params.id
      const query = {_id:new ObjectId(id)}
      const result = await cartCollection.deleteOne(query)
      res.send(result)
    })

    app.get('/update/:id',async(req,res)=>{
      const id = req.params.id
      const query = {_id:new ObjectId(id)}
      const result = await carCollection.findOne(query)
      res.send(result)
    })

    app.put('/updateProduct/:id',async(req,res)=>{
      const id = req.params.id
      const updateProduct = req.body
      const filter = {_id:new ObjectId(id)}
      
      const options = {upsert:true}
      const newProduct = {
        $set:{
          price:
          updateProduct.price,
          photo: 
          updateProduct.photo,
          brand:
          updateProduct.brand,
          model:
          updateProduct.model,
          rating:
          updateProduct.rating,
          details:
          updateProduct.details}
      }
      const result = await carCollection.updateOne(filter,newProduct,options)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('assingment is running')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})