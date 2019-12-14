import Link from 'next/link';


const Header = props => {
  if (!props.is_logged) {
    return (
      <div className="header row">
        <Link href="/">
          <a className="col">Questions</a>
        </Link>
        <Link href="/contact">
          <a className="col">Contact</a>
        </Link>
        <Link href="/login">
          <a className="col">Login</a>
        </Link>
        <Link href="/register">
          <a className="col">Register</a>
        </Link>
      </div>
    );
  } else {
    return (
      <div className="header row">
        <Link href="/">
          <a className="col">Questions</a>
        </Link>
        <Link href="/my_question">
          <a className="col">My&nbsp;Questions</a>
        </Link>
        <Link href="/profile">
          <a className="col">Profile</a>
        </Link>
        <Link href="/contact">
          <a className="col">Contact</a>
        </Link>
        <Link href="/logout">
          <a className="col">Logout</a>
        </Link>
      </div>
    );
  }
}


export default Header;