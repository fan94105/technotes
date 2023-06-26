import { Link } from "react-router-dom"

const Public = () => {
  const content = (
    <section className="public border flex">
      <header className="public__header">
        <h1>
          Welcome to <span className="nowrap">ABen's Repairs!</span>
        </h1>
      </header>
      <main className="public__main flex">
        <p>ABen is a dog, but he's also a boss.</p>
      </main>
      <footer className="public__footer">
        <Link to="/login" className="border">
          Employee Login
        </Link>
      </footer>
    </section>
  )
  return content
}

export default Public
