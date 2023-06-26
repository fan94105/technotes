import SyncLoader from "react-spinners/SyncLoader"

import { useGetUsersQuery } from "./usersApiSlice"
import User from "./User"
import useTitle from "../../hooks/useTitle"

const UsersList = () => {
  useTitle("Users List")

  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery(null, {
    pollingInterval: 60000, // 輪詢間隔(ms)
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
    const { ids } = users

    const tableContent =
      ids?.length && ids.map((userId) => <User key={userId} userId={userId} />)

    content = (
      <table className="table">
        <thead className="table__thead">
          <tr>
            <th className="table__th" scope="col">
              Username
            </th>
            <th className="table__th" scope="col">
              Roles
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

export default UsersList
