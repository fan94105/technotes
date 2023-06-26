import { useState, useRef, useEffect } from "react"
import { Outlet, Link } from "react-router-dom"
import { useSelector } from "react-redux"
import SyncLoader from "react-spinners/SyncLoader"

import { useRefreshMutation } from "./authApiSlice"
import { selectCurrentToken } from "./authSlice"
import usePersist from "../../hooks/usePersist"

const PersistLogin = () => {
  const [persist] = usePersist()
  const token = useSelector(selectCurrentToken)
  const effectRan = useRef(false)

  const [trueSuccess, setTrueSuccess] = useState(false)

  const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] =
    useRefreshMutation()

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== "development") {
      const verifyRefreshToken = async () => {
        try {
          await refresh()

          // 確保 refresh 請求確實成功
          setTrueSuccess(true)
        } catch (err) {
          console.log(err)
        }
      }

      if (!token && persist) {
        verifyRefreshToken()
      }
    }

    return () => (effectRan.current = true)
    // eslint-disable-next-line
  }, [])

  let content
  if (!persist) {
    // persist: no
    console.log("no persist")
    content = <Outlet />
  } else if (isLoading) {
    // persist: yes, token: no
    console.log("loading")
    content = (
      <div className="flex">
        <SyncLoader color="#d9d9d9" />
      </div>
    )
  } else if (isError) {
    // persist: yes, token: no
    console.log("error")
    content = (
      <p className="errmsg">
        {error?.data?.message}
        <Link to="/login">Please login again</Link>
      </p>
    )
  } else if (isSuccess && trueSuccess) {
    // persist: yes, token: yes
    console.log("success")
    content = <Outlet />
  } else if (token && isUninitialized) {
    // persist: yes, token: yes
    console.log("token and uninit")
    content = <Outlet />
  }

  return content
}

export default PersistLogin
