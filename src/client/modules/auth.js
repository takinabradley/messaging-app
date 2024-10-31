const auth = {
  get isLoggedIn() {
    try {
      return fetch(window.location.origin + "/api/loginstatus")
        .then((res) => res.json())
        .then((json) => json.loggedIn)
    } catch (e) {
      return false
    }
  },
  async register(username, password, verifyPassword) {
    try {
      const res = await fetch(window.location.origin + "/api/signup", {
        method: "POST",
        body: JSON.stringify({ username, password, verifyPassword }),
        headers: {
          "content-type": "application/json"
        }
      })

      return await res.json()
    } catch (e) {
      console.error(e)
      return { success: false, errors: [{ type: "client_error", msg: "Something went wrong, please try again later", error: e }] }
    }
  },
  async login(username, password) {
    try {
      const res = await fetch(window.location.origin + "/api/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: {
          "content-type": "application/json"
        }
      })
      const json = await res.json()
      return json
    } catch (e) {
      console.error(e)
      return { success: false, errors: [{ type: "client_error", msg: "Something went wrong, please try again later", error: e }] }
    }

  },
  async logout() {
    await fetch(window.location.origin + "/api/logout", {
      method: "POST"
    })
  }
}

export default auth