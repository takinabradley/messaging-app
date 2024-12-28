/* import { Schema, model, ObjectId } from "mongoose"
import { Buffer } from "node:buffer"
import User from "./User"

const MessageSchema = new Schema({
  text: { type: String, required: true },
  media: Buffer,
  date: { type: Date, required: true },
  user: {
    type: ObjectId,
    ref: User,
    required: true
  }
})

export default model("Message", MessageSchema)
 */