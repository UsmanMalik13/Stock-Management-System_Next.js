//Importing MongoClient from MongoDb
import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

//Get method for fetching the items.
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const searchText = searchParams.get('searchText') || '';
    const searchCriteria = searchParams.get('searchCriteria') || 'name';

    const uri = "mongodb+srv://testuser:V4PPDxYsgywVK1Iq@practicecluster.zrtgihz.mongodb.net/?retryWrites=true&w=majority&appName=PracticeCluster";
    const client = new MongoClient(uri);
    try {
        const database = client.db('practiceproject');
        const inventory = database.collection('inventory');

        const pipeline = [
            {
                $match: {
                    $or: [
                      { name: { $regex: searchText, $options: 'i' } },
                      { quantity: { $regex: searchText, $options: 'i' } },
                      { price: { $regex: searchText, $options: 'i' } }
                    ]
                  }
            }
        ];

        const products = await inventory.aggregate(pipeline).toArray();
        //console.log(products);

        return NextResponse.json({ success: true, products });
    } finally {
        await client.close();
    }
}