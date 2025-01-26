const auth = {
  get isLoggedIn() {
    return fetch(window.location.origin + "/auth/loginstatus")
      .then((res) => res.json())
      .then((json) => json.loggedIn === true)
      .catch((e) => {
        return false
      })
  },
  async register(username, password, verifyPassword) {
    try {
      const res = await fetch(window.location.origin + "/auth/signup", {
        method: "POST",
        body: JSON.stringify({ username, password, verifyPassword }),
        headers: {
          "content-type": "application/json"
        }
      })

      const json = await res.json()
      return json
    } catch (e) {
      return {
        success: false,
        errors: [
          {
            type: "client_error",
            msg: "Something went wrong, please try again later",
            error: e
          }
        ]
      }
    }
  },
  async login(username, password) {
    try {
      const res = await fetch(window.location.origin + "/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: {
          "content-type": "application/json"
        }
      })
      const json = await res.json()
      return json
    } catch (e) {
      return {
        success: false,
        errors: [
          {
            type: "client_error",
            msg: "Something went wrong, please try again later",
            error: e
          }
        ]
      }
    }
  },
  async logout() {
    await fetch(window.location.origin + "/auth/logout", {
      method: "POST"
    })
  }
}

export default auth
