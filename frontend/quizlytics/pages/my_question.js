import fetch from 'isomorphic-unfetch'
import Layout from '../components/MyLayout'
import nextCookie from 'next-cookies'
import { Component } from 'react'
import Link from 'next/link';
import { auth, get_auth_header } from '../utils/auth'
import { api_path, fetch_get, fetch_patch, encodeQueryData } from '../utils/api_path'
import { get_all_from_api, get_user_id_from_api } from '../utils/get_data'
import Router from 'next/router'

class MyQuestion extends Component {
  constructor(props) {
    super(props)

    this.state = {
      token: props.token,
      questions_next: props.questions.next,
      questions: props.questions.results,
      error: ''
    }
    this.load_more_questions = this.load_more_questions.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async load_more_questions() {
    console.log("#@#", this)
    const url = this.state.questions_next
    const token = this.state.token
    var questions = this.state.questions

    const new_questions = await fetch_get(
      this,
      this.state.questions_next,
      this.state.token
    )
    questions = questions.concat(new_questions.results)
    var load_button = document.getElementById('load_more_questions')
    if (new_questions.next == null) {
      load_button.disabled = true
    } else {
      load_button.disabled = false
    }
    this.setState({ "questions_next": new_questions.next })
    this.setState({ "questions": questions })

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
        <div className='col-12 my_question'>
          <div className='row tt'>My Questions</div>
          <div className="row question">
            <Link href="/question/create">
              <a className="btn">Create</a>
            </Link>
          </div>
          <div className="col-12" id='questions'>
            {this.state.questions.map(function (element) {
              return <div key={element.id} className="row question_row">
                <button
                  onClick={() => Router.push('/question/edit/' + element.uid)}

                  className="btn" >Edit</button>
                <span className="col-6" >{element.title}</span>
              </div>;
            }.bind(this))
            }
          </div>
          <div className="question">
            <button
              className="btn"
              id="load_more_questions"
              onClick={this.load_more_questions}>Load more ...</button>
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
    // const questions = await get_all_from_api(ctx, url, token)
    const questions = await fetch_get(
      ctx,
      url,
      token,
    )
    return {
      "token": token,
      "questions": questions
    }
  }
}
export default MyQuestion