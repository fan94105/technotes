import { useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useLocation } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faRightFromBracket,
  faFileCirclePlus,
  faFilePen,
  faUserGear,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons"
import SyncLoader from "react-spinners/SyncLoader"

import { useSendLogoutMutation } from "../features/auth/authApiSlice"
import useAuth from "../hooks/useAuth"

const DASH_REGEX = /^\/dash(\/)?$/
const NOTES_REGEX = /^\/dash\/notes(\/)?$/
const USERS_REGEX = /^\/dash\/users(\/)?$/

const DashHeader = () => {
  const { isManager, isAdmin } = useAuth()

  const navigate = useNavigate()
  const { pathname } = useLocation()

  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation()

  useEffect(() => {
    if (isSuccess) {
      navigate("/")
    }
  }, [isSuccess, navigate])

  const onNewNoteClicked = () => {
    navigate("/dash/notes/new")
  }
  const onNewUserClicked = () => {
    navigate("/dash/users/new")
  }
  const onNotesClicked = () => {
    navigate("/dash/notes")
  }
  const onUsersClicked = () => {
    navigate("/dash/users")
  }

  const onLogoutClicked = () => {
    sendLogout()
  }

  let newNoteButton = null
  if (NOTES_REGEX.test(pathname)) {
    newNoteButton = (
      <button
        className="icon-button"
        title="New Note"
        onClick={onNewNoteClicked}
      >
        <FontAwesomeIcon icon={faFileCirclePlus} />
      </button>
    )
  }

  let newUserButton = null
  if (USERS_REGEX.test(pathname)) {
    newUserButton = (
      <button
        className="icon-button"
        title="New User"
        onClick={onNewUserClicked}
      >
        <FontAwesomeIcon icon={faUserPlus} />
      </button>
    )
  }

  let usersButton = null
  if (isManager || isAdmin) {
    if (!USERS_REGEX.test(pathname) && pathname.includes("/dash")) {
      usersButton = (
        <button className="icon-button" title="Users" onClick={onUsersClicked}>
          <FontAwesomeIcon icon={faUserGear} />
        </button>
      )
    }
  }

  let notesButton = null
  if (!NOTES_REGEX.test(pathname) && pathname.includes("/dash")) {
    notesButton = (
      <button className="icon-button" title="Notes" onClick={onNotesClicked}>
        <FontAwesomeIcon icon={faFilePen} />
      </button>
    )
  }

  const logoutButton = (
    <button className="icon-button" title="Logout" onClick={onLogoutClicked}>
      <FontAwesomeIcon icon={faRightFromBracket} />
    </button>
  )

  const errClass = isError ? "errmsg" : "offscreen"

  let buttonContent
  if (isLoading) {
    buttonContent = <SyncLoader color="#fff" />
  } else {
    buttonContent = (
      <>
        {newNoteButton}
        {notesButton}
        {newUserButton}
        {usersButton}
        {logoutButton}
      </>
    )
  }

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <header className="dash-header flex">
        <div className="dash-header__container">
          <Link to="/dash">
            <h1 className="dash-header__title">techNotes</h1>
          </Link>
          <nav className="dash-header__nav">
            {/* nav buttons */}
            {buttonContent}
          </nav>
        </div>
      </header>
    </>
  )

  return content
}

export default DashHeader
