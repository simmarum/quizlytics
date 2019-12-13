import { Component } from 'react'
import { auth, get_auth_header } from '../../../utils/auth'
import { add_answer } from '../../../utils/question'
import { get_all_from_api } from '../../../utils/get_data'
import { api_path, fetch_get, fetch_patch, fetch_post, encodeQueryData } from '../../../utils/api_path'
import Router from 'next/router'


class MyQuestionShow extends Component {
  constructor(props) {
    super(props)

    this.state = {
      q_title: '',
      questions: props.questions,
      token: props.token,
      error: ''
    }
    this.add_answer = add_answer
    this.handleChangeQTitle = this.handleChangeQTitle.bind(this)
    this.save_question = this.save_question.bind(this)
  }

  handleChangeQTitle(event) {
    this.setState({ q_title: event.target.value })
  }
  async save_question(event) {
    event.preventDefault()
    const title = this.state.q_title
    const url = api_path['questions']
    const token = await auth(this);

    var all_answers = document.getElementsByClassName("q_answer");
    var i = 0;
    var j = all_answers.length
    var answers = []
    for (; i < j; i++) {
      answers.push({
        'answer_number': i + 1,
        'answer_text': all_answers[i].getElementsByTagName('input')[0].value,
      })
    }
    console.log(answers)
    const p_body = JSON.stringify({
      "title": title,
      "answers": answers
    })
    const user_data = await fetch_post(
      this,
      url,
      token,
      p_body
    )
    if (typeof user_data !== 'undefined') {
      Router.push('/my_question')
    }
  }


  render() {
    return (
      <div>
        <div className='col-12 my_question'>
          <div className='row tt'>My Questions - edit</div>
          <div className='row'>
            <button className='btn offset-1' onClick={() => this.add_answer(null)}>Add answer</button>
            <button className='btn offset-1' onClick={this.save_question}>Save question</button>
          </div>
          <div className="row align-items-center" id='q_title'>
            <label className="col-3" htmlFor='q_title'>Question title</label>
            <textarea
              id='q_title'
              name='q_title'
              className="col-8 question"
              value={this.state.q_title}
              onChange={this.handleChangeQTitle}
            />
          </div>
          <div className="col-12" id='q_answers'>
            {this.state.questions.map(function (element) {
              return <div key={element.id} className="row question_row">
                <div className="col-2">v.{element.version}</div>
                <div className="col-10">{element.title}</div>
                {element.answers.map(function (answer) {
                  return <div className="col-12" key={answer.answer_number}>
                    <span className="bold">{answer.answer_number}. </span>{answer.answer_text}
                  </div>
                })}
              </div>
            }.bind(this))
            }
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
    const { quid } = ctx.query;
    const token = await auth(ctx);

    const qquery = encodeQueryData({ "uid": quid })
    const qurl = api_path['questions'] + "?" + qquery
    var questions = await get_all_from_api(ctx, qurl, token)

    const aquery = encodeQueryData({ "uid": quid })
    const aurl = api_path['questions_answers'] + "?" + aquery
    const answers = await get_all_from_api(ctx, aurl, token)

    questions.forEach((o, i, a) => {
      a[i]['answers'] = answers.filter((e) => e.question_id == a[i]['id'])
    })
    console.log(questions)
    return {
      "token": token,
      "questions": questions,
    }
  }
}
export default MyQuestionShow