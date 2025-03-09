// Add this to a new file: js/emailProtection.js
document.addEventListener("DOMContentLoaded", function () {
    console.log("Script loaded");
    
    const emailDisplay = document.getElementById("email-display");
    if (!emailDisplay) {
        console.error("Email display element not found");
        return;
    }
    console.log("Email display element found");

    // Email parts encoded
    const emailParts = [
        String.fromCharCode(105, 97, 115, 105), // iasi
        String.fromCharCode(115, 97, 108, 111, 109, 111, 110), // salomon
        String.fromCharCode(103, 109, 97, 105, 108, 46, 99, 111, 109) // gmail.com
    ];
    
    console.log("Email parts:", emailParts);

    let revealed = false;
    const container = emailDisplay.closest(".email-container");
    
    if (!container) {
        console.error("Container not found");
        return;
    }
    console.log("Container found");
    
    emailDisplay.textContent = "• • • • • • • • • • • •";
    
    container.addEventListener("click", function () {
        console.log("Container clicked, revealed:", revealed);
        if (!revealed) {
            // Reveal email
            const email = `${emailParts[0]}${emailParts[1]}@${emailParts[2]}`;
            console.log("Revealing email:", email);
            emailDisplay.textContent = email;
            container.classList.add("revealed");
            revealed = true;
        } else {
            // Copy to clipboard
            const email = `${emailParts[0]}${emailParts[1]}@${emailParts[2]}`;
            navigator.clipboard.writeText(email)
                .then(() => {
                    emailDisplay.textContent = "Copied!";
                    setTimeout(() => {
                        emailDisplay.textContent = email;
                    }, 1000);
                })
                .catch(err => {
                    console.error('Failed to copy:', err);
                });
        }
    });
});
