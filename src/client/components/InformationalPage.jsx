import { Link } from "react-router-dom"
export default function InformationalPage() {
  return (
    <div>
      <div>Main page!</div>

      <div>stuff about this app!</div>

      <div>
        Use these links to <Link to="/login">login</Link> or register!
      </div>
    </div>
  )
}
