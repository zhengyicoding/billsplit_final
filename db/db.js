import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

/**
 * Executes a database operation with proper connection handling
 * @param {string} collectionName - The collection to operate on
 * @param {Function} operation - The operation to perform (receives collection object)
 * @returns {Promise<any>} - The result of the operation
 */
export async function withCollection(collectionName, operation) {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection(collectionName);

    return await operation(collection);
  } catch (error) {
    console.error(`Error in ${collectionName} collection operation:`, error);
    throw error;
  } finally {
    await client.close();
  }
}

/**
 * Creates indexes for a collection
 * @param {string} collectionName - The collection to create indexes for
 * @param {Array} indexes - Array of index specifications
 */
export async function createIndexes(collectionName, indexes) {
  return withCollection(collectionName, async (collection) => {
    try {
      const results = [];
      for (const index of indexes) {
        results.push(await collection.createIndex(index.key, index.options));
      }
      return results;
    } catch (error) {
      console.error(`Failed to create indexes for ${collectionName}`, error);
      throw error;
    }
  });
}
