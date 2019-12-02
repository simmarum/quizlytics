import fetch from 'isomorphic-unfetch'
import Layout from '../components/MyLayout'
import nextCookie from 'next-cookies'
import { auth, get_auth_header } from '../utils/auth'
import { api_path } from '../utils/api_path'

const Profile = props => {
  console.log("!!!", props)
  return (
    <div>
      <h1>Profile</h1>

      <style jsx>{`
        img {
          max-width: 200px;
          border-radius: 0.5rem;
        }
        h1 {
          margin-bottom: 0;
        }
        .lead {
          margin-top: 0;
          font-size: 1.5rem;
          font-weight: 300;
          color: #666;
        }
        p {
          color: #6a737d;
        }
      `}</style>
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
      // credentials: 'always',
      headers: get_auth_header(token)
    })
    console.log("$", response)
    if (response.ok) {
      return await response.json()
    } else {
      console.log("E1")
      console.log(response)
      // https://github.com/developit/unfetch#caveats
      // return redirectOnError()
    }
  } catch (error) {
    // Implementation or Network error

    console.log("E2")
    console.log(error)
    // return redirectOnError()
  }
}

export default Profile