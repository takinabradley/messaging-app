import { Schema, model, ObjectId } from "mongoose"
import FriendRequest from "./FriendRequest.js"

const FriendsListSchema = new Schema({
  friends: [{ type: ObjectId, ref: "User" }],
  requests: [{ type: ObjectId, ref: FriendRequest }],
  blocked: [{ type: ObjectId, ref: "User" }]
})

export default model("FriendsList", FriendsListSchema)
export { FriendsListSchema }
