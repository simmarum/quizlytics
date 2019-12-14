import { Component } from 'react'
import { auth } from '../../utils/auth'
import { add_answer } from '../../utils/question'
import { api_path, fetch_post } from '../../utils/api_path'
import Router from 'next/router'

class MyQuestionCreate extends Component {
  constructor(props) {
    super(props)

    this.state = {
      q_title: '',
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
          <div className='row tt'>My Questions - create</div>
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
          </div>
          <pre className={`error ${this.state.error && 'show'}`}>
            {this.state.error && `${JSON.stringify(this.state.error, null, 2)}`}
          </pre>
        </div>
      </div>
    )
  }

  static async getInitialProps(ctx) {
    const token = await auth(ctx);
    return {
      "token": token,
    }
  }
}
export default MyQuestionCreate