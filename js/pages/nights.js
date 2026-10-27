



const nights = [

    {
        game: 1,

        nights: [

            {
                number: 1,

                normal: {
                    alias: "CAM 4B - East Corner",
                    coinReward: 50,
                    remnantReward: 1,
                    waveCount: 10,
                    startingCash: 50
                },

                max: {
                    alias: "CAM 4B - East Corner",
                    coinReward: 75,
                    remnantReward: "1-2",
                    waveCount: 10,
                    startingCash: 100
                }
            },

            {
                number: 2,

                normal: {
                    alias: "CAM 2B - West Corner",
                    coinReward: 50,
                    remnantReward: 1,
                    waveCount: 10,
                    startingCash: 50
                },

                max: {
                    alias: "CAM 2B - West Corner",
                    coinReward: 75,
                    remnantReward: "1-2",
                    waveCount: 10,
                    startingCash: 100
                }
            },

            {
                number: 3,

                normal: {
                    alias: "CAM 4A - East Hall",
                    coinReward: 55,
                    remnantReward: "1-2",
                    waveCount: 10,
                    startingCash: 100
                },

                max: {
                    alias: "CAM 4A - East Hall",
                    coinReward: 83,
                    remnantReward: 2,
                    waveCount: 10,
                    startingCash: 200
                }
            },

            {
                number: 4,

                normal: {
                    alias: "CAM 2A - West Hall",
                    coinReward: 55,
                    remnantReward: "1-2",
                    waveCount: 10,
                    startingCash: 100
                },

                max: {
                    alias: "CAM 2A - West Hall",
                    coinReward: 83,
                    remnantReward: 2,
                    waveCount: 10,
                    startingCash: 200
                }
            },

            {
                number: 5,

                normal: {
                    alias: "CAM 3 - Supply Closet",
                    coinReward: 55,
                    remnantReward: 2,
                    waveCount: 10,
                    startingCash: 100
                },

                max: {
                    alias: "CAM 3 - Supply Closet",
                    coinReward: 83,
                    remnantReward: "2-3",
                    waveCount: 10,
                    startingCash: 200
                }
            },

            {
                number: 6,

                normal: {
                    alias: "CAM 1B - Dining Area",
                    coinReward: 60,
                    remnantReward: 3,
                    waveCount: 15,
                    boss: "Upgraded Endo",
                    startingCash: 150
                },

                max: {
                    alias: "CAM 1B - Dining Area",
                    coinReward: 90,
                    remnantReward: "3-4",
                    waveCount: 15,
                    boss: "Upgraded Endo",
                    startingCash: 300
                }
            },

            {
                number: 7,

                normal: {
                    alias: "CAM 6 - Kitchen",
                    coinReward: 55,
                    remnantReward: 3,
                    waveCount: 15,
                    boss: "Chupcake",
                    startingCash: 150
                },

                max: {
                    alias: "CAM 6 - Kitchen",
                    coinReward: 83,
                    remnantReward: "3-4",
                    waveCount: 15,
                    boss: "Chupcake",
                    startingCash: 300
                }
            },

            {
                number: 8,

                normal: {
                    alias: "CAM 5 - Parts & Service",
                    coinReward: 65,
                    remnantReward: 4,
                    waveCount: 15,
                    Boss: "Reaper Bonnie",
                    startingCash: 200
                },

                max: {
                    alias: "CAM 5 - Parts & Service",
                    coinReward: 98,
                    remnantReward: "4-5",
                    waveCount: 15,
                    Boss: "Reaper Bonnie",
                    startingCash: 400
                }
            },

            {
                number: 9,

                normal: {
                    alias: "CAM 1C - Pirate Cove",
                    coinReward: 65,
                    remnantReward: 4,
                    waveCount: 20,
                    boss: "Swiper Foxy",
                    startingCash: 150
                },

                max: {
                    alias: "CAM 1C - Pirate Cove",
                    coinReward: 98,
                    remnantReward: "4-5",
                    waveCount: 20,
                    boss: "Swiper Foxy",
                    startingCash: 300
                }
            },

            {
                number: 10,

                normal: {
                    alias: "CAM 7 - Restrooms",
                    coinReward: 70,
                    remnantReward: "4-5",
                    waveCount: 15,
                    boss: "Fred Head",
                    startingCash: 150
                },

                max: {
                    alias: "CAM 7 - Restrooms",
                    coinReward: 105,
                    remnantReward: 5,
                    waveCount: 15,
                    boss: "Fred Head",
                    startingCash: 300
                }
            },

            {
                number: 11,

                normal: {
                    alias: "CAM 1A - Show Stage",
                    coinReward: 100,
                    remnantReward: "5-6",
                    waveCount: 20,
                    boss: "Golden Freddy",
                    startingCash: 400
                },

                max: {
                    alias: "CAM 1A - Show Stage",
                    coinReward: 150,
                    remnantReward: "6-7",
                    waveCount: 20,
                    boss: "Golden Freddy",
                    startingCash: 800
                }
            }

        ]

    }

];








const nightsContainer =
    document.getElementById("nights-container");

const gameFilters =
    document.getElementById("game-filters");

const filterButton =
    document.getElementById("filter-button");

const filterPanel =
    document.getElementById("filter-panel");

const filterArrow =
    document.getElementById("filter-arrow");






let activeGames = [];






let selectedNight = null;

let maxMode = false;






function buildGameFilters() {

    gameFilters.innerHTML = "";

    nights.forEach(game => {

        const button =
            document.createElement("button");

        button.type = "button";

        button.className =
            "filter-option";

        button.dataset.game =
            game.game;

        button.textContent =
            "CHAPTER " + game.game;

        button.addEventListener(
            "click",
            () => {

                toggleGameFilter(
                    game.game,
                    button
                );

            }
        );

        gameFilters.appendChild(button);

    });

}






