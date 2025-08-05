// Max Cohn
// editing.js
const { useState, useEffect } = React;

// Get charity ID from URL
const urlParams = new URLSearchParams(window.location.search);
const cid = urlParams.get('cid') || "3ItNyesqTpHx1XbHNkSl"; // Default to American Red Cross if no ID
const profile = firebase.doc(db, "charities", cid);

let editableIds = []

//returns key value pairs - data.Name and data.Bio for now
async function loadProfile() {
    const snap = await firebase.getDoc(profile);
    if (snap.exists()) {
        const data = snap.data();
        return data;
    }
    return {}; // Return empty object if no data
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
        <div className="logo">DONO<span className="heart">❤</span>SPOT</div>
        <LoginButton text={'Login'}/>
        <nav><a href="search.html">Home</a></nav>
        <br />
        </>
    );
}

function Main() {
    const [mode, setMode] = useState('read');
    const [donateLink, setDonateLink] = useState('');

    useEffect(() => {
        loadProfile().then((data) => {
            if (data.donate) {
                setDonateLink(data.donate);
            }
        });
    }, []);

    const ToggleMode = () => {
        setMode(prevMode => (prevMode === 'read' ? 'edit' : 'read'));
    }

    return(
        <div>
        <ModeButton mode={mode} onToggle={ToggleMode} /> 
        <Editable id='Name' type='h1' mode={mode}>Loading...</Editable>
        <Editable id='Categories' type='p' mode={mode}>Loading...</Editable>
        <Editable id='Bio' type='p' mode={mode}>Loading...</Editable>
        <DonateButton mode={mode}>{donateLink}</DonateButton>
        <br /> 
        <br/ >
        <PublishButton />
        </div>
    );
}


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
    const Type = type;
    const [text, setText] = useState(children);

    useEffect(() => {
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
        );
    }
    else if (mode === 'edit') {
        return(
            <>
                <input id={id} value={text} onChange={(event) => {
                    setText(event.target.value);
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

const headerRoot = ReactDOM.createRoot(document.getElementById('header'));
headerRoot.render(<Header />);

const mainRoot = ReactDOM.createRoot(document.getElementById('main'));
mainRoot.render(<Main mode='edit'/>);
