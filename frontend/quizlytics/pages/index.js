import { Component } from 'react'
import { auth } from '../utils/auth'
import { api_path, fetch_get, encodeQueryData } from '../utils/api_path'
import { get_all_from_api } from '../utils/get_data'

class Analytics extends Component {
  constructor(props) {
    super(props)
    if (typeof props.questions === 'undefined') {
      props.questions.next = null
      props.questions.results = []
    }
    this.state = {
      s_text: '',
      token: props.token,
      questions_next: props.questions.next,
      questions: props.questions.results,
      error: '',
      success: '',
    }
    this.handleChangeSText = this.handleChangeSText.bind(this)
    this.get_questions_search = this.get_questions_search.bind(this)
    this.load_more_questions = this.load_more_questions.bind(this)
    this.check_load_button = this.check_load_button.bind(this)
  }

  check_load_button() {
    var load_button = document.getElementById('load_more_questions')
    if (this.state.questions_next == null) {
      load_button.disabled = true
    } else {
      load_button.disabled = false
    }
  }

  async get_questions_search() {
    var new_questions = await Analytics.get_questions(
      this,
      this.state.token,
      this.state.s_text)
    this.setState({ "questions_next": new_questions.next })
    this.setState({ "questions": new_questions.results })
    this.check_load_button()

  }
  handleChangeSText(event) {
    this.setState({ s_text: event.target.value })
  }

  async load_more_questions() {
    const token = this.state.token
    var questions = this.state.questions

    var new_questions = await fetch_get(
      this,
      this.state.questions_next,
      this.state.token
    )
    if (typeof new_questions.results !== 'undefined') {
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
    }

    this.setState({ "questions_next": new_questions.next })
    this.setState({ "questions": questions })
    this.check_load_button()
  }
  render() {
    return (
      <div>
        <div className='col-12 my_question'>
          <div className='row tt'><h1>Welcome to Analytics Questions</h1></div>
          <div className="row align-items-center">
            <input className="col-4 offset-1"
              value={this.s_text}
              placeholder="Search by title and city"
              onChange={this.handleChangeSText}
            ></input>
            <div className="col-2">
              <button
                className="btn "
                id="search_question"
                onClick={this.get_questions_search}>Search</button>
            </div>
          </div>
          <div className="col-12" id='questions'>
            {this.state.questions.map(function (element) {
              return <div key={element.id} className="row question_row">
                <div className="col-2">[{element.city_name}]</div>
                <div className="col-9">{element.title}</div>
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
  static async get_questions(ctx, token, s_text) {
    var url = api_path['questions']
    if (s_text != null) {
      const tquery = encodeQueryData({
        "search": s_text,
      })
      url = url + "?" + tquery
    }
    var questions = await fetch_get(
      ctx,
      url,
      token,
    )
    if (typeof questions !== 'undefined') {
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
    }
    return questions
  }
  static async getInitialProps(ctx) {
    const token = await auth(ctx);
    var questions = await Analytics.get_questions(ctx, token, null)
    return {
      "token": token,
      "questions": questions
    }
  }
}

export default Analytics