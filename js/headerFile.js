const { Component } = React;
window.headerFile = window.headerFile || {};

class Header extends Component {
    render() {
        return(
            <>
            <a href="index.html"><div className="logo">DONO<span className="heart">❤</span>SPOT</div></a>
            <LoginButton /> <CreatePage />
            <br />
            </>
        );
    }
}

class LoginButton extends Component {
    render() {
        const UID = localStorage.getItem('UID');
        const Logout = () => {
            localStorage.setItem('UID', 'null');
            location.reload();
        }

        if (UID === 'null')
            return(
                <a href='login.html'>
                <button id='login'>Login/Signup</button>
                </a>
            );
        else
            return(
                <button id='login' onClick={Logout}>Log Out</button>
            );
    }
}

class CreatePage extends Component {
    render() {
        const UID = localStorage.getItem('UID');
        const hasPage = localStorage.getItem('hasPage');
        if (UID === 'null' || hasPage === 'true')
            return(
                <>
                </>
            );
        else
            return(
                <a href='login.html?hereToCreate=true'>
                    <button id='create-page'>Create My Page</button>
                </a>
            );
    }
}

window.headerFile.Header = Header;
