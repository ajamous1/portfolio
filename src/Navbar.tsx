import { Link } from 'react-router-dom'
import { useMode } from './contexts/ModeContext'
import './Navbar.css'

function Navbar() {
  const { isDeveloper, setIsDeveloper } = useMode()

  const handleToggle = () => {
    setIsDeveloper(!isDeveloper)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="logo-icon">
            <rect x="20" y="20" width="60" height="60" fill="#000000"/>
          </svg>
        </Link>
        <Link to="/" className="navbar-link">
          Home
        </Link>
        <Link to="/blog" className="navbar-link">
          Blog
        </Link>
        <a href="mailto:ahmad.y.jamous@gmail.com" className="navbar-link">
          Contact
        </a>
        <div className="navbar-toggle-container">
          <button
            className="mode-toggle navbar-mode-toggle"
            onClick={handleToggle}
            aria-label={`Switch to ${isDeveloper ? 'Designer' : 'Developer'} mode`}
          >
            <span className={`mode-switch ${isDeveloper ? 'developer' : 'designer'}`}>
              <span className="mode-slider"></span>
            </span>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

