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

        //get all review
        app.get('/allReview', async (req, res) => {
            const result = await Review.find({}).sort({ time: -1 }).toArray();
            res.send(result);
        });

        //get all my review
        app.get('/myReview', async (req, res) => {
            // console.log(req.query.email);
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                };
            }
            const result = await Review.find(query).toArray();
            res.send(result);
        });

        //delete a review
        app.delete('/deleteReview/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await Review.deleteOne(query);
            res.send(result);
        });

        //update a review
        app.put('/updateReview/:id', async (req, res) => {
            const id = req.params.id;
            const message = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    comment: message.message,
                    edited: true
                },
            };
            const result = await Review.updateOne(filter, updateDoc, options);
            res.send(result);
        });

        //add a service
        app.post('/addService', async (req, res) => {
            const service = req.body;
            const result = await Services.insertOne(service);
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