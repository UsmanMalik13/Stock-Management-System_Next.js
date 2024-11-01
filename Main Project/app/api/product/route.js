//Importing MongoClient from MongoDb
import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

//Get method for fetching the items.
export async function GET(request) {

    // Replace the uri string with your connection string.
    const uri = "mongodb+srv://testuser:V4PPDxYsgywVK1Iq@practicecluster.zrtgihz.mongodb.net/?retryWrites=true&w=majority&appName=PracticeCluster";
    const client = new MongoClient(uri);
    try {
        const database = client.db('practiceproject');
        const inventory = database.collection('inventory');
        
        // Query for fetching products from the database.
        const query = {  };
        const products = await inventory.find(query).toArray();

        return NextResponse.json({ products });
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}


//Post method for adding the items.
export async function POST(request) {
    // Get the body of the request. Basically the product details. It's important to always await the body in the form of json.
    let body = await request.json();

    // Replace the uri string with your connection string.
    const uri = "mongodb+srv://testuser:V4PPDxYsgywVK1Iq@practicecluster.zrtgihz.mongodb.net/?retryWrites=true&w=majority&appName=PracticeCluster";
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const database = client.db('practiceproject');
        const inventory = database.collection('inventory');
        
        // Check if a product with the same name already exists.
        const { name } = body;
        const existingProduct = await inventory.findOne({ name });

        if (existingProduct) {
            // If a product with the same name exists, return an error response.
            return NextResponse.json({ error: 'Product with the same name already exists' }, { status: 400 });
        }

        // If no product with the same name exists, insert the new product.
        const product = await inventory.insertOne(body);

        return NextResponse.json({ product, ok: true });
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
