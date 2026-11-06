const sections = document.querySelectorAll(".home-section[data-section]");
sections.forEach((section, index) => {
    const button = section.querySelector(".home-section-header");
    const content = section.querySelector(".home-section-content");
    const id = `home-section-content-${index}`;
    content.id = id;
    button.setAttribute("aria-controls", id);
    const setOpen = open => {
        section.classList.toggle("open", open);
        button.setAttribute("aria-expanded", String(open));
        content.inert = !open;
    };
    setOpen(section.classList.contains("open"));
    button.addEventListener("click", () => {
        const shouldOpen = !section.classList.contains("open");
        sections.forEach(other => {
            const otherButton = other.querySelector(".home-section-header");
            const otherContent = other.querySelector(".home-section-content");
            other.classList.remove("open");
            otherButton.setAttribute("aria-expanded", "false");
            otherContent.inert = true;
        });
        setOpen(shouldOpen);
    });
});
