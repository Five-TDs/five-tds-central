const sections = document.querySelectorAll(".home-section[data-section]");
sections.forEach(section => {
    const button = section.querySelector(".home-section-header");
    button.addEventListener("click", () => {
        const wasOpen = section.classList.contains("open");
        sections.forEach(currentSection => {
            currentSection.classList.remove("open");
        });
        if (!wasOpen) {
            section.classList.add("open");
        }
    });
});
