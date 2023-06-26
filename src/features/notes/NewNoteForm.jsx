import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave } from "@fortawesome/free-solid-svg-icons"

import { useAddNewNoteMutation } from "./notesApiSlice"
import useTitle from "../../hooks/useTitle"

const NewNoteForm = ({ users }) => {
  useTitle("New Note")

  const [addNewNote, { isLoading, isSuccess, isError, error }] =
    useAddNewNoteMutation()

  const [title, setTitle] = useState("")
  const [text, setText] = useState("")
  const [userId, setUserId] = useState(users[0].id)

  const navigate = useNavigate()

  useEffect(() => {
    if (isSuccess) {
      setTitle("")
      setText("")
      setUserId("")
      navigate("/dash/notes")
    }
  }, [isSuccess, navigate])

  const onTitleChanged = (e) => setTitle(e.target.value)
  const onTextChanged = (e) => setText(e.target.value)
  const onUserIdChanged = (e) => setUserId(e.target.value)

  const canSave = [title, text, userId].every(Boolean) && !isLoading

  const onSaveNoteClicked = async () => {
    if (canSave) {
      await addNewNote({ title, text, user: userId })
    }
  }

  const usersOptions = users
    .filter((user) => user.active)
    .map((user) => (
      <option key={user.id} value={user.id}>
        {user.username}
      </option>
    ))

  const errClass = isError ? "errmsg" : "offscreen"
  const validTitleClass = !title ? "form__input--incomplete" : ""
  const validTextClass = !text ? "form__input--incomplete" : ""

  const errContent = error?.data.message ?? ""

  const content = (
    <>
      <p className={errClass}>{errContent}</p>

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div className="form__title-row">
          <h2>New Note</h2>
          <div className="form__action-buttons">
            <button
              className="icon-button"
              title="Save"
              onClick={onSaveNoteClicked}
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
          </div>
        </div>
        <label htmlFor="note-title" className="form__label">
          Title:
        </label>
        <input
          type="text"
          className={`form__input ${validTitleClass}`}
          id="note-title"
          name="title"
          autoComplete="off"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="note-text" className="form__label">
          Text:
        </label>
        <textarea
          className={`form__input ${validTextClass}`}
          id="note-text"
          name="text"
          value={text}
          onChange={onTextChanged}
        />
        <label htmlFor="note-username" className="form__label">
          USER:
        </label>
        <select
          className="form__select"
          name="username"
          id="note-username"
          value={userId}
          onChange={onUserIdChanged}
        >
          {usersOptions}
        </select>
      </form>
    </>
  )
  return content
}

export default NewNoteForm
