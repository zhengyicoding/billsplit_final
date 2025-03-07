import { ObjectId } from "mongodb";
import { withCollection, createIndexes } from "./db.js";

function FriendsCol() {
  const COL_NAME = "friends";
  const self = {};

  // Define indexes
  const indexes = [
    {
      key: { name: 1 },
      options: { collation: { locale: "en" } },
    },
    {
      key: { balance: 1 },
      options: {},
    },
    {
      key: { createdAt: -1 },
      options: {},
    },
  ];

  // Create indexes
  createIndexes(COL_NAME, indexes)
    .then(() => console.log(`Indexes created for ${COL_NAME} collection`))
    .catch((err) =>
      console.error(`Error creating indexes for ${COL_NAME}:`, err)
    );

  // Get all friends, sorted by name
  self.getAllFriends = async () => {
    return withCollection(COL_NAME, async (collection) => {
      return collection
        .find()
        .collation({ locale: "en" })
        .sort({ name: 1 })
        .toArray();
    });
  };

  // Get a specific friend by ID
  self.getFriendById = async (id) => {
    return withCollection(COL_NAME, async (collection) => {
      return collection.findOne({ _id: new ObjectId(id) });
    });
  };

  // Create a new friend
  self.createFriend = async (friendData) => {
    return withCollection(COL_NAME, async (collection) => {
      // First insert the friend document to get the MongoDB-generated ObjectId
      const friend = {
        name: friendData.name,
        avatar: "placeholder", // Temporary placeholder
        balance: 0,
        createdAt: new Date(),
      };

      const result = await collection.insertOne(friend);
      const newId = result.insertedId.toString();

      // Update the document with the avatar URL that includes the ObjectId
      const avatarUrl = `https://i.pravatar.cc/150?u=${newId}`;

      await collection.updateOne(
        { _id: result.insertedId },
        { $set: { avatar: avatarUrl } }
      );

      // Return the updated friend document
      return {
        ...friend,
        _id: result.insertedId,
        avatar: avatarUrl,
      };
    });
  };

  // Update a friend
  self.updateFriend = async (id, updateData) => {
    return withCollection(COL_NAME, async (collection) => {
      // Don't allow updating certain fields
      const { _id, balance, ...safeUpdateData } = updateData;

      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: safeUpdateData },
        { returnDocument: "after" }
      );

      return result.value;
    });
  };

  // Delete a friend
  self.deleteFriend = async (id) => {
    return withCollection(COL_NAME, async (collection) => {
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount > 0;
    });
  };

  // Update friend's balance
  self.updateBalance = async (id, newBalance) => {
    return withCollection(COL_NAME, async (collection) => {
      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { balance: newBalance } },
        { returnDocument: "after" }
      );

      return result.value;
    });
  };

  // Reset friend's balance to zero (for settlements)
  self.resetBalance = async (id) => {
    return withCollection(COL_NAME, async (collection) => {
      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { balance: 0 } },
        { returnDocument: "after" }
      );

      return result.value;
    });
  };

  return self;
}

const friendsCol = FriendsCol();
export default friendsCol;
