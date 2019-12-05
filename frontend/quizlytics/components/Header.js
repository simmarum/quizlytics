import Link from 'next/link';

const linkStyle = {
    marginRight: 15
};

const Header = props => {
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
                <Link href="/profile">
                    <a style={linkStyle}>Profile</a>
                </Link>
                <Link href="/logout">
                    <a style={linkStyle}>Logout</a>
                </Link>
            </div>
        );
    }
}


export default Header;