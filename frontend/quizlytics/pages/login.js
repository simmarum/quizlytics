import { Component } from 'react'
import { login } from '../utils/auth'
import { api_path, fetch_post } from '../utils/api_path'


class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: '',
      error: '',
      success: '',
    }
    this.handleChangeEmail = this.handleChangeEmail.bind(this)
    this.handleChangePassword = this.handleChangePassword.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChangeEmail(event) {
    this.setState({ email: event.target.value })
  }

  handleChangePassword(event) {
    this.setState({ password: event.target.value })
  }

  async handleSubmit(event) {
    event.preventDefault()
    const email = this.state.email
    const password = this.state.password
    const url = api_path['token']
    const p_body = JSON.stringify({ email, password })
    const api_data = fetch_post(this, url, null, p_body)
    api_data.then(value => {
      login(value)
    })
  }

  render() {
    return (
      <div>
        <div className='row login'>
          <div className='col-12 tt'>Login</div>
          <form className='col-12' onSubmit={this.handleSubmit}>
            <label htmlFor='email'>E-mail</label>
            <input
              type='text'
              id='email'
              name='email'
              autoComplete='email'
              value={this.state.email}
              onChange={this.handleChangeEmail}
            />
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              id='password'
              name='password'
              autoComplete='current-password'
              value={this.state.password}
              onChange={this.handleChangePassword}
            />
            <button className="btn" type='submit'>Login</button>
            <pre className={`success ${this.state.success && 'show'}`}>
              Success
            </pre>
            <pre className={`error ${this.state.error && 'show'}`}>
              {this.state.error && `${JSON.stringify(this.state.error, null, 2)}`}
            </pre>
          </form>
        </div>
      </div>
    )
  }
}

export default Login