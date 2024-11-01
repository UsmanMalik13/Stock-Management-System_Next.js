// Import the necessary modules
import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

// Define the DELETE method for deleting a product
export async function POST(request) {
    console.log("In!");

    let body = await request.json();
    
    // Get the product ID from the request parameters
    const { productToDeleteId } = body;

    // Replace the uri string with your MongoDB connection string
    const uri = "mongodb+srv://testuser:V4PPDxYsgywVK1Iq@practicecluster.zrtgihz.mongodb.net/?retryWrites=true&w=majority&appName=PracticeCluster";

    // Initialize the MongoDB client
    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB database
        await client.connect();

        // Get the database and inventory collection
        const database = client.db('practiceproject');
        const inventory = database.collection('inventory');

        // Convert the provided ID string to a MongoDB ObjectId
        const objectId = ObjectId.createFromHexString(productToDeleteId);

        // Delete the product with the specified ID
        const result = await inventory.deleteOne({ _id: objectId });

        // Check if the product was successfully deleted
        if (result.deletedCount === 1) {
            // Return a success message
            return NextResponse.json({ message: 'Product deleted successfully.'});
        } else {
            // Return an error message if the product was not found
            return NextResponse.json({ message: 'Product deleted successfully.'});
        }
    } catch (error) {
        // Log any errors that occur during the deletion process
        console.error('Error deleting product:', error);
        // Return an error response
        return { error: 'An error occurred while deleting the product.' };
    } finally {
        // Close the MongoDB client connection
        await client.close();
    }
}
