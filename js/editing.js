// Max Cohn
// editing.js
 
const { useState, useEffect } = React;
const profile = firebase.doc(db, "charities", "3ItNyesqTpHx1XbHNkSl");

//returns key value pairs - data.Name and data.Bio for now
async function loadProfile() {
    const snap = await firebase.getDoc(profile);
    const data = snap.data();
    return data; 
}

//capital = db, lowecase = local
async function saveProfile(name, categories, bio){
    await firebase.setDoc(profile, {
        Name: name,
        Categories: categories,
        Bio: bio,
    });
}

function Main() {
    const [mode, setMode] = useState('read');

    const ToggleMode = () => {
        setMode(prevMode => (prevMode === 'read' ? 'edit' : 'read'));
    }

    return(
        <div>
            <ModeButton mode={mode} onToggle={ToggleMode} />
            <Editable id='Name' type='h1' mode={mode}>American Red Cross</Editable>
            <Editable id='Categories' type='p' mode={mode}>Category: Disaster Relief, Size: Large</Editable>
            <Editable id='Bio' type='p' mode={mode}>The American Red Cross helps disaster victims, supports military families, and provides blood donations and emergency services.</Editable>
            <LoginButton text={'Login'}/>
        </div>
    );
}

function ModeButton({mode, onToggle}) {
    if (mode === 'read')
        return(
            <button onClick={onToggle}>{mode}</button>
        );
    else if (mode === 'edit')
        return(
            <>
                <button onClick={onToggle}>{mode}</button>
                <br />
            </>
        );
}

// Set id to the name we want in the database
function Editable({ type, children, mode, id}) {
    const Type = type;
    const [text, setText] = useState(children);

    useEffect(() => {
        setText(children);
    }, [children]);

    useEffect(() => {
        const fetchData = async () => {return await loadProfile(profile)};
        fetchData().then((data) => {setText(data[id])});
    }, []);

    if (mode === 'read') {
        return(
            <Type id={id}>{text}</Type>
        );
    }
    else if (mode === 'edit') {
        return(
            <>
                <input value={text} onChange={(event) => {
                    setText(event.target.value);
                    firebase.setDoc(profile, {[id] : event.target.value}, {merge:true});
                }}></input>
                <br/>
            </>
        );
    }
}

function LoginButton({text}) {
    return(
        <button id='login'>{text}</button>
    );
}


const root = ReactDOM.createRoot(document.getElementById('main'));
root.render(<Main mode='edit'/>);
