const { Component } = React;
window.headerFile = window.headerFile || {};

class Header extends Component {
    render() {
        return(
            <>
            <a href="index.html"><div className="logo">DONO<span className="heart">❤</span>SPOT</div></a>
            <LoginButton />
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

window.headerFile.Header = Header;
