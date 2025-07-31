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
