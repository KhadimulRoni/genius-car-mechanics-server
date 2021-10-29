const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;


const app = express();
const port = process.env.PORT || 5000 ;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uanva.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

/* ----we should console log for confirmation 'working or not'--- */
// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


/* ----connection with database---- */
async function run () {
    try{
        await client.connect();
        // console.log('connected to database');
        const database = client.db('carMechanic');
        const serviceCollection = database.collection('services');
        
        // Get API
        app.get('/services', async(req,res)=>{
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        // Get single service
        app.get('/services/:id', async (req,res)=>{
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            console.log('getting specific service',id);
            const service = await serviceCollection.findOne(query);
            res.json(service);
        })


        // post API
        app.post('/services',async(req,res)=>{

            const service = req.body;
            console.log('hit the post',service)
            // const service = {
            //     "name": "ENGINE DIAGNOSTIC",
            //     "price": "300",
            //     "description": "Lorem ipsum dolor sit amet, consectetu radipisi cing elitBeatae autem aperiam nequ quaera molestias voluptatibus harum ametipsa.",
            //     "img": "https://i.ibb.co/dGDkr4v/1.jpg"
            // }

            const result = await serviceCollection.insertOne(service); 
            console.log(result);

            res.send(result)
        });

        // Delete APi
        app.delete('/services/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await serviceCollection.deleteOne(query);
            res.json(result)
        })

    }
    finally{
        // await client.close();
    }
}

/* ---must call the function and catch error--- */
run().catch(console.dir)



/* --server will send request & i will return on basis of request ---*/
app.get('/', (req, res) => {
    /* ---As i am sending data on basis of server request , so i will use'res.send' not 'res.req'----- */
    res.send('running Genius Server')
});



/* ----app will listen in one port..in order to listen from the port I will have to declare a 'port' and a call back function to get know from nodemon---*/
app.listen(port, () => {
    console.log('Running my server on port',port)
});

