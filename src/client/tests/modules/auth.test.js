import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect
} from "vitest"
import auth from "../../modules/auth.js"

const originalFetch = fetch

beforeAll(() => {
  globalThis.fetch = vi.fn(originalFetch)
})

afterAll(() => {
  globalThis.fetch = originalFetch
})

beforeEach(() => {
  fetch.mockReset()
})

describe("auth", () => {
  describe("isLoggedIn", () => {
    test("calls the /auth/loginstatus endpoint", async () => {
      fetch.mockImplementationOnce(async () => ({
        async json() {
          return { loggedIn: true }
        }
      }))

      await auth.isLoggedIn
      expect(fetch).toHaveBeenCalledOnce()
      expect(fetch).toHaveBeenCalledWith(
        window.location.origin + "/auth/loginstatus"
      )
    })

    test("isLoggedIn returns true if '/auth/loginStatus' route returns true", async () => {
      fetch.mockImplementationOnce(async () => ({
        async json() {
          return { loggedIn: true }
        }
      }))

      const loggedIn = await auth.isLoggedIn
      expect(loggedIn).toBe(true)
    })

    test("isLoggedIn returns false if '/auth/loginStatus' route returns anything else but {loggedIn: true}", async () => {
      fetch.mockImplementationOnce(async () => ({
        async json() {
          return { loggedIn: "true" }
        }
      }))

      fetch.mockImplementationOnce(async () => ({
        async json() {
          return { loggedIn: 1 }
        }
      }))

      fetch.mockImplementationOnce(async () => ({
        async json() {
          return { loggedIn: "false" }
        }
      }))

      fetch.mockImplementationOnce(async () => ({
        async json() {
          return {}
        }
      }))

      fetch.mockImplementationOnce(async () => ({}))

      fetch.mockImplementationOnce(async () => {})

      fetch.mockImplementationOnce(originalFetch)

      const allResults = await Promise.all(
        Array.from(new Array(7), () => auth.isLoggedIn)
      )

      expect(allResults.every((res) => res === false)).toBe(true)
    })

    test("isLoggedIn returns false if there's a fetch error", async () => {
      fetch.mockImplementationOnce(async () => {
        throw new Error("Errrorrrrr")
      })

      expect(await auth.isLoggedIn).toBe(false)
    })
  })

  describe("register", () => {
    test("calls the /auth/signup endpoint", async () => {
      fetch.mockImplementationOnce(async () => ({
        async json() {
          return { success: true, result: null }
        }
      }))

      await auth.register()

      expect(fetch).toHaveBeenCalledOnce()
      expect(fetch.mock.lastCall).toContain(
        window.location.origin + "/auth/signup"
      )
    })

    test("returns the result of /auth/signup endpoint", async () => {
      fetch.mockImplementationOnce(async () => ({
        async json() {
          return {
            success: false,
            errors: [
              "username required",
              "password required",
              "passwords do not match"
            ]
          }
        }
      }))

      const res = await auth.register()

      expect(res).toEqual({
        success: false,
        errors: [
          "username required",
          "password required",
          "passwords do not match"
        ]
      })
    })

    test("explains there was some kind of client error if fetch errors", async () => {
      fetch.mockImplementationOnce(async () => {
        throw new Error("Could not connect")
      })

      const res = await auth.register()
      expect(res.success).toBe(false)
      expect(res.errors.length).toBe(1)
      expect(res.errors[0].msg).toBe(
        "Something went wrong, please try again later"
      )
    })

    test("explains there was some kind of client error if json cannot be parsed", async () => {
      fetch.mockImplementationOnce(async () => ({
        async json() {
          throw new Error("cannot parse json for some reason")
        }
      }))

      const res = await auth.register()

      expect(res.success).toBe(false)
      expect(res.errors.length).toBe(1)
      expect(res.errors[0].msg).toBe(
        "Something went wrong, please try again later"
      )
    })

    test("sends a post request containing json with username, password, and verified password to /auth/signup endpoint", async () => {
      fetch.mockImplementationOnce(async () => ({
        json() {
          return { success: true, errors: [] }
        }
      }))

      await auth.register("hello", "there", "there")

      expect(fetch).toHaveBeenCalledOnce()
      expect(fetch.mock.lastCall).toEqual([
        window.location.origin + "/auth/signup",
        {
          method: "POST",
          body: JSON.stringify({
            username: "hello",
            password: "there",
            verifyPassword: "there"
          }),
          headers: {
            "content-type": "application/json"
          }
        }
      ])
    })
  })

  describe("login", () => {
    test("calls the /auth/login endpoint", async () => {
      fetch.mockImplementationOnce(async () => ({
        async json() {
          return { loggedIn: true }
        }
      }))

      await auth.login()
      expect(fetch).toHaveBeenCalledOnce()
      expect(fetch.mock.lastCall).toContain(
        window.location.origin + "/auth/login"
      )
    })

    test("sends a post request containing json with username, password, and verified password to /auth/login endpoint", async () => {
      fetch.mockImplementationOnce(async () => ({
        json() {
          return { success: true, errors: [] }
        }
      }))

      await auth.login("hello", "there")

      expect(fetch).toHaveBeenCalledOnce()
      expect(fetch.mock.lastCall).toEqual([
        window.location.origin + "/auth/login",
        {
          method: "POST",
          body: JSON.stringify({
            username: "hello",
            password: "there"
          }),
          headers: {
            "content-type": "application/json"
          }
        }
      ])
    })

    test("returns the result of /auth/signup endpoint", async () => {
      fetch.mockImplementationOnce(async () => ({
        async json() {
          return {
            success: false,
            errors: ["username required", "password required"]
          }
        }
      }))

      const res = await auth.login()

      expect(res).toEqual({
        success: false,
        errors: ["username required", "password required"]
      })
    })

    test("explains there was some kind of client error if fetch errors", async () => {
      fetch.mockImplementationOnce(async () => {
        throw new Error("Could not connect")
      })

      const res = await auth.login()
      expect(res.success).toBe(false)
      expect(res.errors.length).toBe(1)
      expect(res.errors[0].msg).toBe(
        "Something went wrong, please try again later"
      )
    })

    test("explains there was some kind of client error if json cannot be parsed", async () => {
      fetch.mockImplementationOnce(async () => ({
        async json() {
          throw new Error("cannot parse json for some reason")
        }
      }))

      const res = await auth.login()

      expect(res.success).toBe(false)
      expect(res.errors.length).toBe(1)
      expect(res.errors[0].msg).toBe(
        "Something went wrong, please try again later"
      )
    })
  })

  describe("logout", () => {
    test("sends a post request to /auth/logout", async () => {
      fetch.mockImplementationOnce(async () => {})

      await auth.logout()

      expect(fetch).toHaveBeenCalledOnce()
      expect(fetch.mock.lastCall).toEqual([
        window.location.origin + "/auth/logout",
        {
          method: "POST"
        }
      ])
    })
  })
})
