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
    // Ensure id is a string and get last 8 characters safely
    const idString = String(id);
    const idSuffix = idString.length >= 8 ? idString.slice(-8) : idString;

    // Using pravatar which is already in your codebase
    return `https://i.pravatar.cc/150?u=${idSuffix}`;
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
      return collection.findOne({ _id: ObjectId.createFromHexString(id) });
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

  // Update a friend with fixed profilePic handling
  self.updateFriend = async (id, updateData) => {
    return withCollection(COL_NAME, async (collection) => {
      try {
        console.log(`Attempting to update friend with ID: ${id}`);
        console.log("Update data:", updateData);

        // Create ObjectId
        const objectId = new ObjectId(id);
        console.log(`Successfully created ObjectId: ${objectId}`);

        // Check if friend exists
        const existingFriend = await collection.findOne({ _id: objectId });

        if (!existingFriend) {
          console.error(`No friend found with ID: ${id}`);
          throw new Error(`Friend with ID ${id} not found`);
        }

        console.log("Found existing friend:", existingFriend);

        // Process update data
        const safeUpdateData = {};

        if (updateData.name !== undefined) {
          safeUpdateData.name = updateData.name;
        }

        if (updateData.profilePic !== undefined) {
          safeUpdateData.profilePic = updateData.profilePic;
        }

        console.log("Safe update data:", safeUpdateData);

        // Try multiple approaches for different MongoDB versions

        // Approach 1: Use updateOne instead of findOneAndUpdate
        const updateResult = await collection.updateOne(
          { _id: objectId },
          { $set: safeUpdateData }
        );

        console.log("Update result:", updateResult);

        if (!updateResult.matchedCount) {
          throw new Error(`Friend with ID ${id} not found`);
        }

        if (!updateResult.modifiedCount) {
          console.warn(
            "Warning: Document found but not modified. This could be because the data didn't change."
          );
        }

        // Fetch the updated document separately
        const updatedFriend = await collection.findOne({ _id: objectId });
        console.log("Updated friend:", updatedFriend);

        return updatedFriend;
      } catch (error) {
        console.error(`Error updating friend ${id}:`, error);
        throw error;
      }
    });
  };

  // Delete a friend
  self.deleteFriend = async (id) => {
    return withCollection(COL_NAME, async (collection) => {
      const result = await collection.deleteOne({
        _id: ObjectId.createFromHexString(id),
      });
      return result.deletedCount > 0;
    });
  };

  // Update friend's balance
  self.updateBalance = async (id, newBalance) => {
    return withCollection(COL_NAME, async (collection) => {
      const result = await collection.findOneAndUpdate(
        { _id: ObjectId.createFromHexString(id) },
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
        { _id: ObjectId.createFromHexString(id) },
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
