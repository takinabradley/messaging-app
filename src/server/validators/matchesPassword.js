const matchesPassword = (value, { req }) => {
  if (value !== req.body.password)
    throw new Error("does not match password field")
  return true
}

export default matchesPassword
