import { Routes, Route } from "react-router-dom"

import "./App.css"
import Layout from "./components/Layout"
import Public from "./components/Public"
import Login from "./features/auth/Login"
import Prefetch from "./features/auth/Prefetch"
import PersistLogin from "./features/auth/PersistLogin"
import DashLayout from "./components/DashLayout"
import Welcome from "./features/auth/Welcome"
import UsersList from "./features/users/UsersList"
import EditUser from "./features/users/EditUser"
import NewUserForm from "./features/users/NewUserForm"
import NotesList from "./features/notes/NotesList"
import EditNote from "./features/notes/EditNote"
import NewNote from "./features/notes/NewNote"
import RequireAuth from "./features/auth/RequireAuth"
import { ROLES } from "./config/roles"
import useTitle from "./hooks/useTitle"

function App() {
  useTitle("ABen Repairs")

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />

        {/* protected routes */}
        <Route element={<PersistLogin />}>
          <Route
            element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}
          >
            <Route element={<Prefetch />}>
              {/* Dash */}
              <Route path="dash" element={<DashLayout />}>
                <Route index element={<Welcome />} />

                {/* Users */}
                <Route
                  element={
                    <RequireAuth allowedRoles={[ROLES.Manager, ROLES.Admin]} />
                  }
                >
                  <Route path="users">
                    <Route index element={<UsersList />} />
                    <Route path=":id" element={<EditUser />} />
                    <Route path="new" element={<NewUserForm />} />
                  </Route>
                </Route>

                {/* Notes */}
                <Route path="notes">
                  <Route index element={<NotesList />} />
                  <Route path=":id" element={<EditNote />} />
                  <Route path="new" element={<NewNote />} />
                </Route>
              </Route>
              {/* End Dash */}
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}

export default App
