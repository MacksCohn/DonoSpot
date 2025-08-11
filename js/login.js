const { signInWithEmailAndPassword, createUserWithEmailAndPassword } = window.firebase;
const { collection, getDocs, useState } = window.firebase;
const urlParams = new URLSearchParams(window.location.search);
const { LoginForm } = window.loginForm;
let hereToCreate = urlParams.get('hereToCreate') || 'false'; // Default to American Red Cross if no ID

const Signup = () => {
    const email = $('#email').val();
    const password = $('#password').val();
    console.log(email, password);
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(user, user.u.idid);
            localStorage.setItem('UID', user.uid);
            setCreating(true);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        });
}

function Main() {
    const { useState } = React;
    const [creating, setCreating] = useState(hereToCreate === 'true');
    const [text, setText] = useState('');


    if (!creating)
        return(
            <div id='login-box'>
            <h1>Login to DonoSpot</h1>
            <LoginForm />
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
                    if (page != null)
                        window.location.href = `charity.html?cid=${page}`;
                    else
                        window.location.href = `login.html?hereToCreate=true`;
                });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        });
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

// Test with
// admin@redcross.org
// password
// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const mainRoot = ReactDOM.createRoot($('main')[0]);
mainRoot.render(<Main />);
