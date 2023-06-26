import { createSelector, createEntityAdapter } from "@reduxjs/toolkit"

import { apiSlice } from "../../app/api/apiSlice"

// 提供數據標準化方法
const notesAdapter = createEntityAdapter({
  // 數據排序
  sortComparer: (a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1,
})

// 生成空的 {ids: [], entities: {}} 物件
const initialState = notesAdapter.getInitialState()

export const notesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotes: builder.query({
      query: () => ({
        url: "/notes",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
      // 將 query 回應物件改為標準化物件
      transformResponse: (responseData) => {
        const loadedNotes = responseData.map((note) => {
          // 為了 ids，設置 id
          note.id = note._id
          return note
        })
        return notesAdapter.setAll(initialState, loadedNotes)
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Note", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Note", id })),
          ]
        } else {
          return [{ type: "Note", id: "LIST" }]
        }
      },
    }),
    addNewNote: builder.mutation({
      query: (initialNoteData) => ({
        url: "/notes",
        method: "POST",
        body: {
          ...initialNoteData,
        },
      }),
      invalidatesTags: [{ type: "Note", id: "LIST" }],
    }),
    updateNote: builder.mutation({
      query: (initialNoteData) => ({
        url: "/notes",
        method: "PATCH",
        body: {
          ...initialNoteData,
        },
      }),
      invalidatesTags: (result, err, arg) => [{ type: "Note", id: arg.id }],
    }),
    deleteNote: builder.mutation({
      query: ({ id }) => ({
        url: "/notes",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, err, arg) => [{ type: "Note", id: arg.id }],
    }),
  }),
})

export const {
  useGetNotesQuery,
  useAddNewNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = notesApiSlice

// 生成新的 selector，並回傳 query 結果物件
export const selectNotesResult = notesApiSlice.endpoints.getNotes.select()

// 創建 memoized selector
const selectNotesData = createSelector(
  selectNotesResult,
  (notesResult) => notesResult.data
)

// 生成 selector
export const {
  selectAll: selectAllNotes,
  selectById: selectNoteById,
  selectIds: selectNoteIds,
} = notesAdapter.getSelectors((state) => selectNotesData(state) ?? initialState)
