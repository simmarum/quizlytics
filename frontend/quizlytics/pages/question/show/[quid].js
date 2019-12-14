import { Component } from 'react'
import { auth } from '../../../utils/auth'
import { get_all_from_api } from '../../../utils/get_data'
import { api_path, encodeQueryData } from '../../../utils/api_path'


class MyQuestionShow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      questions: props.questions,
      token: props.token,
      error: '',
      success: '',
    }
  }

  render() {
    return (
      <div>
        <div className='col-12 my_question'>
          <div className='row tt'>My Questions - show all versions</div>
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