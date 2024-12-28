/* import { Schema, model, ObjectId } from "mongoose"
import User from "./User"
import Message from "./Chat"
import ChatRoomSettings from "./ChatRoomSettings"
import { Buffer } from "node:buffer"

const ChatroomSchema = new Schema({
  name: String,
  img: Buffer,
  members: [{ type: ObjectId, ref: User }],
  messages: [{ type: ObjectId, ref: Message }],
  settings: { type: ObjectId, ref: ChatRoomSettings }
})

export default model("Chatroom", ChatroomSchema)
 */