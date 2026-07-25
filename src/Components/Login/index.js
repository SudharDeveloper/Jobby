import {Component} from 'react'
import './index.css'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

class Login extends Component {
  state = {username: '', password: '', errMsg: ''}

  usernameChange = event => {
    this.setState({username: event.target.value})
  }

  passwordChange = event => {
    this.setState({password: event.target.value})
  }

  submit = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok) {
      const jwtToken = data.jwt_token
      Cookies.set('jwt_token', jwtToken, {expires: 3})
      this.setState({errMsg: ''})
      const {history} = this.props
      history.replace('/')
    } else {
      this.setState({errMsg: data.error_msg})
    }
  }

  render() {
    const {username, password, errMsg} = this.state
    const jwt = Cookies.get('jwt_token')
    if (jwt !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-container">
        <form className="form-container" onSubmit={this.submit}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="logo"
          />
          <label htmlFor="username" className="label">
            USERNAME
          </label>
          <input
            id="username"
            value={username}
            onChange={this.usernameChange}
            type="text"
            className="input"
            placeholder="Username"
          />
          <label htmlFor="password" className="label">
            PASSWORD
          </label>
          <input
            id="password"
            value={password}
            onChange={this.passwordChange}
            type="password"
            className="input"
            placeholder="Password"
          />
          <button className="login-button" type="submit">
            Login
          </button>
          <p className="errorMsg">{errMsg}</p>
        </form>
      </div>
    )
  }
}

export default Login
