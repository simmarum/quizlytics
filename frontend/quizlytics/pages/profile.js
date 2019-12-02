import fetch from 'isomorphic-unfetch'
import Layout from '../components/MyLayout'
import nextCookie from 'next-cookies'
import { auth, get_auth_header } from '../utils/auth'
import { api_path } from '../utils/api_path'

const Profile = props => {
  const user_profile = props.results[0]
  console.log("#@", user_profile)
  return (
    <div>
      <h1>Profile</h1>

    </div>
  )
}

Profile.getInitialProps = async ctx => {
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
      console.log(response)
    }
  } catch (error) {
    // Implementation or Network error
    console.log(error)
  }
}

export default Profile