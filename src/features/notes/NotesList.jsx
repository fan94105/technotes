import SyncLoader from "react-spinners/SyncLoader"

import { useGetNotesQuery } from "./notesApiSlice"
import Note from "./Note"
import useAuth from "../../hooks/useAuth"
import useTitle from "../../hooks/useTitle"

const NotesList = () => {
  useTitle("Notes List")

  const { username, isManager, isAdmin } = useAuth()

  const {
    data: notes,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetNotesQuery("notesList", {
    pollingInterval: 15000, // 輪詢間隔(ms)
    refetchOnFocus: true, // 是否在獲取焦點時重新加載數據
    refetchOnMountOrArgChange: true, // 是否每次都重新加載數據，false 正常使用快取
    refetchOnReconnect: true, // 是否在重新連接時重新加載數據
  })

  let content

  if (isLoading) {
    content = (
      <div className="flex">
        <SyncLoader color="#d9d9d9" />
      </div>
    )
  }

  if (isError) {
    content = <p className="errmsg">{error?.data.message}</p>
  }

  if (isSuccess) {
    const { ids, entities } = notes

    let filteredIds
    if (isManager || isAdmin) {
      filteredIds = [...ids]
    } else {
      filteredIds = ids.filter(
        (noteId) => entities[noteId].username === username
      )
    }

    if (filteredIds.length === 0) {
      return (
        <div className="flex">
          <p className="errmsg">No notes found...</p>
        </div>
      )
    }

    const tableContent =
      ids?.length &&
      filteredIds.map((noteId) => <Note key={noteId} noteId={noteId} />)

    content = (
      <table className="table">
        <thead className="table__thead">
          <tr>
            <th className="table__th" scope="col">
              Status
            </th>
            <th className="table__th" scope="col">
              Created
            </th>
            <th className="table__th" scope="col">
              Updated
            </th>
            <th className="table__th" scope="col">
              Title
            </th>
            <th className="table__th" scope="col">
              Owner
            </th>
            <th className="table__th" scope="col">
              Edit
            </th>
          </tr>
        </thead>
        <tbody>{tableContent}</tbody>
      </table>
    )
  }

  return content
}

export default NotesList
