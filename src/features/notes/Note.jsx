import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"
import { memo } from "react"

import { useGetNotesQuery } from "./notesApiSlice"

const Note = ({ noteId }) => {
  const { note } = useGetNotesQuery("notesList", {
    selectFromResult: ({ data }) => ({
      note: data?.entities[noteId],
    }),
  })

  const navigate = useNavigate()

  if (note) {
    const created = new Date(note.createdAt).toLocaleString("zh-TW", {
      day: "numeric",
      month: "long",
    })
    const updated = new Date(note.updatedAt).toLocaleString("zh-TW", {
      day: "numeric",
      month: "long",
    })

    const handleEdit = () => navigate(`/dash/notes/${noteId}`)
    return (
      <tr className="table__row">
        <td className="table__cell note__status">
          {note.completed ? (
            <span className="note__status--completed">Completed</span>
          ) : (
            <span className="note__status--open">Open</span>
          )}
        </td>
        <td className="table__cell">{created}</td>
        <td className="table__cell">{updated}</td>
        <td className="table__cell">{note.title}</td>
        <td className="table__cell">{note.username}</td>
        <td className="table__cell">
          <button className="icon-button" onClick={handleEdit}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </td>
      </tr>
    )
  } else {
    return null
  }
}

const memoizedNote = memo(Note)

export default memoizedNote
