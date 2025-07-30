// Max Cohn
// editing.js
<<<<<<< HEAD

const { useState, useEffect } = React;
=======
 
const { useState, useEffect } = React;
const profile = firebase.doc(db, "charities", "3ItNyesqTpHx1XbHNkSl");

let editableIds = []

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

function Header() {
    return(
        <>
            <div class="logo">DONO<span class="heart">❤</span>SPOT</div>
            <LoginButton text={'Login'}/>
            <nav><a href="index.html">Home</a></nav>
            <br />
        </>
    );
}
>>>>>>> 9fd9cb66eec4402a6273b3a20a34176f6b00652e

function Main() {
    const [mode, setMode] = useState('read');

    const ToggleMode = () => {
        setMode(prevMode => (prevMode === 'read' ? 'edit' : 'read'));
    }

    return(
        <div>
<<<<<<< HEAD
            <ModeButton mode={mode} onToggle={ToggleMode} />
            <Editable type='h1' mode={mode}>American Red Cross</Editable>
            <Editable type='p' mode={mode}>Category: Disaster Relief, Size: Large</Editable>
            <Editable type='p' mode={mode}>The American Red Cross helps disaster victims, supports military families, and provides blood donations and emergency services.</Editable>
            <LoginButton text={'Login'}/>
=======
            <ModeButton mode={mode} onToggle={ToggleMode} /> 
            <Editable id='Name' type='h1' mode={mode}>Header Text</Editable>
            <Editable id='Categories' type='p' mode={mode}>Categories Text</Editable>
            <Editable id='Bio' type='p' mode={mode}>Description Text</Editable>
            <PublishButton />
>>>>>>> 9fd9cb66eec4402a6273b3a20a34176f6b00652e
        </div>
    );
}

<<<<<<< HEAD
function Editable({ type, children, mode}) {
=======
function ModeButton({mode, onToggle}) {
    if (mode === 'read')
        return(
            <button onClick={onToggle}>Edit</button>
        );
    else if (mode === 'edit')
        return(
            <>
                <button onClick={onToggle}>Read</button>
                <br />
            </>
        );
}

function PublishButton() {
    return(
        <button onClick={PublishChanges}>Publish Changes</button>
    );
}

function PublishChanges() {
    for (const id of editableIds) {
        const element = document.getElementById(id);
        let text;
        // This is kinda iffy we should probably change at some point
        if (element.tagName === 'INPUT')
            text = element.value;
        else
            text = element.textContent;
        firebase.setDoc(profile, {[id] : text}, {merge:true});
    }
}

// Set id to the name we want in the database
function Editable({ type, children, mode, id}) {
>>>>>>> 9fd9cb66eec4402a6273b3a20a34176f6b00652e
    const Type = type;
    const [text, setText] = useState(children);

    useEffect(() => {
<<<<<<< HEAD
        setText(children)
    }, [children]);

    if (mode === 'read') {
        return(
            <Type>{text}</Type>
=======
        setText(children);
    }, [children]);

    useEffect(() => {
        loadProfile(profile).then((data) => {setText(data[id])});
    }, []);

    if (!editableIds.includes(id))
        editableIds.push(id);

    if (mode === 'read') {
        return(
            <Type id={id}>{text}</Type>
>>>>>>> 9fd9cb66eec4402a6273b3a20a34176f6b00652e
        );
    }
    else if (mode === 'edit') {
        return(
            <>
<<<<<<< HEAD
                <input value={text} onChange={(event) => setText(event.target.value)}></input>
=======
                <input id={id} value={text} onChange={(event) => {
                    setText(event.target.value);
                }}></input>
>>>>>>> 9fd9cb66eec4402a6273b3a20a34176f6b00652e
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

<<<<<<< HEAD
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
=======
const headerRoot = ReactDOM.createRoot(document.getElementById('header'));
headerRoot.render(<Header />);

const mainRoot = ReactDOM.createRoot(document.getElementById('main'));
mainRoot.render(<Main mode='edit'/>);
>>>>>>> 9fd9cb66eec4402a6273b3a20a34176f6b00652e
