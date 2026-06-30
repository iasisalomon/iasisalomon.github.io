document.addEventListener("DOMContentLoaded", function () {
    const facetButtons = document.querySelectorAll('[data-facet="area"]');
    const sortButton = document.getElementById("sortByDate");
    const projectCards = Array.from(document.querySelectorAll(".project-card"));
    const container = document.querySelector("#projects .row.g-4");
    let sortAscending = false;
    let activeArea = "all";

    function render() {
        projectCards.forEach((card) => {
            const show = activeArea === "all" || card.dataset.category === activeArea;
            card.style.display = show ? "" : "none";
            if (show) card.style.animation = "fadeIn 0.3s ease-in";
        });
    }

    function setArea(value) {
        activeArea = value;
        facetButtons.forEach((btn) => {
            btn.classList.toggle("active", btn.dataset.value === value);
        });
        render();
    }

    facetButtons.forEach((button) => {
        button.addEventListener("click", () => setArea(button.dataset.value));
    });

    // Deep links from the Expertise section: jump to projects + filter by area.
    document.querySelectorAll("[data-jump-category]").forEach((el) => {
        el.addEventListener("click", () => {
            setArea(el.dataset.jumpCategory);
            const section = document.getElementById("projects");
            if (section) {
                const navbar = document.getElementById("mainNav");
                const offset = (navbar ? navbar.offsetHeight : 0) + 10;
                window.scrollTo({ top: section.offsetTop - offset, behavior: "smooth" });
            }
        });
    });

    function sortProjects() {
        sortAscending = !sortAscending;
        projectCards.sort((a, b) => {
            const dateA = new Date(a.dataset.date || 0);
            const dateB = new Date(b.dataset.date || 0);
            return sortAscending ? dateA - dateB : dateB - dateA;
        });
        if (container) projectCards.forEach((card) => container.appendChild(card));
        sortButton.textContent = sortAscending ? "Oldest First" : "Newest First";
    }

    sortButton?.addEventListener("click", sortProjects);
});
