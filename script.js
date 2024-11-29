document.addEventListener("DOMContentLoaded", () => {
    // Show the welcome section by default
    showSection('welcome');

    // Add event listeners for section buttons
    const buttons = document.querySelectorAll("main a.button");
    buttons.forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            const sectionId = button.closest("section").id;
            navigateToSection(sectionId);
        });
    });

    // Add event listeners for navigation links
    const navLinks = document.querySelectorAll("nav ul li a");
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            const targetHref = e.target.getAttribute("href");
            if (!targetHref.startsWith("http") && !targetHref.startsWith("#")) {
                // Allow navigation to external links
                return; 
            }
            e.preventDefault();
            handleNavigation(targetHref);
        });
    });
});

// Show a specific section by hiding others
function showSection(sectionId) {
    const sections = document.querySelectorAll("main section");
    sections.forEach(section => {
        section.style.display = section.id === sectionId ? "block" : "none";
    });
}

// Navigation between sections using buttons
function navigateToSection(sectionId) {
    if (sectionId) {
        alert(`Navigating to: ${sectionId}`);
    } else {
        console.error("Section not found!");
    }
}

// Handle navigation for internal/external sections properly
function handleNavigation(href) {
    if (href.startsWith("/")) {
        window.location.href = href; // Will redirect 
    } else {
        alert("Navigating externally to: " + href);
    }
}
