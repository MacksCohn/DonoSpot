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
        return(
            <form id='login-form'>
                <label>Email</label><br />
                <input type="email" id="email" name='email' />
                <br /><br />
                <label>Password</label><br />
                <input type="password" id="password" name='password' />
                <br /><br />
                <LoginButtons loginFunction={Login} signupFunction={Signup}/>
                <br />
                <span id='error-messages' className='error'></span>
            </form>
        );
    }   
}

window.loginForm.LoginForm = LoginForm;
