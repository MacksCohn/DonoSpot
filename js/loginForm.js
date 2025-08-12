const { Component } = React;
window.loginForm = window.loginForm || {};

class LoginForm extends Component {
    componentDidMount() {
        $('#login-form').validate({
            onkeyup: function(element, event) {
                $('#login-form').valid();
            },
            rules: {
                email: {
                    required: true,
                    email: true,
                },
                password: {
                    required: true,
                    minlength: 8,
                }
            },
            messages: {
                email: 'Please enter a valid email address.',
                password: {
                    required: 'Please enter a password',
                    minlength: 'Password must be at least 8 characters',
                }
            },
        });
    }
    render() {
        const { loginFunction, signupFunction } = this.props;
        return(
            <form id='login-form'>
                <label>Email</label><br />
                <input type="email" id="email" name='email' />
                <br /><br />
                <label>Password</label><br />
                <input type="password" id="password" name='password' />
                <br /><br />
                <LoginButtons loginFunction={loginFunction} signupFunction={signupFunction}/>
                <br />
                <span id='error-messages' className='error'></span>
            </form>
        );
    }   
}

function LoginButtons( {loginFunction, signupFunction} ) {
    return(
        <div id='login-button-container'>
        <button id='login-button' type="button" onClick={loginFunction}>Login</button>
        <button id='signup-button' type="button" onClick={signupFunction}>Signup</button>
        </div>
    );
}


// either returns id or null
async function GetPageIdFromUser(user) {
    let userPage = null;
    const querySnapshot = await getDocs(collection(db, "charities"))
    querySnapshot.forEach((doc) => {
        if (doc.data()['OwnerUID'] === user)
            userPage = doc.id;
    });
    return userPage;
}

window.loginForm.LoginForm = LoginForm;
window.loginForm.GetPageIdFromUser = GetPageIdFromUser;
