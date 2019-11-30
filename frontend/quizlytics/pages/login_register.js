import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import Layout from '../components/MyLayout'
import { login } from '../utils/auth'
import { api_path } from '../utils/api_path'

class Login extends Component {

    constructor(props) {
        super(props)

        this.state = { email: '', password: '', error: '' }
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

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            })
            if (response.ok) {
                const { token } = await response.json()
                login({ token })
            } else {
                console.log('Login failed.')
                // https://github.com/developit/unfetch#caveats
                let error = new Error(response.statusText)
                error.response = response
                return Promise.reject(error)
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
            <Layout>
                <div className='login'>
                    <form onSubmit={this.handleSubmit}>
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
                        <button type='submit'>Login</button>

                        <p className={`error ${this.state.error && 'show'}`}>
                            {this.state.error && `Error: ${this.state.error}`}
                        </p>
                    </form>
                </div>
                <style jsx>{`
          .login {
            max-width: 340px;
            margin: 0 auto;
            padding: 1rem;
            border: 1px solid #ccc;
            border-radius: 4px;
          }
          form {
            display: flex;
            flex-flow: column;
          }
          label {
            font-weight: 600;
          }
          input {
            padding: 8px;
            margin: 0.3rem 0 1rem;
            border: 1px solid #ccc;
            border-radius: 4px;
          }
          .error {
            margin: 0.5rem 0 0;
            display: none;
            color: brown;
          }
          .error.show {
            display: block;
          }
        `}</style>
            </Layout>
        )
    }
}

export default Login