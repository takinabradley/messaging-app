import { Schema, ObjectId, model } from "mongoose"
import { FriendsListSchema } from "./FriendsList.js"
import { Buffer } from "node:buffer"
import { readFile } from "node:fs/promises"
import path from "node:path"

const accountSvg = readFile(
  path.resolve(import.meta.dirname, "../../../public/account.svg")
)
/* accountSvg.then((data) => {
  console.log(data.toString())
}) */

await accountSvg

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true }, // must validate this
  hash: { type: String, required: true },
  displayname: {
    type: String,
    required: true,
    default: function () {
      return this.username
    }
  },
  img: { type: Buffer, required: true, default: await accountSvg },
  profileDescription: { type: String, required: true, default: " " },
  FriendsList: { type: FriendsListSchema, default: () => ({}) }
})

export default model("User", UserSchema)
