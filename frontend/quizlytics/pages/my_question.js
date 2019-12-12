import fetch from 'isomorphic-unfetch'
import Layout from '../components/MyLayout'
import nextCookie from 'next-cookies'
import { Component } from 'react'
import Link from 'next/link';
import { auth, get_auth_header } from '../utils/auth'
import { api_path, fetch_get, fetch_patch, encodeQueryData } from '../utils/api_path'
import { get_all_from_api, get_user_id_from_api } from '../utils/get_data'

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
          <div>
            <Link href="/question/create">
              <a>Create</a>
            </Link>
          </div>
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
    const user_id = await get_user_id_from_api(ctx, token);
    const query = encodeQueryData({ "owner_id": user_id })
    const url = api_path['questions'] + "?" + query
    const questions = await get_all_from_api(ctx, url, token)
    console.log(questions)
    return {
      "token": token,
      "user_id": user_id,
    }
  }
}
export default MyQuestion