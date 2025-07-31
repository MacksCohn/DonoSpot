const { useState, useEffect } = React;

document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const charities = document.querySelectorAll(".charity-list li");
  const activeFilters = new Set();
  charities.forEach(charity => {
    charity.querySelector(".charity-name").addEventListener("click", () => {
      const desc = charity.querySelector(".charity-description");
      desc.style.display = desc.style.display === "block" ? "none" : "block";
    });
  });


  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const tag = button.dataset.filter;
      if (activeFilters.has(tag)) {
        activeFilters.delete(tag);
        button.classList.remove("active");
      } else {
        activeFilters.add(tag);
        button.classList.add("active");
      }
      filterCharities();
    });
  });

  function filterCharities() {
    charities.forEach(charity => {
      const tags = charity.dataset.tags.split(" ");
      const matches = [...activeFilters].every(f => tags.includes(f));
      const shouldShow = activeFilters.size === 0 || matches;
      charity.style.display = shouldShow ? "list-item" : "none";
    });
  }
});


function SearchBar({children}) {
    const [text, setText] = useState(children);

    useEffect(() => {
        setText(children);
    }, [children]);
        
    return(
        <div className="search-bar">
            <input type="text" value={text}></input>
            <button>🔍</button>
        </div>
    );
}

function Filters() {
    return(
        <div className="filters">
            <button className="filter-btn" data-filter="Large">Large</button>
            <button className="filter-btn" data-filter="Disaster">Disaster Relief</button>
        </div>
    );
}

function CharityList() {
    return(
        <ul className="charity-list">
            <li data-tags="Large Disaster">
            <a href="charity.html" className="charity-name">American Red Cross</a>
            </li>
            <li data-tags="Large Disaster">
            <span className="charity-name">Feeding America</span>
            <div className="charity-description">Feeding America is a nationwide network of food banks committed to fighting hunger.</div>
            </li>
            <li data-tags="Large">
            <span className="charity-name">American Heart Association</span>
            <div className="charity-description">Dedicated to fighting heart disease and stroke.</div>
            </li>
            <li data-tags="">
            <span className="charity-name">Challenge Americas</span>
            <div className="charity-description">Supports wounded veterans through music therapy and arts.</div>
            </li>
            <li data-tags="Large Disaster">
            <span className="charity-name">Americare</span>
            <div className="charity-description">Provides health and disaster relief globally.</div>
            </li>
        </ul>
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
    return(
        <>
        <SearchBar />
        <Filters />
        <CharityList />
        </>
    );
}


const headerRoot = ReactDOM.createRoot($('header')[0]);
headerRoot.render(<Header />);

const mainRoot = ReactDOM.createRoot($('main')[0]);
mainRoot.render(<Main />);
