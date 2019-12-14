import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import Layout from '../components/MyLayout'
import { login, auth } from '../utils/auth'
import { api_path, fetch_post } from '../utils/api_path'
import Router from 'next/router'



class Contact extends Component {

    constructor(props) {
        super(props)

        this.state = {
            subject: '',
            message: '',
            email: '',
            password: '',
            error: ''
        }
        this.handleChangeSubject = this.handleChangeSubject.bind(this)
        this.handleChangeMessage = this.handleChangeMessage.bind(this)
        this.handleChangeEmail = this.handleChangeEmail.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChangeSubject(event) {
        this.setState({ subject: event.target.value })
    }
    handleChangeMessage(event) {
        this.setState({ message: event.target.value })
    }
    handleChangeEmail(event) {
        this.setState({ email: event.target.value })
    }


    async handleSubmit(event) {
        event.preventDefault()
        const subject = this.state.subject
        const message = this.state.message
        const email = this.state.email

        const url = api_path['mail_send']
        const p_body = JSON.stringify({ subject, message, "to_email": email })
        const api_data = await fetch_post(this, url, null, p_body)

        if (typeof api_data !== "undefined") {
            this.setState({ subject: "", message: "", email: "" })
        }
    }

    render() {
        return (
            <div>
                <div className='row contact'>
                    <div className='col-12 tt'>Contact</div>
                    <form className='col-12' onSubmit={this.handleSubmit}>
                        <label htmlFor='subject'>Subject</label>
                        <input
                            type='subject'
                            id='subject'
                            name='subject'
                            value={this.state.subject}
                            onChange={this.handleChangeSubject}
                        />
                        <label htmlFor='message'>Message</label>
                        <textarea
                            id='message'
                            name='message'
                            value={this.state.message}
                            onChange={this.handleChangeMessage}
                        ></textarea>
                        <label htmlFor='email'>E-mail</label>
                        <input
                            type='text'
                            id='email'
                            name='email'
                            autoComplete='email'
                            value={this.state.email}
                            onChange={this.handleChangeEmail}
                        />
                        <button className="btn" type='submit'>Send mail</button>

                        <pre className={`error ${this.state.error && 'show'}`}>
                            {this.state.error && `${JSON.stringify(this.state.error, null, 2)}`}
                        </pre>
                    </form>
                </div>
            </div>
        )
    }
}

export default Contact