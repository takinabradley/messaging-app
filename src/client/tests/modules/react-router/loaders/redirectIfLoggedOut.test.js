import { afterAll, beforeAll, beforeEach, describe, expect } from "vitest"
import redirectIfLoggedOut from "../../../../modules/react-router/loaders/redirectIfLoggedOut"
import auth from "../../../../modules/auth"

const isLoggedIn = vi.fn(async () => true)

vi.mock("../../../../modules/auth", async (importOriginal) => {
  const original = await importOriginal()
  return {
    default: {
      hi: "there",
      get isLoggedIn() {
        return isLoggedIn()
      }
    }
  }
})

beforeEach(() => {
  isLoggedIn.mockReset()
})

describe("redirectIfLoggedOut", () => {
  test("returns null if auth.isLoggedIn returns true", async () => {
    isLoggedIn.mockImplementationOnce(async () => true)
    const requestObj = { url: "http://www.hello.com" }
    expect(await redirectIfLoggedOut({ request: requestObj })).toBeNull()
  })

  test("returns a redirect response to login page if auth.isLoggedIn returns false", async () => {
    isLoggedIn.mockImplementationOnce(async () => false)
    const requestObj = { url: "http://www.hello.com/" }
    const response = new Response(null, {
      status: 302,
      statusText: "",
      headers: { location: "/login?redirectTo=/" }
    })

    expect(await redirectIfLoggedOut({ request: requestObj })).toEqual(response)
  })

  test("returns a redirect response to login page with proper redirectTo param if auth.isLoggedIn returns false", async () => {
    isLoggedIn.mockImplementationOnce(async () => false)
    const requestObj = { url: "http://www.hello.com/somewhere" }
    const response = new Response(null, {
      status: 302,
      statusText: "",
      headers: { location: "/login?redirectTo=/somewhere" }
    })

    expect(await redirectIfLoggedOut({ request: requestObj })).toEqual(response)
  })
})
