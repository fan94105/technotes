import { Link } from "react-router-dom"

import useAuth from "../../hooks/useAuth"

const Welcome = () => {
  const { username, isManager, isAdmin } = useAuth()

  const date = new Date()
  const today = new Intl.DateTimeFormat("zh-TW", {
    dateStyle: "full",
    timeStyle: "medium",
  }).format(date)

  const content = (
    <section className="welcome">
      <p>{today}</p>
      <h1>Welcome {username}!</h1>
      <div className="link">
        <div className="notes">
          <p className="border">
            <Link to="/dash/notes">View techNotes</Link>
          </p>
          <p className="border">
            <Link to="/dash/notes/new">Add New techNotes</Link>
          </p>
        </div>

        {/* 只有 Manager 和 Admin 才能編輯或新增使用者 */}
        {(isManager || isAdmin) && (
          <div className="users">
            <p className="border">
              <Link to="/dash/users">View User Settings</Link>
            </p>
            <p className="border">
              <Link to="/dash/users/new">Add New User</Link>
            </p>
          </div>
        )}
      </div>
    </section>
  )

  return content
}

export default Welcome
