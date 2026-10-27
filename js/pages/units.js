

const rarities = [
    "Legendary",
    "Exclusive",
    "Epic",
    "Rare",
    "Uncommon",
    "Common"
];





const grid =
    document.getElementById("unit-grid");


const resultsCount =
    document.getElementById("unit-results-count");


const clearFiltersButton =
    document.getElementById("clear-unit-filters");


const searchInput =
    document.getElementById("search-input");


const filterButton =
    document.getElementById("filter-button");


const filters =
    document.getElementById("filters");





let activeRarities = [];

let activeTypes = [];





filterButton.addEventListener("click", () => {
    filters.classList.toggle("open");
    filterButton.classList.toggle("open");
});





document
    .querySelectorAll(".rarity-option")
    .forEach(button => {

        button.addEventListener("click", () => {

            const value =
                button.dataset.value;


            

            if (activeRarities.includes(value)) {

                activeRarities =
                    activeRarities.filter(
                        rarity => rarity !== value
                    );

                button.classList.remove("active");

            }


            

            else {

                activeRarities.push(value);

                button.classList.add("active");

            }


            displayUnits();

        });

    });





document
    .querySelectorAll(".type-option")
    .forEach(button => {

        button.addEventListener("click", () => {

            const value =
                button.dataset.value;


            

            if (activeTypes.includes(value)) {

                activeTypes =
                    activeTypes.filter(
                        type => type !== value
                    );

                button.classList.remove("active");

            }


            

            else {

                activeTypes.push(value);

                button.classList.add("active");

            }


            displayUnits();

        });

    });





searchInput.addEventListener(
    "input",
    () => {

        displayUnits();

    }
);




clearFiltersButton.addEventListener("click", () => {

    
    searchInput.value = "";

    
    activeRarities = [];
    activeTypes = [];

    
    document
        .querySelectorAll(".rarity-option.active, .type-option.active")
        .forEach(button => {
            button.classList.remove("active");
        });

    
    displayUnits();

});




function displayUnits() {


    

    grid.innerHTML = "";



    

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();



    

    const filteredUnits =
        units.filter(unit => {


            

            const matchesSearch =
                unit.name
                    .toLowerCase()
                    .includes(searchText);



            

            const matchesRarity =
                activeRarities.length === 0 ||

                activeRarities.includes(
                    unit.rarity
                );



            

            const matchesType =
                activeTypes.length === 0 ||

                activeTypes.includes(
                    unit.type
                );



            return (
                matchesSearch &&
                matchesRarity &&
                matchesType
            );

        });


        

        if (resultsCount) {

            const visibleCount =
                filteredUnits.length;

            const totalCount =
                units.length;

            resultsCount.textContent =
                `Showing ${visibleCount} of ${totalCount} units`;

        }

        /* =========================
        CLEAR BUTTON VISIBILITY
        ========================= */

        const hasActiveFilters =
            searchText.length > 0 ||
            activeRarities.length > 0 ||
            activeTypes.length > 0;

        clearFiltersButton.hidden = !hasActiveFilters;


    /*
        Create rarity sections.
    */

    rarities.forEach(rarity => {


        /*
            Find units belonging
            to this rarity.
        */

        const rarityUnits =
            filteredUnits.filter(
                unit =>
                    unit.rarity === rarity
            );


        /*
            Don't show empty sections.
        */

        if (rarityUnits.length === 0) {

            return;

        }



        /* =========================
           RARITY SECTION
        ========================== */

        const section =
            document.createElement("section");


        section.className =
            "rarity-section";



        /* =========================
           RARITY TITLE
        ========================== */

        const titleContainer =
            document.createElement("div");


        titleContainer.className =
            "rarity-title";


        const title =
            document.createElement("h2");


        
        title.textContent =
            rarity;


        /* =========================
        RARITY UNIT COUNT
        ========================= */

        const rarityCount =
            document.createElement("span");

        rarityCount.className =
            "rarity-count";

        rarityCount.textContent =
            rarityUnits.length;


        const line =
            document.createElement("div");



        line.className =
            "rarity-line";


        titleContainer.appendChild(title);

        titleContainer.appendChild(rarityCount);

        titleContainer.appendChild(line);

        section.appendChild(titleContainer);



        /* =========================
           UNIT GRID
        ========================== */

        const unitGrid =
            document.createElement("div");


        unitGrid.className =
            "unit-grid";



        /* =========================
           CREATE CARDS
        ========================== */

        rarityUnits.forEach(unit => {


            const card =
                document.createElement("div");


            /*
                Give the card its rarity class.

                Example:

                Common -> common

                Legendary -> legendary
            */

            card.className =
                `unit-card ${rarity.toLowerCase()}`;



            /*
                Create card contents.
            */

            card.innerHTML = `

                <div class="unit-image">

                    ${
                        unit.image

                        ?

                        `<img
                            src="${unit.image}"
                            alt="${unit.name}"
                        >`

                        :

                        `<span>
                            IMAGE
                        </span>`
                    }

                </div>


                <div class="unit-name">

                    ${unit.name}

                </div>

                <button
                    class="unit-card-copy-link"
                    type="button"
                    aria-label="Copy link to ${unit.name}"
                    title="Copy a direct link to ${unit.name}"
                >
                    🔗 COPY LINK
                </button>

            `;

            /*
            Make the card open the unit page.
            */

            card.addEventListener("click", () => {

                window.location.href =
                    `unit.html?unit=${encodeURIComponent(unit.name)}`;

            });

            // =========================
            // COPY UNIT LINK
            // =========================

            const copyLinkButton =
                card.querySelector(".unit-card-copy-link");

            copyLinkButton.addEventListener("click", async (event) => {

                // Prevent opening the unit page.
                event.stopPropagation();

                const unitURL = new URL(
                    `unit.html?unit=${encodeURIComponent(unit.name)}`,
                    window.location.href
                );

                try {

                    await navigator.clipboard.writeText(
                        unitURL.toString()
                    );

                    copyLinkButton.textContent = "✓ LINK COPIED!";

                } catch (error) {

                    copyLinkButton.textContent = "COPY FAILED";

                }

                clearTimeout(copyLinkButton.resetTimeout);

                copyLinkButton.resetTimeout = setTimeout(() => {

                    if (copyLinkButton.isConnected) {
                        copyLinkButton.textContent = "🔗 COPY LINK";
                    }

                }, 2000);

            });

            /*
                Add card to grid.
            */

            unitGrid.appendChild(card);

        });



        /*
            Add grid to section.
        */

        section.appendChild(unitGrid);


        /*
            Add section to database.
        */

        grid.appendChild(section);

    });



    /*
        If nothing matched,
        show a message.
    */

    if (filteredUnits.length === 0) {

        grid.innerHTML = `

            <div class="no-results">

                No units found.

            </div>

        `;

    }

}



/* =========================================================
   INITIAL DISPLAY
========================================================= */

displayUnits();