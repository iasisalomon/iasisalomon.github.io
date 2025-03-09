document.addEventListener("DOMContentLoaded", function () {
    try {
        const projectsContainer = document.querySelector(".row.g-4.py-5");
        const projectCards = Array.from(document.querySelectorAll(".project-card"));

        // Parse dates from cards and sort them
        projectCards.sort((a, b) => {
            const dateA = new Date(a.querySelector(".text-muted.small").textContent);
            const dateB = new Date(b.querySelector(".text-muted.small").textContent);
            return dateB - dateA; // Sort in descending order (newest first)
        });

        // Reorder the cards in the DOM
        projectCards.forEach(card => {
            projectsContainer.appendChild(card);
        });
    } catch (error) {
        console.log("Error sorting projects:", error);
    }
});
