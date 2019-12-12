import Link from 'next/link';


const Header = props => {
  if (!props.is_logged) {
    return (
      <div className="header">
        <Link href="/">
          <a>Home</a>
        </Link>
        <Link href="/about">
          <a>About</a>
        </Link>
        <Link href="/login">
          <a>Login</a>
        </Link>
        <Link href="/register">
          <a>Register</a>
        </Link>
      </div>
    );
  } else {
    return (
      <div className="header">
        <Link href="/">
          <a>Home</a>
        </Link>
        <Link href="/my_question">
          <a>My Questions</a>
        </Link>
        <Link href="/profile">
          <a>Profile</a>
        </Link>
        <Link href="/about">
          <a>About</a>
        </Link>
        <Link href="/logout">
          <a>Logout</a>
        </Link>
      </div>
    );
  }
}


export default Header;