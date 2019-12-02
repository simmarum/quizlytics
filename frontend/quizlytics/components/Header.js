import Link from 'next/link';
import nextCookie from 'next-cookies';

const linkStyle = {
    marginRight: 15
};

const Header = props => {
    console.log("@", props)

    if (!props.is_logged) {
        return (
            <div>
                <Link href="/">
                    <a style={linkStyle}>Home</a>
                </Link>
                <Link href="/about">
                    <a style={linkStyle}>About</a>
                </Link>
                <Link href="/login">
                    <a style={linkStyle}>Login/Register</a>
                </Link>
            </div>
        );
    } else {
        return (
            <div>
                <Link href="/">
                    <a style={linkStyle}>Home</a>
                </Link>
                <Link href="/about">
                    <a style={linkStyle}>About</a>
                </Link>
                <Link href="/logout">
                    <a style={linkStyle}>Logout</a>
                </Link>
            </div>
        );
    }
}


export default Header;