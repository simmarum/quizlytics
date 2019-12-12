import { Component } from 'react'
import { auth, get_auth_header } from '../../utils/auth'
import { api_path, fetch_get, fetch_patch } from '../../utils/api_path'

class MyQuestionCreate extends Component {
  constructor(props) {
    super(props)

    this.state = {
      token: props.token,
      error: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async handleSubmit(event) {
    event.preventDefault()
    const url = this.state.url
    const token = await auth(this);

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
          </div>
          <div id='q_title'>
            <label htmlFor='q_title'>Question title</label>
            <input
              type='text'
              id='q_title'
              name='q_title'
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