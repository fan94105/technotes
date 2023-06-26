import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

import { setCredentials } from "../../features/auth/authSlice"

const baseQuery = fetchBaseQuery({
  baseUrl: "https://technotes-api-msr9.onrender.com",
  // 在每個請求中都發送 token
  credentials: "include",
  // 設置請求 headers
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token

    if (token) {
      headers.set("Authorization", `Bearer ${token}`)
    }

    return headers
  },
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result?.error?.status === 403) {
    console.log("sending refresh token")

    // 發送 refresh 請求與 refresh token 以取得新的 access token
    const refreshResult = await baseQuery("/auth/refresh", api, extraOptions)

    if (refreshResult.data) {
      // 儲存新的 token
      api.dispatch(setCredentials({ ...refreshResult.data }))

      // 以新的 access token 重新請求
      result = await baseQuery(args, api, extraOptions)
    } else {
      if (refreshResult?.error?.status === 403) {
        refreshResult.error.data.message = "Your login has expired."
      }
      return refreshResult
    }
  }

  return result
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Note", "User"],
  endpoints: (builder) => ({}),
})
