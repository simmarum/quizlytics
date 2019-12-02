import fetch from 'isomorphic-unfetch'
import Layout from '../components/MyLayout'
import nextCookie from 'next-cookies'
import { Component } from 'react'
import { auth, get_auth_header } from '../utils/auth'
import { api_path } from '../utils/api_path'

class Profile extends Component {
  constructor(props) {
    super(props)

    const user_profile = props.results[0]
    this.state = {
      email: user_profile.email,
      first_name: user_profile.first_name,
      last_name: user_profile.last_name,
      error: ''
    }
    this.handleChangeFirstName = this.handleChangeFirstName.bind(this)
    this.handleChangeLastName = this.handleChangeLastName.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChangeFirstName(event) {
    this.setState({ first_name: event.target.value })
  }

  handleChangeLastName(event) {
    this.setState({ last_name: event.target.value })
  }

  async handleSubmit(event) {
    event.preventDefault()
    const first_name = this.state.first_name
    const last_name = this.state.last_name
    const url = api_path['token']

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ first_name, last_name })
      })
      if (response.ok) {
        const data = await response.json()
        console.log("!@#", data)
      } else {
        console.log('Login failed.')
        const data = await response.json()
        this.setState({ error: Object.entries(data) })
      }
    } catch (error) {
      console.error(
        'You have an error in your code or there are Network issues.',
        error
      )
      throw new Error(error)
    }
  }

  render() {
    return (
      <div>
        <div className='user_profile'>
          <form onSubmit={this.handleSubmit}>
            <label htmlFor='email'>Email</label>
            <input
              type='text'
              id='email'
              name='email'
              autoComplete='email'
              value={this.state.email}
              readOnly
            />
            <label htmlFor='first_name'>First Name</label>
            <input
              type='text'
              id='first_name'
              name='first_name'
              autoComplete='first_name'
              value={this.state.first_name}
              onChange={this.handleChangeFirstName}
            />
            <label htmlFor='last_name'>Last Name</label>
            <input
              type='last_name'
              id='last_name'
              name='last_name'
              autoComplete='last_name'
              value={this.state.last_name}
              onChange={this.handleChangeLastName}
            />
            <button type='submit'>Save</button>

            <p className={`error ${this.state.error && 'show'}`}>
              {this.state.error && `${this.state.error}`}
            </p>
          </form>
        </div>
      </div>
    )
  }

  static async getInitialProps(ctx) {
    // We use `nextCookie` to get the cookie and pass the token to the
    // frontend in the `props`.
    const token = auth(ctx);

    const url = api_path.users
    try {
      const response = await fetch(url, {
        headers: get_auth_header(token)
      })
      console.log("$", response)
      if (response.ok) {
        return await response.json()
      } else {
        console.log("E1")
        console.log(response)
      }
    } catch (error) {
      // Implementation or Network error
      console.log("E2")
      console.log(error)
    }
  }
}
export default Profile