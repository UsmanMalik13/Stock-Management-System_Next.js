// Import the necessary modules
import { MongoClient, ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

// Define the DELETE method for deleting a product
export async function POST(request) {
    console.log("In!");

    let body = await request.json();
    
    // Get the product ID from the request body
    const { productToDeleteId } = body;

    // Validate the product ID format
    if (!productToDeleteId || !ObjectId.isValid(productToDeleteId)) {
        return NextResponse.json({ message: 'Invalid product ID.' }, { status: 400 });
    }

    // Load the MongoDB connection string from environment variables
    const uri = process.env.MONGODB_URI; // Set your environment variable in .env file

    // Initialize the MongoDB client
    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB database
        await client.connect();

        // Get the database and inventory collection
        const database = client.db('practiceproject');
        const inventory = database.collection('inventory');

        // Convert the provided ID string to a MongoDB ObjectId
        const objectId = new ObjectId(productToDeleteId);

        // Delete the product with the specified ID
        const result = await inventory.deleteOne({ _id: objectId });

        // Check if the product was successfully deleted
        if (result.deletedCount === 1) {
            // Return a success message
            return NextResponse.json({ message: 'Product deleted successfully.' });
        } else {
            // Return an error message if the product was not found
            return NextResponse.json({ message: 'Product not found.' }, { status: 404 });
        }
    } catch (error) {
        // Log any errors that occur during the deletion process
        console.error('Error deleting product:', error);
        // Return an error response
        return NextResponse.json({ error: 'An error occurred while deleting the product.' }, { status: 500 });
    } finally {
        // Close the MongoDB client connection
        await client.close();
    }
}
