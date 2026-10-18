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



// =========================================================
// MOBILE NAVIGATION
// =========================================================

const mobileMenuButton =
    document.getElementById(
        "mobile-menu-button"
    );


const mobileCloseButton =
    document.getElementById(
        "mobile-close-button"
    );


const mobileNav =
    document.getElementById(
        "mobile-nav"
    );



// =========================================================
// OPEN MOBILE MENU
// =========================================================

mobileMenuButton.addEventListener(
    "click",
    () => {

        mobileNav.classList.add(
            "open"
        );

        document.body.style.overflow =
            "hidden";

    }
);



// =========================================================
// CLOSE MOBILE MENU
// =========================================================

mobileCloseButton.addEventListener(
    "click",
    () => {

        mobileNav.classList.remove(
            "open"
        );

        document.body.style.overflow =
            "";

    }
);



// =========================================================
// MOBILE DROPDOWNS
// =========================================================

const mobileDropdowns =
    document.querySelectorAll(
        ".mobile-nav-dropdown"
    );


mobileDropdowns.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const section =
                button.closest(
                    ".mobile-nav-section"
                );


            section.classList.toggle(
                "open"
            );

        }
    );

});