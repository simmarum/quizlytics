import { Component } from 'react'
import { api_path, fetch_post } from '../utils/api_path'
import Router from 'next/router'
import { get_all_from_api } from '../utils/get_data'



class Register extends Component {
  constructor(props) {
    super(props)
    const cities_data_sort = props.cities_data.sort((a, b) => (a.name > b.name) ? 1 : -1)

    this.state = {
      email: '',
      first_name: '',
      last_name: '',
      city_id: 1,
      password: '',
      cities_data: cities_data_sort,
      error: '',
      success: '',
    }
    this.handleChangeEmail = this.handleChangeEmail.bind(this)
    this.handleChangeFirstName = this.handleChangeFirstName.bind(this)
    this.handleChangeLastName = this.handleChangeLastName.bind(this)
    this.handleChangeCityId = this.handleChangeCityId.bind(this)
    this.handleChangePassword = this.handleChangePassword.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChangeEmail(event) {
    this.setState({ email: event.target.value })
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

  handleChangePassword(event) {
    this.setState({ password: event.target.value })
  }

  async handleSubmit(event) {
    event.preventDefault()
    const email = this.state.email
    const first_name = this.state.first_name
    const last_name = this.state.last_name
    const password = this.state.password
    const city_id = this.state.city_id
    const url = api_path['users']
    const p_body = JSON.stringify(
      { email, first_name, last_name, password, 'profile': { city_id } }
    )
    const api_data = await fetch_post(this, url, null, p_body)
    if (typeof api_data !== 'undefined') {
      Router.push('/login')
    }

  }

  render() {
    return (
      <div>
        <div className='row register'>
          <div className='col-12 tt'>Register</div>
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
            <label htmlFor='first_name'>First Name</label>
            <input
              type='text'
              id='first_name'
              name='first_name'
              value={this.state.first_name}
              onChange={this.handleChangeFirstName}
            />
            <label htmlFor='last_name'>Last Name</label>
            <input
              type='text'
              id='last_name'
              name='last_name'
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
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              id='password'
              name='password'
              autoComplete='current-password'
              value={this.state.password}
              onChange={this.handleChangePassword}
            />
            <button className="btn" type='submit'>Register</button>
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
  static async getInitialProps(ctx) {
    const cities_data = await get_all_from_api(
      this,
      api_path.cities,
      null
    )
    return {
      "cities_data": cities_data,
    }
  }
}

export default Register