import { Component } from 'react'
import { auth, get_auth_header } from '../../utils/auth'
import { api_path, fetch_get, fetch_patch, fetch_post } from '../../utils/api_path'

class MyQuestionCreate extends Component {
  constructor(props) {
    super(props)

    this.state = {
      q_title: '',
      token: props.token,
      error: ''
    }
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
    console.log(user_data)
  }

  add_answer() {
    var q_answers = document.getElementById("q_answers");
    var all_answers = document.getElementsByClassName("q_answer");
    var new_id = 1;
    var i = 0;
    var j = all_answers.length
    for (; i < j; i++) {
      new_id = Math.max(parseInt(all_answers[i].getAttribute("id_int"), 10), new_id) + 1
    }

    var new_answer = document.createElement('div');
    new_answer.setAttribute("class", "q_answer");
    new_answer.setAttribute("id_int", new_id);
    let div_id = "a_" + new_id
    new_answer.setAttribute("id", div_id);

    var tb = document.createElement('button');
    tb.setAttribute("data-div_id", div_id)
    tb.addEventListener('click', function () {
      var div_id_to_rm = this.getAttribute("data-div_id")
      var div_to_rm = document.getElementById(div_id_to_rm)
      div_to_rm.parentNode.removeChild(div_to_rm);
    });
    tb.innerHTML = "Remove"

    var ti = document.createElement('input');
    ti.setAttribute("class", "question");
    ti.type = "text"
    ti.id = `aa_${new_id}`
    ti.innerHTML = `Answer ${new_id}`

    new_answer.appendChild(tb)
    new_answer.appendChild(ti)
    q_answers.appendChild(new_answer)

  }
  render() {
    return (
      <div>
        <div className='my_question'>
          <div className='tt'>My Questions - create</div>
          <div>
            <button onClick={this.add_answer}>Add answer</button>
            <button onClick={this.save_question}>Save question</button>
          </div>
          <div id='q_title'>
            <label htmlFor='q_title'>Question title</label>
            <input
              type='text'
              id='q_title'
              name='q_title'
              className="question"
              value={this.state.q_title}
              onChange={this.handleChangeQTitle}
            />
          </div>
          <div id='q_answers'>
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
    return {
      "token": token,
    }
  }
}
export default MyQuestionCreate