import fetch from 'isomorphic-unfetch'
import Layout from '../components/MyLayout'
import nextCookie from 'next-cookies'
import { Component } from 'react'
import { auth, get_auth_header } from '../utils/auth'
import { api_path, fetch_get, fetch_patch } from '../utils/api_path'
import { get_all_from_api } from '../utils/get_data'

class MyQuestion extends Component {
  constructor(props) {
    super(props)

    this.state = {
      token: props.token,
      error: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async handleSubmit(event) {
    event.preventDefault()
    const url = this.state.url
    const token = await auth(this);
    const p_body = JSON.stringify({
      "first_name": this.state.first_name,
      "last_name": this.state.last_name,
      "profile": {
        'city_id': this.state.city_id
      }
    })
    const user_data = await fetch_patch(
      this,
      url,
      token,
      p_body
    )
  }

  render() {
    return (
      <div>
        <div className='my_question'>
          <div className='tt'>My Questions</div>
          <pre className={`error ${this.state.error && 'show'}`}>
            {this.state.error && `${JSON.stringify(this.state.error, null, 2)}`}
          </pre>
        </div>
      </div>
    )
  }

  static async getInitialProps(ctx) {
    // We use `nextCookie` to get the cookie and pass the token to the
    // frontend in the `props`.
    const token = await auth(ctx);
    return {
      "token": token,
    }
  }
}
export default MyQuestion