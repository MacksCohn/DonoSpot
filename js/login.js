const { signInWithEmailAndPassword, createUserWithEmailAndPassword } = window.firebase;

function Main() {
    return(
        <div id='login-box'>
        <h1>Login to DonoSpot</h1>
        <form>
        <label>Email:</label><br />
        <input type="email" id="email" /><br/ ><br />

        <label>Password:</label><br />
        <input type="password" id="password" /><br /><br />

        <LoginButtons loginFunction={Login} signupFunction={Signup}/>
        </form>
        </div>
    );
}

function LoginButtons( {loginFunction, signupFunction} ) {
    return(
        <div id='login-button-container'>
        <button id='login-button' type="button" onClick={loginFunction}>Login</button>
        <button id='signup-button' type="button" onClick={signupFunction}>Signup</button>
        </div>
    );
}

function Login() {
    const email = $('#email').val();
    const password = $('#password').val();
    console.log(email, password);
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            localStorage.setItem('UID', user);
            window.location.href = 'index.html';
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        });
}

function Signup() {
    const email = $('#email').val();
    const password = $('#password').val();
    console.log(email, password);
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            localStorage.setItem('UID', user);
            window.location.href = 'index.html';
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        });
}

// Test with
// admin@redcross.org
// password
// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const mainRoot = ReactDOM.createRoot($('main')[0]);
mainRoot.render(<Main />);
