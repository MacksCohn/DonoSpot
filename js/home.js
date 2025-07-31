function Header() {
    return(
        <>
            <div className="logo">DONO<span className="heart">❤</span>SPOT</div>
            <nav><a href="index.html">Home</a></nav>
            <div className="profile-icon">👤</div>
        </>
    );
}

function Main() {
    return(
        <>
            <h1>Dono❤Spot</h1>

            <a href="login.html">Logout</a>

            <div className="search-bar">
                <input type="text" placeholder="Search for a charity..."></input>
                <button href='search.html'>🔍</button>
            </div>

            <h2>Supporting charities made easy</h2>
            <p>Discover and connect with charities that matter to you through our platform.</p>

            <a href="search.html">Get Started</a>

            <h3>Features</h3>
            <ul>
                <li>Browse Charities</li>
                <li>Explore Categories</li>
                <li>Join Communities</li>
            </ul>
        </>
    );
}

const headerRoot = ReactDOM.createRoot($('header')[0]);
headerRoot.render(<Header />);

const mainRoot = ReactDOM.createRoot($('main')[0]);
mainRoot.render(<Main />);
