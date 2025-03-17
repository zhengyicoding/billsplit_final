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

  // Generate random avatar URL based on ID or name
  const generateRandomAvatar = (id) => {
    // Using pravatar which is already in your codebase
    return `https://i.pravatar.cc/150?u=${id.slice(-8)}`;
  };

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
        // Use profilePic from request if available, otherwise use placeholder
        profilePic: friendData.profilePic || "placeholder",
        balance: 0,
        createdAt: new Date(),
      };

      const result = await collection.insertOne(friend);
      const newId = result.insertedId.toString();

      // If profilePic wasn't provided or was set to placeholder, generate a random one
      if (!friendData.profilePic || friend.profilePic === "placeholder") {
        const avatarUrl = generateRandomAvatar(newId, friendData.name);

        await collection.updateOne(
          { _id: result.insertedId },
          { $set: { profilePic: avatarUrl } }
        );

        friend.profilePic = avatarUrl;
      }

      // Return the updated friend document
      return {
        ...friend,
        _id: result.insertedId,
      };
    });
  };

  // Update a friend
  self.updateFriend = async (id, updateData) => {
    return withCollection(COL_NAME, async (collection) => {
      // Don't allow updating certain fields
      const { ...safeUpdateData } = updateData;

      // If profilePic is empty string, generate a random one
      if (safeUpdateData.profilePic === "") {
        const friendObj = await self.getFriendById(id);
        safeUpdateData.profilePic = generateRandomAvatar(id, friendObj.name);
      }

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
