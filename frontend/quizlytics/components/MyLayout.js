import Header from './Header';

const layoutStyle = {
  margin: 20,
  padding: 20,
  border: '1px solid #DDD'
};

const Layout = props => {
  let header_pros = {}
  header_pros.is_logged = props.is_logged
  return (
    <div>
      <Header {...header_pros} />
      {props.children}

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
        .header {
          margin: 0 auto;
          padding: 1rem;
        }
        .header a, button {
          background-color: #cccccc;
          color: white;
          padding: 0.5em 1em;
          position: relative;
          text-decoration: none;
          text-transform: uppercase;
        }
        .header a:hover, button:hover {
          background-color: #888888;
        }
        .header a:active, button:active {
          box-shadow: none;
          top: 5px;
        }

        .tt {
          font-weight: 600;
          font-size: 2rem;
          margin: 1rem;
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