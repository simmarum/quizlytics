import Header from './Header';
import Head from 'next/head'
import { Container } from 'reactstrap'

const Layout = props => {
  let header_pros = {}
  header_pros.is_logged = props.is_logged
  return (
    <div>
      <Head>
        <title>Analytics</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" />
      </Head>
      <Container>
        <Header {...header_pros} />
        {props.children}
      </Container>


      <style jsx global>{`
        .login, .user_profile, .register{
          max-width: 340px;
          margin: 0 auto;
          padding: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .my_question {
          max-width: 680px;
          margin: 0 auto;
          padding: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .question_row {
          max-width: 680px;
          margin: 1em 0em 0em 0em;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .question_row:nth-child(even) {background: #BBB}
        .question_row:nth-child(odd) {background: #EEE}

        .header {
          margin: 0 auto;
          padding: 1rem;
        }
        a, button {
          background-color: #cccccc;
          color: white;
          padding: 0.5em 1em;
          margin-right: 0.5em;
          margin-bottom: 0.5em;
          position: relative;
          text-decoration: none;
          text-transform: uppercase;
        }
        a:hover, button:hover {
          background-color: #888888;
        }
        a:active, button:active {
          box-shadow: none;
          top: 5px;
        }
        button:disabled,
        button[disabled] {
          background-color: #444444;

        }
        .tt {
          font-weight: 600;
          font-size: 2rem;
          margin: 1rem;
        }
        .question {
          margin: 0.5rem 0 0.5rem 1rem;
        }
        form {
          display: flex;
          flex-flow: column;
        }

        label {
          font-weight: 600;
        }
        input, select {
          padding: 8px;
          margin: 0.3rem 0 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        input:read-only {
            background-color: #bbbbbb;
          }
        .error {
          margin: 0.5rem 0 0;
          display: none;
          color: brown;
        }
        .error.show {
          display: block;
        }
        pre {
          white-space: pre-wrap;       /* Since CSS 2.1 */
          white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
          white-space: -pre-wrap;      /* Opera 4-6 */
          white-space: -o-pre-wrap;    /* Opera 7 */
          word-wrap: break-word;       /* Internet Explorer 5.5+ */
        }
      `}</style>
    </div>
  );
}

export default Layout;