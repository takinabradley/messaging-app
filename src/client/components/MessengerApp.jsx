import { Link } from "react-router-dom"
import redirectIfLoggedOut from "../modules/react-router/loaders/redirectIfLoggedOut"

export async function loader({ request, params }) {
  return await redirectIfLoggedOut({ request, params })
}

export default function MessengerApp() {
  return (
    <div className="MessengerApp" data-testid="MessengerApp">
      Welcome to the messenger app!
      <div>
        wanna go to the <Link to="/">main page</Link>
      </div>
      <div>
        wanna <Link to="/logout">log out</Link>?
      </div>
      <div>
        view <Link to={"/account"}>account settings</Link>
      </div>
    </div>
  )
}
