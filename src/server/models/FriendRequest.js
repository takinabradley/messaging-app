import { Schema, model, ObjectId } from "mongoose"

const FriendRequestSchema = new Schema({
  issuer: { type: ObjectId, ref: "User", required: true },
  reciever: { type: ObjectId, ref: "User", required: true },
  status: {
    type: String,
    default: "pending",
    required: true,
    enum: ["pending", "rejected", "accepted"]
  }
})

export default model("FriendRequest", FriendRequestSchema)
