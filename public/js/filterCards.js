// You can delete this file if you're not planning to add any other JavaScript functionality

document.addEventListener("DOMContentLoaded", function () {
    const filterButtons = document.querySelectorAll("[data-filter]");
    const projectCards = document.querySelectorAll(".project-card");

    filterButtons.forEach((button) => {
        button.addEventListener("click", function () {
            // Remove active class from siblings
            const group = this.parentElement;
            group
                .querySelectorAll(".btn")
                .forEach((btn) => btn.classList.remove("active"));
            this.classList.add("active");

            const selectedBrand = this.dataset.filter;

            // Filter cards
            projectCards.forEach((card) => {
                const matchesBrand =
                    selectedBrand === "all" ||
                    card.dataset.brand === selectedBrand;

                if (matchesBrand) {
                    card.style.display = "";
                    card.style.opacity = "1";
                } else {
                    card.style.display = "none";
                    card.style.opacity = "0";
                }
            });
        });
    });
});
