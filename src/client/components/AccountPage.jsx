import redirectIfLoggedOut from "../modules/redirectIfLoggedOut"

export async function loader({ request, params }) {
  return await redirectIfLoggedOut({ request, params })
}

export default function AccountPage() {
  return <div className="AccountPage">Account stuff...</div>
}
