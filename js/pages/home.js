// =========================================================
// HOME PAGE ACCORDIONS
// =========================================================

const sections =
    document.querySelectorAll(
        ".home-section[data-section]"
    );


sections.forEach(section => {

    const button =
        section.querySelector(
            ".home-section-header"
        );


    button.addEventListener("click", () => {

        const wasOpen =
            section.classList.contains("open");


        // Close every section

        sections.forEach(currentSection => {

            currentSection.classList.remove(
                "open"
            );

        });


        // Re-open the clicked section
        // if it wasn't already open

        if (!wasOpen) {

            section.classList.add(
                "open"
            );

        }

    });

});
