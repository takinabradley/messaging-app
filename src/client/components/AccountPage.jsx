import redirectIfLoggedOut from "../modules/react-router/loaders/redirectIfLoggedOut.js"

export async function loader({ request, params }) {
  return await redirectIfLoggedOut({ request, params })
}

export default function AccountPage() {
  return (
    <div className="AccountPage" data-testid="AccountPage">
      Account stuff...
    </div>
  )
}
