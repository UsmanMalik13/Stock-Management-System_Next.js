//Importing MongoClient from MongoDb
import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

export async function GET(request) {

    // Replace the uri string with your connection string.
    const uri = "mongodb+srv://testuser:V4PPDxYsgywVK1Iq@practicecluster.zrtgihz.mongodb.net/?retryWrites=true&w=majority&appName=PracticeCluster";
    const client = new MongoClient(uri);
    try {
        const database = client.db('practiceproject');
        const inventory = database.collection('inventory');
        
        // Query for a movie that has the title 'Back to the Future'
        const query = {  };
        const inventoryItem = await inventory.findOne(query);
        console.log(inventoryItem);

        return NextResponse.json({ message: 'Hello World' });
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}