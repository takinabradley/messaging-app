import User from "../models/User.js"

const isAvailableUsername = async (username) => {
  let user
  try {
    user = await User.findOne({ username })
  } catch (e) {
    // if there's a problem fetching from the db, communicate it to the user
    throw new Error("Problem checking username. Please try again later.")
  }

  if (user) throw new Error("username taken")
}

export default isAvailableUsername
