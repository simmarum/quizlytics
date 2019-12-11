import { Component } from 'react'
import { logout } from '../utils/auth'



class Logout extends Component {

}

Logout.getInitialProps = async ctx => {
  // We use `nextCookie` to get the cookie and pass the token to the
  // frontend in the `props`.
  logout()
  return {}
}

export default Logout