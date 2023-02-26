const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// midleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.PASSWORD}@cluster0.6jo974x.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


app.get('/', (req, res) => {
    res.send('hellow world');
});

async function run() {
    try {
        const Services = client.db('touristService').collection('services');
        const Review = client.db('touristService').collection('review');

        //get limit data 
        app.get('/limitServices', async (req, res) => {
            const cursor = Services.find({}).sort({ date: -1 });
            const result = await cursor.limit(3).toArray();
            res.send(result);
        });
        //get all service data 
        app.get('/allServices', async (req, res) => {
            const cursor = Services.find({});
            const result = await cursor.toArray();
            res.send(result);
        });

        //get all service data 
        app.get('/serviceDetails/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await Services.findOne(query);
            res.send(result);
        });

        //add a review
        app.post('/addReview', async (req, res) => {
            const review = req.body;
            const result = await Review.insertOne(review);
            res.send(result);
        });


    }
    finally {

    }
}

run().catch(error => console.log(error));


app.listen(port, () => {
    console.log('code is running');
});