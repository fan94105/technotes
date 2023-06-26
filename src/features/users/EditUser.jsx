import { useParams } from "react-router-dom"
import SyncLoader from "react-spinners/SyncLoader"

import { useGetUsersQuery } from "./usersApiSlice"
import EditUserForm from "./EditUserForm"

const EditUser = () => {
  const { id } = useParams()

  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[id],
    }),
  })

  if (!user) {
    return (
      <div className="flex">
        <SyncLoader color="#d9d9d9" />
      </div>
    )
  }

  const content = <EditUserForm user={user} />

  return content
}

export default EditUser
