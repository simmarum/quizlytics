import fetch from 'isomorphic-unfetch'
import Layout from '../components/MyLayout'
import nextCookie from 'next-cookies'
import { Component } from 'react'
import { auth, get_auth_header } from '../utils/auth'
import { api_path, fetch_get, fetch_patch } from '../utils/api_path'
import { get_all_from_api } from '../utils/get_data'

class Profile extends Component {
  constructor(props) {
    super(props)

    const user_profile = props.user_data.results[0]
    const cities_data_sort = props.cities_data.sort((a, b) => (a.name > b.name) ? 1 : -1)
    this.state = {
      token: props.token,
      email: user_profile.email,
      url: user_profile.url,
      first_name: user_profile.first_name,
      last_name: user_profile.last_name,
      city_id: user_profile.profile.city_id,
      cities_data: cities_data_sort,
      error: ''
    }
    this.handleChangeFirstName = this.handleChangeFirstName.bind(this)
    this.handleChangeLastName = this.handleChangeLastName.bind(this)
    this.handleChangeCityId = this.handleChangeCityId.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChangeFirstName(event) {
    this.setState({ first_name: event.target.value })
  }

  handleChangeLastName(event) {
    this.setState({ last_name: event.target.value })
  }

  handleChangeCityId(event) {
    this.setState({ city_id: event.target.value })
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
        <div className='user_profile'>
          <div className='tt'>Profile</div>
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
              type='text'
              id='last_name'
              name='last_name'
              autoComplete='last_name'
              value={this.state.last_name}
              onChange={this.handleChangeLastName}
            />
            <label htmlFor='city_id'>City</label>
            <select
              id='city_id'
              name='city_id'
              value={this.state.city_id}
              onChange={this.handleChangeCityId}>
              {this.state.cities_data.map(function (element) {
                return <option
                  key={element.id}
                  value={element.id}>
                  {element.name}
                </option>;

              }.bind(this))
              }
            </select>
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
    const token = await auth(ctx);
    const user_data = await fetch_get(
      this,
      api_path.users,
      token
    )
    const cities_data = await get_all_from_api(
      this,
      api_path.cities,
      null
    )
    return {
      "token": token,
      "user_data": user_data,
      "cities_data": cities_data,
    }
  }
}
export default Profile