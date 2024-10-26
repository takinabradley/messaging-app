import { Link } from "react-router-dom"
export default function MessengerApp() {
  console.log("messengerApp...")
  return (
    <div className="MessengerApp">
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
