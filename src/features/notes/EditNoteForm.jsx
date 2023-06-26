import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"

import { useUpdateNoteMutation, useDeleteNoteMutation } from "./notesApiSlice"
import useAuth from "../../hooks/useAuth"
import useTitle from "../../hooks/useTitle"

const EditNoteForm = ({ note, users }) => {
  useTitle("Edit Note")

  const { isManager, isAdmin } = useAuth()

  const [updateNote, { isLoading, isSuccess, isError, error }] =
    useUpdateNoteMutation()

  const [
    deleteNote,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteNoteMutation()

  const navigate = useNavigate()

  const [title, setTitle] = useState(note.title)
  const [text, setText] = useState(note.text)
  const [completed, setCompleted] = useState(note.completed)
  const [userId, setUserId] = useState(note.user)

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setTitle("")
      setText("")
      setUserId("")
      navigate("/dash/notes")
    }
  }, [isSuccess, isDelSuccess, navigate])

  const onTitleChanged = (e) => setTitle(e.target.value)
  const onTextChanged = (e) => setText(e.target.value)
  const onCompletedChanged = () => setCompleted((prev) => !prev)
  const onUserIdChanged = (e) => setUserId(e.target.value)

  const canSave = [title, text, userId].every(Boolean) && !isLoading

  const onSaveNoteClicked = async () => {
    if (canSave) {
      await updateNote({ id: note.id, title, text, completed, user: userId })
    }
  }

  const onDeleteNoteClicked = async () => {
    await deleteNote({ id: note.id })
  }

  const created = new Date(note.createdAt).toLocaleString("zh-TW", {
    dateStyle: "medium",
    timeStyle: "medium",
  })
  const updated = new Date(note.updatedAt).toLocaleString("zh-TW", {
    dateStyle: "medium",
    timeStyle: "medium",
  })

  const usersOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.username}
    </option>
  ))

  const errClass = isError || isDelError ? "errmsg" : "offscreen"
  const validTitleClass = !title ? "form__input--incomplete" : ""
  const validTextClass = !text ? "form__input--incomplete" : ""

  const errContent = (error?.data.message || delerror?.data.message) ?? ""

  let deleteButton = null
  if (isManager || isAdmin) {
    deleteButton = (
      <button
        className="icon-button"
        title="Delete"
        onClick={onDeleteNoteClicked}
      >
        <FontAwesomeIcon icon={faTrashCan} />
      </button>
    )
  }

  const content = (
    <>
      <p className={errClass}>{errContent}</p>

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div className="form__title-row">
          <h2>Edit Note #{note.ticket}</h2>
          <div className="form__action-buttons">
            <button
              className="icon-button"
              title="Save"
              onClick={onSaveNoteClicked}
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
            {deleteButton}
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
        <label
          htmlFor="note-completed"
          className="form__label form__checkbox-container"
        >
          Completed:
        </label>
        <input
          className="form__checkbox"
          type="checkbox"
          name="completed"
          id="note-completed"
          checked={completed}
          onChange={onCompletedChanged}
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
        <div className="form__divider">
          <div className="form__label">
            Created:
            <p>{created}</p>
          </div>
          <div className="form__label">
            Updated:
            <p>{updated}</p>
          </div>
        </div>
      </form>
    </>
  )

  return content
}

export default EditNoteForm
