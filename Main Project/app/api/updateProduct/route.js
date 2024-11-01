import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

// Post method for updating the items.
export async function POST(request) {
    try {
        // Get the body of the request. Basically the product details. It's important to always await the body in the form of json.
        let body = await request.json();
        const { action, itemName } = body;

        // Replace the uri string with your connection string.
        const uri = "mongodb+srv://testuser:V4PPDxYsgywVK1Iq@practicecluster.zrtgihz.mongodb.net/?retryWrites=true&w=majority&appName=PracticeCluster";
        const client = new MongoClient(uri);

        await client.connect();
        const database = client.db('practiceproject');
        const inventory = database.collection('inventory');

        // Query for finding the product.
        const product = await inventory.findOne({ name: itemName });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        let newQuantity;
        if (action === 'add') {
            newQuantity = product.quantity + 1;
        } else if (action === 'subtract') {
            newQuantity = product.quantity - 1;
            if (newQuantity < 0) newQuantity = 0; // Ensure quantity doesn't go below 0
        } else {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        // Update the product quantity.
        const updatedProduct = await inventory.updateOne(
            { name: itemName },
            { $set: { quantity: newQuantity } }
        );

        await client.close();

        return NextResponse.json({ message: 'Product updated successfully', updatedProduct });
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json({ error: 'Error updating product' }, { status: 500 });
    }
}