function toggleGameFilter(
    gameNumber,
    button
) {

    if (activeGames.includes(gameNumber)) {

        activeGames =
            activeGames.filter(
                game =>
                    game !== gameNumber
            );

        button.classList.remove("active");

    } else {

        activeGames.push(gameNumber);

        button.classList.add("active");

    }

    displayNights();

}






filterButton.addEventListener(
    "click",
    () => {

        const isOpen =
            filterPanel.classList.toggle(
                "open"
            );

        filterButton.classList.toggle(
            "open",
            isOpen
        );

    }
);






function displayNights() {

    nightsContainer.innerHTML = "";


    nights.forEach(game => {

        
        

        if (
            activeGames.length > 0 &&
            !activeGames.includes(game.game)
        ) {
            return;
        }


        const section =
            document.createElement("section");

        section.className =
            "game-section";


        
        
        

        const header =
            document.createElement("div");

        header.className =
            "game-header";


        const title =
            document.createElement("div");

        title.className =
            "game-title";

        title.textContent =
            "CHAPTER " + game.game;


        const line =
            document.createElement("div");

        line.className =
            "game-line";


        header.appendChild(title);

        header.appendChild(line);


        
        
        

        const grid =
            document.createElement("div");

        grid.className =
            "night-grid";


        game.nights.forEach(night => {

            const card =
                document.createElement("button");

            card.type = "button";

            card.className =
                "night-card";


            const number =
                document.createElement("span");

            number.className =
                "night-card-number";

            number.innerHTML = `
    <span class="game-number">
        ${game.game}
    </span>
    <span class="night-dash">
        - 
    </span>
    <span class="night-number">
        ${night.number}
    </span>
    `;

            card.appendChild(number);


            card.addEventListener(
                "click",
                () => {

                    openNightModal(
                        game,
                        night
                    );

                }
            );


            grid.appendChild(card);

        });


        section.appendChild(header);

        section.appendChild(grid);

        nightsContainer.appendChild(section);

    });

}


// =========================================================
// OPEN NIGHT POPUP
// =========================================================

function openNightModal(
    game,
    night
) {

    selectedNight = {
        game,
        night
    };


    maxMode = false;


    document
        .getElementById("max-mode-button")
        .classList.remove("active");


    document
        .querySelector(".night-modal-content")
        .classList.remove("max-mode");


    updateNightModal();


    document
        .getElementById("night-modal")
        .classList.add("open");


    document.body.style.overflow =
        "hidden";

}


// =========================================================
// UPDATE POPUP
// =========================================================

function updateNightModal() {

    if (!selectedNight) {
        return;
    }


    const game =
        selectedNight.game;

    const night =
        selectedNight.night;


    const data =
        maxMode
            ? night.max
            : night.normal;


    document.getElementById(
        "modal-title"
    ).textContent =
        `CHAPTER ${game.game} - NIGHT ${night.number}`;


    document.getElementById(
        "modal-mode"
    ).textContent =
        maxMode ? "MAX" : "NORMAL";


    document.getElementById(
        "modal-alias"
    ).textContent =
        data.alias;


    document.getElementById(
        "modal-wave-count"
    ).textContent =
        formatNumber(data.waveCount);


    document.getElementById(
        "modal-coin-reward"
    ).textContent =
        formatNumber(data.coinReward);


    document.getElementById(
        "modal-remnant-reward"
    ).textContent =
        formatNumber(data.remnantReward);

    document.getElementById(
        "modal-starting-cash"
    ).textContent =
        `$${data.startingCash.toLocaleString()}`;


    document.getElementById(
        "modal-boss"
    ).textContent =
        data.boss || "No boss";

}


// =========================================================
// MAX MODE BUTTON
// =========================================================

document
    .getElementById("max-mode-button")
    .addEventListener(
        "click",
        () => {

            if (!selectedNight) {
                return;
            }


            maxMode =
                !maxMode;


            document
                .getElementById(
                    "max-mode-button"
                )
                .classList.toggle(
                    "active",
                    maxMode
                );


            document
                .querySelector(
                    ".night-modal-content"
                )
                .classList.toggle(
                    "max-mode",
                    maxMode
                );


            updateNightModal();

        }
    );


// =========================================================
// CLOSE POPUP
// =========================================================

function closeNightModal() {

    document
        .getElementById("night-modal")
        .classList.remove("open");


    document.body.style.overflow =
        "";


    selectedNight = null;

}


document
    .getElementById("close-modal")
    .addEventListener(
        "click",
        closeNightModal
    );


// =========================================================
// CLICK OUTSIDE POPUP
// =========================================================

document
    .getElementById("night-modal")
    .addEventListener(
        "click",
        event => {

            if (
                event.target.id ===
                "night-modal"
            ) {

                closeNightModal();

            }

        }
    );


// =========================================================
// ESCAPE KEY
// =========================================================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            const modal =
                document.getElementById(
                    "night-modal"
                );


            if (
                modal.classList.contains(
                    "open"
                )
            ) {

                closeNightModal();

            }

        }

    }
);


// =========================================================
// NUMBER FORMAT
// =========================================================

function formatNumber(value) {
    if (value === undefined || value === null || value === "") {
        return "-";
    }

    if (typeof value === "string" && value.includes("-")) {
        return value;
    }

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return value;
    }

    return number.toLocaleString();
}


// =========================================================
// INITIALIZE
// =========================================================

buildGameFilters();

displayNights();