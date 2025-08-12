const UID = localStorage.getItem('UID');
const { Header } = window.headerFile;
const { collection, getDocs } = window.firebase;
const { GetPageIdFromUser } = window.loginForm;
if (UID != 'null' && UID != null) {
    let associatedCharity = GetPageIdFromUser(UID);
    if (associatedCharity != null)
        localStorage.setItem('hasPage', 'true');
}

function Main() {
    const handleSubmit = (event) => {
        event.preventDefault();
        const searchValue = event.target.elements.searchInput.value;
        window.location.href = `./search.html?query=${encodeURIComponent(searchValue)}`;
    }
    return (
        <>
            <h1>
                Dono<span className="heart">❤</span>Spot
            </h1>

            <div className="search-bar">
                <form onSubmit={handleSubmit}>
                    <input
                        name="searchInput"
                        type="text"
                        placeholder="Search for a charity..."
                    ></input>
                    <button type="submit">🔍</button>
                </form>
            </div>

            <h2>Supporting charities made easy</h2>
            <p>
                Discover and connect with charities that matter to you through
                our platform.
            </p>

            <a href="search.html?query=">Get Started</a>

            <h3>Features</h3>
            <ul>
                <li>Browse Charities</li>
                <li>Explore Categories</li>
                <li>Join Communities</li>
            </ul>
        </>
    );
}

if (localStorage.getItem('firstVisit') === null) {
    localStorage.setItem('UID', null);
    localStorage.setItem('firstVisit', false);
}

const headerRoot = ReactDOM.createRoot($('header')[0]);
headerRoot.render(<Header />);

const mainRoot = ReactDOM.createRoot($('main')[0]);
mainRoot.render(<Main />);
