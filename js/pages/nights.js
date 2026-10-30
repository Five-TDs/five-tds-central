const nightsContainer = document.getElementById("nights-container");
const gameFilters = document.getElementById("game-filters");
const filterButton = document.getElementById("filter-button");
const filterPanel = document.getElementById("filter-panel");
const filterArrow = document.getElementById("filter-arrow");
let activeGames = [];
let selectedNight = null;
let maxMode = false;
function buildGameFilters() {
    gameFilters.innerHTML = "";
    nights.forEach(game => {
        const button = document.createElement("button");
        button.type = "button";
        button.className =
            "filter-option";
        button.dataset.game =
            game.game;
        button.textContent =
            "CHAPTER " + game.game;
        button.addEventListener("click", () => {
            toggleGameFilter(game.game, button);
        });
        gameFilters.appendChild(button);
    });
}
function toggleGameFilter(gameNumber, button) {
    if (activeGames.includes(gameNumber)) {
        activeGames =
            activeGames.filter(game => game !== gameNumber);
        button.classList.remove("active");
    }
    else {
        activeGames.push(gameNumber);
        button.classList.add("active");
    }
    displayNights();
}
filterButton.addEventListener("click", () => {
    const isOpen = filterPanel.classList.toggle("open");
    filterButton.classList.toggle("open", isOpen);
});
function displayNights() {
    nightsContainer.innerHTML = "";
    nights.forEach(game => {
        if (activeGames.length > 0 &&
            !activeGames.includes(game.game)) {
            return;
        }
        const section = document.createElement("section");
        section.className =
            "game-section";
        const header = document.createElement("div");
        header.className =
            "game-header";
        const title = document.createElement("div");
        title.className =
            "game-title";
        title.textContent =
            "CHAPTER " + game.game;
        const line = document.createElement("div");
        line.className =
            "game-line";
        header.appendChild(title);
        header.appendChild(line);
        const grid = document.createElement("div");
        grid.className =
            "night-grid";
        game.nights.forEach(night => {
            const card = document.createElement("button");
            card.type = "button";
            card.className =
                "night-card";
            const number = document.createElement("span");
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
            card.addEventListener("click", () => {
                openNightModal(game, night);
            });
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
function openNightModal(game, night) {
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
    const game = selectedNight.game;
    const night = selectedNight.night;
    const data = maxMode
        ? night.max
        : night.normal;
    document.getElementById("modal-title").textContent =
        `CHAPTER ${game.game} - NIGHT ${night.number}`;
    document.getElementById("modal-mode").textContent =
        maxMode ? "MAX" : "NORMAL";
    document.getElementById("modal-alias").textContent =
        data.alias;
    document.getElementById("modal-wave-count").textContent =
        formatNumber(data.waveCount);
    document.getElementById("modal-coin-reward").textContent =
        formatNumber(data.coinReward);
    document.getElementById("modal-remnant-reward").textContent =
        formatNumber(data.remnantReward);
    document.getElementById("modal-starting-cash").textContent =
        `$${data.startingCash.toLocaleString()}`;
    document.getElementById("modal-boss").textContent =
        data.boss || "No boss";
}
// =========================================================
// MAX MODE BUTTON
// =========================================================
document
    .getElementById("max-mode-button")
    .addEventListener("click", () => {
    if (!selectedNight) {
        return;
    }
    maxMode =
        !maxMode;
    document
        .getElementById("max-mode-button")
        .classList.toggle("active", maxMode);
    document
        .querySelector(".night-modal-content")
        .classList.toggle("max-mode", maxMode);
    updateNightModal();
});
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
    .addEventListener("click", closeNightModal);
// =========================================================
// CLICK OUTSIDE POPUP
// =========================================================
document
    .getElementById("night-modal")
    .addEventListener("click", event => {
    if (event.target.id ===
        "night-modal") {
        closeNightModal();
    }
});
// =========================================================
// ESCAPE KEY
// =========================================================
document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        const modal = document.getElementById("night-modal");
        if (modal.classList.contains("open")) {
            closeNightModal();
        }
    }
});
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
