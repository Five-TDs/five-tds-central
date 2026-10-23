/* =========================================================
   RARITIES
========================================================= */

const rarities = [
    "Legendary",
    "Exclusive",
    "Epic",
    "Rare",
    "Uncommon",
    "Common"
];



/* =========================================================
   PAGE ELEMENTS
========================================================= */

const grid =
    document.getElementById("unit-grid");


const searchInput =
    document.getElementById("search-input");


const filterButton =
    document.getElementById("filter-button");


const filters =
    document.getElementById("filters");



/* =========================================================
   ACTIVE FILTERS
========================================================= */

let activeRarities = [];

let activeTypes = [];



/* =========================================================
   OPEN / CLOSE FILTER MENU
========================================================= */

filterButton.addEventListener("click", () => {
    filters.classList.toggle("open");
    filterButton.classList.toggle("open");
});



/* =========================================================
   RARITY FILTER BUTTONS
========================================================= */

document
    .querySelectorAll(".rarity-option")
    .forEach(button => {

        button.addEventListener("click", () => {

            const value =
                button.dataset.value;


            /*
                If already selected,
                remove it.
            */

            if (activeRarities.includes(value)) {

                activeRarities =
                    activeRarities.filter(
                        rarity => rarity !== value
                    );

                button.classList.remove("active");

            }


            /*
                Otherwise select it.
            */

            else {

                activeRarities.push(value);

                button.classList.add("active");

            }


            displayUnits();

        });

    });



/* =========================================================
   ATTACK TYPE FILTER BUTTONS
========================================================= */

document
    .querySelectorAll(".type-option")
    .forEach(button => {

        button.addEventListener("click", () => {

            const value =
                button.dataset.value;


            /*
                Remove if already selected.
            */

            if (activeTypes.includes(value)) {

                activeTypes =
                    activeTypes.filter(
                        type => type !== value
                    );

                button.classList.remove("active");

            }


            /*
                Otherwise select it.
            */

            else {

                activeTypes.push(value);

                button.classList.add("active");

            }


            displayUnits();

        });

    });



/* =========================================================
   SEARCH
========================================================= */

searchInput.addEventListener(
    "input",
    () => {

        displayUnits();

    }
);



/* =========================================================
   DISPLAY UNITS
========================================================= */

function displayUnits() {


    /*
        Clear the current database.
    */

    grid.innerHTML = "";



    /*
        Get search text.
    */

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();



    /*
        Filter units.
    */

    const filteredUnits =
        units.filter(unit => {


            /* =========================
               SEARCH
            ========================== */

            const matchesSearch =
                unit.name
                    .toLowerCase()
                    .includes(searchText);



            /* =========================
               RARITY
            ========================== */

            const matchesRarity =
                activeRarities.length === 0 ||

                activeRarities.includes(
                    unit.rarity
                );



            /* =========================
               ATTACK TYPE
            ========================== */

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


        const line =
            document.createElement("div");


        line.className =
            "rarity-line";


        titleContainer.appendChild(title);

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

            `;

            /*
            Make the card open the unit page.
            */

            card.addEventListener("click", () => {

                window.location.href =
                    `unit.html?unit=${encodeURIComponent(unit.name)}`;

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