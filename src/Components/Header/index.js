import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const logout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <div className="header-container">
      <Link to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          className="website-logo"
          alt="website logo"
        />
      </Link>
      <ul className="header-section">
        <li>
          <Link to="/" className="nav-link">
            <h4>Home</h4>
          </Link>
        </li>
        <li>
          <Link to="/jobs" className="nav-link">
            <h4>Jobs</h4>
          </Link>
        </li>
        <li>
          <button type="button" onClick={logout} className="logout-button">
            Logout
          </button>
        </li>
      </ul>
    </div>
  )
}

export default withRouter(Header)
