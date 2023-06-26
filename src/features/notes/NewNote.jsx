import SyncLoader from "react-spinners/SyncLoader"

import { useGetUsersQuery } from "../users/usersApiSlice"
import NewNoteForm from "./NewNoteForm"

const NewNote = () => {
  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  })

  if (!users?.length) {
    return (
      <div className="flex">
        <SyncLoader color="#d9d9d9" />
      </div>
    )
  }

  const content = <NewNoteForm users={users} />

  return content
}

export default NewNote
