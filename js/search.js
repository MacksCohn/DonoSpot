const { useState, useEffect } = React;

// Charity data with their Firebase IDs
const initialCharitiesData = [
    { id: "3ItNyesqTpHx1XbHNkSl", name: "American Red Cross", tags: "Large Disaster", description: "Provides emergency assistance, disaster relief, and education in the United States." },
    { id: "QWoT14rIl6RPePWoKMSo", name: "Feeding America", tags: "Large Disaster", description: "Feeding America is a nationwide network of food banks committed to fighting hunger." },
    { id: "S0fRydl6SutwHSg7Qqd6", name: "American Heart Association", tags: "Large", description: "Dedicated to fighting heart disease and stroke." },
    { id: "vkRTzeDqkZcxu6qcAoHM", name: "Challenge Americas", tags: "", description: "Supports wounded veterans through music therapy and arts." },
    { id: "wxxxmoIeAPQwFSEuhFpj", name: "Americare", tags: "Large Disaster", description: "Provides health and disaster relief globally." }
];

function CharityList({ charities }) {
    return(
        <ul className="charity-list">
        {charities.map(charity => (
            <li key={charity.id} data-tags={charity.tags}>
            <a href={`charity.html?cid=${charity.id}`} className="charity-name">{charity.name}</a>
            <div className="charity-description">{charity.description}</div>
            </li>
        ))}
        </ul>
    );
}

function SearchBar({ children }) {
    const [text, setText] = useState(children);

    useEffect(() => {
        setText(children);
    }, [children]);

    return(
        <div className="search-bar">
        <input type="text" value={text} onChange={(e) => setText(e.target.value)}></input>
        <button>🔍</button>
        </div>
    );
}

function Filters({ activeFilters, setActiveFilters }) {
    const toggleFilter = (filter) => {
        setActiveFilters(prev => {
            const newFilters = new Set(prev);
            if (newFilters.has(filter)) {
                newFilters.delete(filter);
            } else {
                newFilters.add(filter);
            }
            return newFilters;
        });
    };

    return(
        <div className="filters">
            <button 
                className={`filter-btn ${activeFilters.has('Large') ? 'active' : ''}`} 
                onClick={() => toggleFilter('Large')}
            >
                Large
            </button>
            <button 
                className={`filter-btn ${activeFilters.has('Disaster') ? 'active' : ''}`} 
                onClick={() => toggleFilter('Disaster')}
            >
                Disaster Relief
            </button>
        </div>
    );
}

function Header() {
    return(
        <>
        <div className="logo">DONO<span className="heart">❤</span>SPOT</div>
        <nav><a href="index.html">Home</a></nav>
        </>
    );
}

function Main() {
    const [charities, setCharities] = useState(initialCharitiesData);
    const [activeFilters, setActiveFilters] = useState(new Set());
    const [searchText, setSearchText] = useState('');

    // Filter charities based on active filters and search text
    const filteredCharities = charities.filter(charity => {
        // Split tags into array (handle empty tags)
        const tags = charity.tags ? charity.tags.split(' ') : [];
        
        // Filter by active tags
        const matchesFilters = activeFilters.size === 0 || 
            [...activeFilters].every(filter => tags.includes(filter));
        
        // Filter by search text
        const matchesSearch = charity.name.toLowerCase().includes(searchText.toLowerCase()) || 
                             charity.description.toLowerCase().includes(searchText.toLowerCase());
        
        return matchesFilters && matchesSearch;
    });

    return(
        <>
        <SearchBar>{searchText}</SearchBar>
        <Filters activeFilters={activeFilters} setActiveFilters={setActiveFilters} />
        <CharityList charities={filteredCharities} />
        </>
    );
}

// Render the app
const headerRoot = ReactDOM.createRoot(document.querySelector('header'));
headerRoot.render(<Header />);

const mainRoot = ReactDOM.createRoot(document.querySelector('main'));
mainRoot.render(<Main />);