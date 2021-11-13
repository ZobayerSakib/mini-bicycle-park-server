const express = require('express');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
//oWKWpCTwhMqjOl5h
//bicyclePark

app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3ndc9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {

    try {
        await client.connect()
        console.log('database is connected')

        const database = client.db("bicycleStore");
        const bicycleCollection = database.collection("bicycles");
        const bicycleNewsCollection = database.collection("news");
        const bicycleReviewsCollection = database.collection("review");
        const bicycleCustomerCollection = database.collection("customers");

        //All Bikes showing by get Method

        app.get('/bikes', async (req, res) => {
            const query = bicycleCollection.find({});
            const bikes = await query.toArray();
            res.send(bikes);
        })

        //Post Method 
        app.post('/bikes', async (req, res) => {
            const newProduct = req.body;
            const result = await bicycleCollection.insertOne(newProduct);
            res.json(result);
        })

        //News showing server site method
        app.get('/news', async (req, res) => {
            const query = bicycleNewsCollection.find({});
            const news = await query.toArray();
            res.send(news);
        })

        //Reviews showing server site method
        app.get('/review', async (req, res) => {
            const query = bicycleReviewsCollection.find({});
            const reviews = await query.toArray();
            res.send(reviews);
        })
        //Post Method For Review
        app.post('/review', async (req, res) => {
            const newReview = req.body;
            const result = await bicycleReviewsCollection.insertOne(newReview);
            res.json(result);
        })


        app.get('/customers/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const user = await bicycleCustomerCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin })
        })
        //Customer Data Server Settings

        app.get('/customers', async (req, res) => {
            const query = bicycleCustomerCollection.find({});
            const result = await query.toArray();
            res.send(result);
        })

        app.post('/customers', async (req, res) => {
            const newCustomer = req.body;
            const result = await bicycleCustomerCollection.insertOne(newCustomer);
            res.json(result);
        })

        app.put('/customers/admin', async (req, res) => {
            const newCustomer = req.body;
            console.log('put', newCustomer)
            const filter = { email: newCustomer.email }

            const updateInfo = { $set: { role: 'admin' } }
            const result = await bicycleCustomerCollection.updateOne(filter, updateInfo);
            res.json(result);
        })

        //Single Bike Selecting

        app.get('/purchase/:id', async (req, res) => {
            const bikeId = req.params.id;
            const query = { _id: ObjectId(bikeId) };
            const product = await bicycleCollection.findOne(query);
            res.send(product);
        })








    } finally {
        // await client.close()
    }

} run().catch(console.dir)










app.get('/', (req, res) => {
    res.send('Hello Bicycle park, Congratulations!!!')
})

app.listen(port, () => {
    console.log('Listening the port', port)
})