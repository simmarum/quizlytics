import { Component } from 'react'
import Link from 'next/link';
import { auth } from '../utils/auth'
import { api_path, fetch_get, fetch_delete, encodeQueryData } from '../utils/api_path'
import { get_all_from_api, get_user_id_from_api } from '../utils/get_data'
import Router from 'next/router'

class MyQuestion extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user_id: props.user_id,
      token: props.token,
      questions_next: props.questions.next,
      questions: props.questions.results,
      error: '',
      success: '',
    }
    this.load_more_questions = this.load_more_questions.bind(this)
    this.remove_question = this.remove_question.bind(this)
  }

  async remove_question(uid) {
    const url = api_path['questions'] + uid + "/"
    const api_date = await fetch_delete(
      this,
      url,
      this.state.token
    )
    var questions = await MyQuestion.get_questions(
      this,
      this.state.user_id,
      this.state.token)
    this.setState({
      "questions_next": questions.next,
      "questions": questions.results,
    })
  }
  async load_more_questions() {
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
                <button
                  onClick={() => Router.push('/question/show/' + element.uid)}
                  className="btn" >Versions</button>
                <button
                  onClick={() => this.remove_question(element.id)}
                  className="btn" >Delete</button>
                <div className="col-12">{element.city_name}</div>
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
          <pre className={`success ${this.state.success && 'show'}`}>
            Success
          </pre>
          <pre className={`error ${this.state.error && 'show'}`}>
            {this.state.error && `${JSON.stringify(this.state.error, null, 2)}`}
          </pre>
        </div>
      </div >
    )
  }

  static async get_questions(ctx, user_id, token) {
    const query = encodeQueryData({ "user_id": user_id })
    const url = api_path['questions'] + "?" + query
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
      questions.results[index]['answers'] = answers.filter(
        (e) => e.question_id == questions.results[index]['id'])
    }
    return questions
  }

  static async getInitialProps(ctx) {
    const token = await auth(ctx);
    const user_id = await get_user_id_from_api(ctx, token);
    var questions = await MyQuestion.get_questions(ctx, user_id, token)
    return {
      "user_id": user_id,
      "token": token,
      "questions": questions
    }
  }
}

export default MyQuestion