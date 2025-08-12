const { useState, useEffect } = React;
const { collection, getDocs } = window.firebase;
const UID = localStorage.getItem('UID');
const { Header } = window.headerFile;

// Charity data with their Firebase IDs
let charitiesData = [
    /*{ id: "3ItNyesqTpHx1XbHNkSl", name: "American Red Cross", tags: "Large Disaster", description: "Provides emergency assistance, disaster relief, and education in the United States." },
    { id: "QWoT14rIl6RPePWoKMSo", name: "Feeding America", tags: "Large Disaster", description: "Feeding America is a nationwide network of food banks committed to fighting hunger." },
    { id: "S0fRydl6SutwHSg7Qqd6", name: "American Heart Association", tags: "Large", description: "Dedicated to fighting heart disease and stroke." },
    { id: "vkRTzeDqkZcxu6qcAoHM", name: "Challenge Americas", tags: "", description: "Supports wounded veterans through music therapy and arts." },
    { id: "wxxxmoIeAPQwFSEuhFpj", name: "Americare", tags: "Large Disaster", description: "Provides health and disaster relief globally." }*/
];
let fullList = [];

const db = window.db;
async function fetchCharityList() {
    const charityCollection = collection(db, "charities");
    const charitySnapshot = await getDocs(charityCollection);
    const charities = [];

    charitySnapshot.forEach((doc) => {
        const data = doc.data();
        charities.push({id: doc.id, name: data.Name, tags: data.Categories, description: data.Bio});
    });

    return charities;
}



function CharityList({charities}) {
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

function filterCharities() {
    charities.forEach(charity => {
        const tags = charity.dataset.tags.split(" ");
        const matches = [...activeFilters].every(f => tags.includes(f));
        const shouldShow = activeFilters.size === 0 || matches;
        charity.style.display = shouldShow ? "list-item" : "none";
    });
}

function SearchBar({children = "", fullList, setFilteredList, activeFilters}) {
    const [text, setText] = useState(children);
    const [count, setCount] = useState(0)
    useEffect(() => {
        setText(children);
    }, [children]);

    useEffect(() => {
        /*const query = text.toLowerCase();
        const filtered = fullList.filter(charity => 
            charity.name.toLowerCase().includes(query)
        );*/
        const filtered = [];
        const query = text.toLowerCase();
        fullList.forEach((charity) => {
            const nameMatch = charity.name.toLowerCase().includes(query);

            const tags = (charity.tags || "")
                .split(",")
                .map((section) => section.split(":")[1])
                .filter(Boolean)
                .map((tag) => tag.trim().toLowerCase());

            const matchesAllFilters =
                activeFilters.size === 0 ||
                [...activeFilters].every((filter) =>
                    tags.includes(filter.toLowerCase())
                );

            if (nameMatch && matchesAllFilters) {
                filtered.push(charity);
            }
        });
        
        setCount(filtered.length);
        setFilteredList(filtered);
    }, [text, fullList, activeFilters]);

    return (
        <div className="search-bar">
            <input value={text} onChange={(event) => {
                    setText(event.target.value);
                }}></input>
            <button>🔍</button>
            <p className="charity-count">{count} result{count !== 1 && 's'} found</p>
        </div>
    );
}

function Filters({activeFilters, setActiveFilters}) {
    const filters = ["Large", "Disaster Relief"]; // Add more tags here if needed

    const toggleFilter = (filter) => {
        const updated = new Set(activeFilters);
        if (updated.has(filter)) {
            updated.delete(filter);
        } else {
            updated.add(filter);
        }
        setActiveFilters(new Set(updated)); // New Set to trigger React re-render
    };

    return (
        <div className="filters">
            <p className="filter-title">Filter by Category</p>
            {filters.map((filter) => (
                <button
                    key={filter}
                    className={`filter-btn ${activeFilters.has(filter) ? "active" : ""}`}
                    onClick={() => toggleFilter(filter)}
                >
                    {filter}
                </button>
            ))}
        </div>
    );
}

// function CharityList() {
//  return(
//      <ul className="charity-list">
//          <li data-tags="Large Disaster">
//          <a href="charity.html" className="charity-name">American Red Cross</a>
//          </li>
//          <li data-tags="Large Disaster">
//          <span className="charity-name">Feeding America</span>
//          <div className="charity-description">Feeding America is a nationwide network of food banks committed to fighting hunger.</div>
//          </li>
//          <li data-tags="Large">
//          <span className="charity-name">American Heart Association</span>
//          <div className="charity-description">Dedicated to fighting heart disease and stroke.</div>
//          </li>
//          <li data-tags="">
//          <span className="charity-name">Challenge Americas</span>
//          <div className="charity-description">Supports wounded veterans through music therapy and arts.</div>
//          </li>
//          <li data-tags="Large Disaster">
//          <span className="charity-name">Americare</span>
//          <div className="charity-description">Provides health and disaster relief globally.</div>
//          </li>
//      </ul>
//  );
//}

function Main() {
    const [fullList, setFullList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [activeFilters, setActiveFilters] = useState(new Set());
    const urlParams = new URLSearchParams(window.location.search);
    const defaultSearch = urlParams.get('query');
    useEffect(() => {
        fetchCharityList().then(charities => {
            setFullList(charities);
            setFilteredList(charities);
        });
    }, [])
    return(
        <>
        <SearchBar children={defaultSearch} fullList={fullList} setFilteredList={setFilteredList} activeFilters={activeFilters}></SearchBar>
        <Filters activeFilters={activeFilters} setActiveFilters={setActiveFilters}/>
        <CharityList charities={filteredList} />
        </>
    );
}

fetchCharityList().then((charities) => {
    charities.forEach((charity) => {
        charitiesData.push(charity);
        fullList.push(charity);
    });
    const headerRoot = ReactDOM.createRoot($("header")[0]);
    headerRoot.render(<Header />);

    const mainRoot = ReactDOM.createRoot($("main")[0]);
    mainRoot.render(<Main />);


});
