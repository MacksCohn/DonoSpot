const { signInWithEmailAndPassword, createUserWithEmailAndPassword } = window.firebase;
const { collection, getDocs, useState } = window.firebase;
const { LoginForm, GetPageIdFromUser } = window.loginForm;
const urlParams = new URLSearchParams(window.location.search);
let hereToCreate = urlParams.get('hereToCreate') || 'false';


function Main() {
    const { useState } = React;
    const [creating, setCreating] = useState(hereToCreate === 'true');
    const [text, setText] = useState('');

    const Signup = () => {
        const email = $('#email').val();
        const password = $('#password').val();
        console.log(email, password);
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user, user.uid);
                localStorage.setItem('UID', user.uid);
                localStorage.setItem('hasPage', 'false');
                setCreating(true);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            });
    }

    if (!creating)
        return(
            <div id='login-box'>
            <h1>Login to DonoSpot</h1>
            <LoginForm loginFunction={Login} signupFunction={Signup} />
            </div>
        );
    else
        return(
            <div id='login-box'>
            <h1>Create Charity</h1>
            <form>
            <label>Charity Name</label><br />
            <input 
            type='text'
            id='name' 
            value={text}
            placeholder='Charity Name'
            onChange={(event) => setText(event.target.value)}
            />
            <br/ ><br />

            <button type='button' onClick={CreateCharityPage}>Create Page</button>
            <button type='button' onClick={() => window.location.href = 'index.html'}>Browse</button>
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

function CreateCharityPage() {
    const { collection, addDoc } = window.firebase;
    const name = $('#name').val();
    const user = localStorage.getItem('UID');
    const data = {
        Name: name,
        Categories: "Categories:",
        Bio: "",
        OwnerUID: user,
        donate: "",
    }
    addDoc(collection(db, 'charities'), data)
        .then(
            data => window.location.href = `charity.html?cid=${data.id}`
        );
    localStorage.setItem('hasPage', 'true');
}

function Login() {
    const email = $('#email').val();
    const password = $('#password').val();
    console.log(email, password);
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            localStorage.setItem('UID', user.uid);
            GetPageIdFromUser(user.uid)
                .then(page => {
                    if (page != null) {
                        window.location.href = `charity.html?cid=${page}`;
                        localStorage.setItem('hasPage', 'true');
                    }
                    else {
                        window.location.href = `login.html?hereToCreate=true`;
                        localStorage.setItem('hasPage', 'false');
                    }
                });
        })
        .catch((error) => {
            const errorMessage = error.message;
            $('#error-messages').text(errorMessage.substring(errorMessage.indexOf(':')+1), '<br />');
        });
}

// Test with
// admin@redcross.org
// password
// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const mainRoot = ReactDOM.createRoot($('main')[0]);
mainRoot.render(<Main />);
