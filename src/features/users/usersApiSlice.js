import { createSelector, createEntityAdapter } from "@reduxjs/toolkit"

import { apiSlice } from "../../app/api/apiSlice"

// 提供數據標準化方法
const usersAdapter = createEntityAdapter({})

// 生成空的 {ids: [], entities: {}} 物件
const initialState = usersAdapter.getInitialState()

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => ({
        url: "/users",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
      // 將 query 回應物件改為標準化物件
      transformResponse: (responseData) => {
        const loadedUsers = responseData.map((user) => {
          // 為了 ids，設置 id
          user.id = user._id
          return user
        })
        return usersAdapter.setAll(initialState, loadedUsers)
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "User", id: "LIST" },
            ...result.ids.map((id) => ({ type: "User", id })),
          ]
        } else {
          return [{ type: "User", id: "LIST" }]
        }
      },
    }),
    addNewUser: builder.mutation({
      query: (initialUserData) => ({
        url: "/users",
        method: "POST",
        body: {
          ...initialUserData,
        },
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    updateUser: builder.mutation({
      query: (initialUserData) => ({
        url: "/users",
        method: "PATCH",
        body: {
          ...initialUserData,
        },
      }),
      invalidatesTags: (result, err, arg) => [{ type: "User", id: arg.id }],
    }),
    deleteUser: builder.mutation({
      query: ({ id }) => ({
        url: "/users",
        method: "DELETE",
        body: {
          id,
        },
      }),
      invalidatesTags: (result, err, arg) => [{ type: "User", id: arg.id }],
    }),
  }),
})

export const {
  useGetUsersQuery,
  useAddNewUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApiSlice

// 生成新的 selector，並回傳 query 結果物件
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select()

// 創建 memoized selector
const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data
)

// 生成 selector
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
} = usersAdapter.getSelectors((state) => selectUsersData(state) ?? initialState)
