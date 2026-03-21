document.addEventListener("DOMContentLoaded", function () {
    const filterButtons = document.querySelectorAll("[data-filter]");
    const sortButton = document.getElementById("sortByDate");
    const projectCards = Array.from(document.querySelectorAll(".project-card"));
    let sortAscending = false;

    function applyFilter(selectedBrand) {
        filterButtons.forEach((button) => {
            const group = button.parentElement;
            group
                .querySelectorAll(".btn")
                .forEach((btn) => btn.classList.remove("active"));
        });
        
        document.querySelector(`[data-filter="${selectedBrand}"]`)?.classList.add("active");

        projectCards.forEach((card) => {
            const matchesBrand =
                selectedBrand === "all" ||
                card.dataset.brand === selectedBrand;

            if (matchesBrand) {
                card.style.display = "";
                card.style.animation = "fadeIn 0.3s ease-in";
            } else {
                card.style.display = "none";
            }
        });
    }

    function sortProjects() {
        sortAscending = !sortAscending;
        
        projectCards.sort((a, b) => {
            const dateA = new Date(a.querySelector(".text-muted.small").textContent);
            const dateB = new Date(b.querySelector(".text-muted.small").textContent);
            return sortAscending ? dateA - dateB : dateB - dateA;
        });

        const container = document.querySelector("#projects .row.g-4");
        if (!container) return;

        projectCards.forEach(card => {
            container.appendChild(card);
        });

        sortButton.textContent = sortAscending ? "Oldest First" : "Newest First";
    }

    filterButtons.forEach((button) => {
        button.addEventListener("click", function () {
            applyFilter(this.dataset.filter);
        });
    });

    sortButton?.addEventListener("click", sortProjects);
});
