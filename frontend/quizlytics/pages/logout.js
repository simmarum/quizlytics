import { Component } from 'react'
import { logout } from '../utils/auth'

class Logout extends Component {

}

Logout.getInitialProps = async ctx => {
  logout()
  return {}
}

export default Logout