import Header from './Header';

const layoutStyle = {
    margin: 20,
    padding: 20,
    border: '1px solid #DDD'
};

const Layout = props => {
    console.log("^", props)
    let header_pros = {}
    header_pros.is_logged = props.is_logged
    return (
        <div style={layoutStyle}>
            <Header {...header_pros} />
            {props.children}
        </div>
    );
}

export default Layout;