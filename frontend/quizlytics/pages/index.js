import fetch from 'isomorphic-unfetch'
import Layout from '../components/MyLayout'
import nextCookie from 'next-cookies'
import { Component } from 'react'
import Link from 'next/link';
import { auth, get_auth_header } from '../utils/auth'
import { api_path, fetch_get, fetch_patch, encodeQueryData } from '../utils/api_path'
import { get_all_from_api, get_user_id_from_api } from '../utils/get_data'
import Router from 'next/router'

class Analytics extends Component {
  constructor(props) {
    super(props)

    this.state = {
      token: props.token,
      questions_next: props.questions.next,
      questions: props.questions.results,
      error: ''
    }
    this.load_more_questions = this.load_more_questions.bind(this)
  }

  async load_more_questions() {
    console.log("#@#", this)
    const url = this.state.questions_next
    const token = this.state.token
    var questions = this.state.questions

    var new_questions = await fetch_get(
      this,
      this.state.questions_next,
      this.state.token
    )
    for (let index = 0; index < new_questions.results.length; index++) {
      const aquery = encodeQueryData({
        "uid": new_questions.results[index]['uid'],
        "id": new_questions.results[index]['id']
      })
      const aurl = api_path['questions_answers'] + "?" + aquery
      const answers = await get_all_from_api(this, aurl, token)
      console.log("!", index, answers)
      new_questions.results[index]['answers'] = answers.filter(
        (e) => e.question_id == new_questions.results[index]['id'])
    }
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
  render() {
    return (
      <div>
        <div className='col-12 my_question'>
          <div className='row tt'><h1>Welcome to Analytics Questions</h1></div>

          <div className="col-12" id='questions'>
            {this.state.questions.map(function (element) {
              return <div key={element.id} className="row question_row">
                <div className="col-12">{element.title}</div>
                {element.answers.map(function (answer) {
                  return <div className="col-12" key={answer.answer_number}>
                    <span className="bold">{answer.answer_number}. </span>{answer.answer_text}
                  </div>
                })}
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
      </div >
    )
  }

  static async getInitialProps(ctx) {
    // We use `nextCookie` to get the cookie and pass the token to the
    // frontend in the `props`.
    const token = await auth(ctx);
    const url = api_path['questions']
    // const questions = await get_all_from_api(ctx, url, token)
    var questions = await fetch_get(
      ctx,
      url,
      token,
    )
    for (let index = 0; index < questions.results.length; index++) {
      const aquery = encodeQueryData({
        "uid": questions.results[index]['uid'],
        "id": questions.results[index]['id']
      })
      const aurl = api_path['questions_answers'] + "?" + aquery
      const answers = await get_all_from_api(ctx, aurl, token)
      console.log("!", index, answers)
      questions.results[index]['answers'] = answers.filter(
        (e) => e.question_id == questions.results[index]['id'])
    }

    return {
      "token": token,
      "questions": questions
    }
  }
}
export default Analytics