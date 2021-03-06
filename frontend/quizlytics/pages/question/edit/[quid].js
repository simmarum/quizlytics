import { Component } from 'react'
import { auth } from '../../../utils/auth'
import { add_answer } from '../../../utils/question'
import { get_all_from_api } from '../../../utils/get_data'
import { api_path, fetch_post, encodeQueryData } from '../../../utils/api_path'
import Router from 'next/router'


class MyQuestionShow extends Component {
  constructor(props) {
    super(props)
    this.quid = props.quid;
    var qt = JSON.parse(JSON.stringify(props.questions[0]['title']));
    var qa = JSON.parse(JSON.stringify(props.questions[0]['answers']));
    this.state = {
      q_title: qt,
      q_answers: qa,
      questions: props.questions,
      token: props.token,
      error: '',
      success: '',
    }
    this.add_answer = add_answer
    this.handleChangeQTitle = this.handleChangeQTitle.bind(this)
    this.handleChangeAText = this.handleChangeAText.bind(this)
    this.save_question = this.save_question.bind(this)
  }

  handleChangeQTitle(event) {
    this.setState({ q_title: event.target.value })
  }

  handleChangeAText(event) {
    var a = this.state.q_answers
    a[parseInt(event.target.getAttribute('data-div_id')) - 1]['answer_text'] = event.target.value
    this.setState({ q_answers: a })
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
    const p_body = JSON.stringify({
      'q_uid': this.quid,
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
            <button className='btn offset-1' onClick={this.save_question}>Save edited question</button>
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
            {this.state.q_answers.map(function (element) {
              return <div
                className="row q_answer"
                id={element.answer_number}
                key={element.answer_number}>
                <button
                  className="btn"
                  data-div_id={element.answer_number}
                  onClick={() => {
                    document.getElementById(element.answer_number).remove()
                  }}
                >Remove</button>
                <input
                  className="col-8"
                  type="text"
                  data-div_id={element.answer_number}
                  value={element.answer_text}
                  onChange={this.handleChangeAText}></input>
              </div>
            }.bind(this))}
          </div>
          <pre className={`success ${this.state.success && 'show'}`}>
            Success
          </pre>
          <pre className={`error ${this.state.error && 'show'}`}>
            {this.state.error && `${JSON.stringify(this.state.error, null, 2)}`}
          </pre>
          <div className="col-12" id='historical_answers'>
            {this.state.questions.map(function (element) {
              return <div key={element.id} className="row question_row">
                <div className="col-2">[v.{element.version}]</div>
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
        </div>
      </div>
    )
  }

  static async getInitialProps(ctx) {
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
    return {
      "quid": quid,
      "token": token,
      "questions": questions,
    }
  }
}
export default MyQuestionShow