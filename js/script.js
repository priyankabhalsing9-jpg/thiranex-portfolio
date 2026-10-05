// ================================
// DARK MODE TOGGLE
// ================================

const themeToggle = document.getElementById("theme-toggle");

// Check saved theme when page loads
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");

    if (themeToggle) {
        themeToggle.textContent = "☀️ Light Mode";
        themeToggle.setAttribute("aria-pressed", "true");
    }
}

// Toggle theme
if (themeToggle) {

    themeToggle.addEventListener("click", function () {

        const isDarkMode =
            document.documentElement.getAttribute("data-theme") === "dark";

        if (isDarkMode) {

            document.documentElement.removeAttribute("data-theme");

            localStorage.setItem("theme", "light");

            themeToggle.textContent = "🌙 Dark Mode";
            themeToggle.setAttribute("aria-pressed", "false");

        } else {

            document.documentElement.setAttribute("data-theme", "dark");

            localStorage.setItem("theme", "dark");

            themeToggle.textContent = "☀️ Light Mode";
            themeToggle.setAttribute("aria-pressed", "true");

        }

    });

}
// ================================
// CONTACT FORM
// ================================

const contactForm = document.getElementById("contact-form");

if (contactForm) {

    contactForm.addEventListener("submit", function (event) {

        event.preventDefault();

        alert("Message sent successfully!");

        contactForm.reset();

    });

}
