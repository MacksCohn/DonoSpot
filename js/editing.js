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
async function saveProfile(name, bio){
    await firebase.setDoc(profile, {
        Name: name,
        Bio: bio
    });
}

saveProfile("American Red", "nah");
function Main() {
    const [mode, setMode] = useState('read');

    const ToggleMode = () => {
        setMode(prevMode => (prevMode === 'read' ? 'edit' : 'read'));
    }

    return(
        <div>
            <ModeButton mode={mode} onToggle={ToggleMode} />
            <Editable type='h1' mode={mode}>American Red Cross</Editable>
            <Editable type='p' mode={mode}>Category: Disaster Relief, Size: Large</Editable>
            <Editable type='p' mode={mode}>The American Red Cross helps disaster victims, supports military families, and provides blood donations and emergency services.</Editable>
            <LoginButton text={'Login'}/>
        </div>
    );
}

function Editable({ type, children, mode}) {
    const Type = type;
    const [text, setText] = useState(children);

    useEffect(() => {
        setText(children)
    }, [children]);

    if (mode === 'read') {
        return(
            <Type>{text}</Type>
        );
    }
    else if (mode === 'edit') {
        return(
            <>
                <input value={text} onChange={(event) => setText(event.target.value)}></input>
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

const root = ReactDOM.createRoot(document.getElementById('main'));
root.render(<Main mode='edit'/>);
