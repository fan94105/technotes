import { useState, useEffect, useRef } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import SyncLoader from "react-spinners/SyncLoader"

import { useLoginMutation } from "./authApiSlice"
import { setCredentials } from "./authSlice"
import usePersist from "../../hooks/usePersist"
import useTitle from "../../hooks/useTitle"

const Login = () => {
  useTitle("Employee Login")

  const userRef = useRef()
  const errRef = useRef()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errMsg, setErrMsg] = useState("")
  const [persist, setPersist] = usePersist()

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [login, { isLoading }] = useLoginMutation()

  useEffect(() => {
    userRef.current.focus()
  }, [])

  useEffect(() => {
    setErrMsg("")
  }, [username, password])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const { accessToken } = await login({ username, password }).unwrap()
      dispatch(setCredentials({ accessToken }))
      setUsername("")
      setPassword("")
      navigate("/dash")
    } catch (err) {
      if (!err.status) {
        setErrMsg("No Server Response")
      } else if (err.status === 400) {
        setErrMsg("Missing Username or Password")
      } else if (err.status === 401) {
        setErrMsg("Unauthorized")
      } else {
        setErrMsg(err.data?.message)
      }
      errRef.current.focus()
    }
  }

  const handleUserInput = (e) => setUsername(e.target.value)
  const handlePwdInput = (e) => setPassword(e.target.value)
  const handleToggle = () => setPersist((prev) => !prev)

  const errClass = errMsg ? "errmsg" : "offscreen"

  if (isLoading) {
    return (
      <div className="flex">
        <SyncLoader color="#d9d9d9" />
      </div>
    )
  }

  const content = (
    <section className="public">
      <header>
        <h1>Employee Login</h1>
      </header>
      <main className="login">
        <p ref={errRef} className={errClass} aria-live="assertive">
          {errMsg}
        </p>

        <form className="form" onSubmit={handleSubmit}>
          <label htmlFor="username" className="form__label">
            Username:
          </label>
          <input
            type="text"
            className="form__input"
            id="username"
            name="username"
            ref={userRef}
            value={username}
            onChange={handleUserInput}
            autoComplete="off"
            required
          />
          <label htmlFor="password" className="form__label">
            Password:
          </label>
          <input
            type="password"
            className="form__input"
            id="password"
            name="password"
            value={password}
            onChange={handlePwdInput}
            required
          />
          <button className="form__submit-button border">Sign In</button>

          <label htmlFor="persist" className="form__label">
            <input
              type="checkbox"
              name="persist"
              id="persist"
              onChange={handleToggle}
              checked={persist}
              className="form__checkbox"
            />
            &nbsp;Remember Me
          </label>
        </form>
      </main>
      <footer>
        <Link className="backHome" to="/">
          Back to Home 🚀
        </Link>
      </footer>
    </section>
  )

  return content
}

export default Login
