/* =========================================
   V2.4.0 — SAVED TEAMS
========================================= */
const BUILDER_TEAMS_STORAGE_KEY = "fivetds-saved-teams-v1";
const builderSavedTeamSelect = document.getElementById("builder-saved-team-select");
let builderSavedTeams = [];
let builderActiveTeamId = null;
function createBuilderTeam(name, slots = null) {
    return {
        id: `team-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        name,
        slots: slots
            ? slots.map(slot => slot ? { ...slot } : null)
            : Array(5).fill(null)
    };
}
function saveBuilderTeams() {
    const activeTeam = builderSavedTeams.find(team => team.id === builderActiveTeamId);
    if (activeTeam) {
        activeTeam.slots = builderSlots.map(slot => slot ? { ...slot } : null);
    }
    try {
        localStorage.setItem(BUILDER_TEAMS_STORAGE_KEY, JSON.stringify({
            activeTeamId: builderActiveTeamId,
            teams: builderSavedTeams
        }));
        // Only show SAVED after storage succeeds.
        showBuilderSaveStatus();
        return true;
    }
    catch (error) {
        console.warn("Could not save teams:", error);
        const status = document.getElementById("builder-save-status");
        const text = document.getElementById("builder-save-status-text");
        clearTimeout(builderSaveStatusTimer);
        if (status && text) {
            status.classList.remove("saved");
            text.textContent = "SAVE FAILED";
        }
        return false;
    }
}
function renderBuilderTeamSelector() {
    builderSavedTeamSelect.replaceChildren();
    builderSavedTeams.forEach(team => {
        const option = document.createElement("option");
        option.value = team.id;
        option.textContent = team.name;
        builderSavedTeamSelect.appendChild(option);
    });
    builderSavedTeamSelect.value = builderActiveTeamId;
}
function loadBuilderTeam(teamId) {
    const team = builderSavedTeams.find(item => item.id === teamId);
    if (!team)
        return;
    builderActiveTeamId = team.id;
    team.slots.forEach((slot, index) => {
        builderSlots[index] = slot ? { ...slot } : null;
    });
    renderBuilderTeamSelector();
    renderBuilderSlots();
    saveBuilderTeams();
}
function loadSavedBuilderTeams() {
    try {
        const saved = localStorage.getItem(BUILDER_TEAMS_STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed.teams)) {
                builderSavedTeams = parsed.teams;
                builderActiveTeamId = parsed.activeTeamId;
            }
        }
    }
    catch (error) {
        console.warn("Could not load saved teams:", error);
    }
    if (!builderSavedTeams.length) {
        const defaultTeam = createBuilderTeam("My First Team");
        builderSavedTeams.push(defaultTeam);
        builderActiveTeamId = defaultTeam.id;
    }
    if (!builderSavedTeams.some(team => team.id === builderActiveTeamId)) {
        builderActiveTeamId = builderSavedTeams[0].id;
    }
    loadBuilderTeam(builderActiveTeamId);
}
/* =========================================
   TEAM ACTIONS
========================================= */
builderSavedTeamSelect.addEventListener("change", () => {
    // Save current team before switching.
    saveBuilderTeams();
    loadBuilderTeam(builderSavedTeamSelect.value);
});
document.getElementById("builder-new-team")
    .addEventListener("click", () => openBuilderTeamAction("new"));
document.getElementById("builder-rename-team")
    .addEventListener("click", () => openBuilderTeamAction("rename"));
document.getElementById("builder-duplicate-team")
    .addEventListener("click", () => openBuilderTeamAction("duplicate"));
document.getElementById("builder-delete-team")
    .addEventListener("click", () => openBuilderTeamAction("delete"));
/* =========================================
   V2.4.0 — POLISHED TEAM MANAGEMENT
========================================= */
const builderTeamActionModal = document.getElementById("builder-team-action-modal");
const builderTeamActionTitle = document.getElementById("builder-team-action-title");
const builderTeamActionDescription = document.getElementById("builder-team-action-description");
const builderTeamNameInput = document.getElementById("builder-team-name-input");
const builderTeamNameLabel = document.getElementById("builder-team-name-label");
const builderTeamActionError = document.getElementById("builder-team-action-error");
const builderTeamActionConfirm = document.getElementById("builder-team-action-confirm");
let builderTeamAction = null;
let builderTeamActionPreviousFocus = null;
let builderSaveStatusTimer = null;
function openBuilderTeamAction(action) {
    const active = builderSavedTeams.find(team => team.id === builderActiveTeamId);
    builderTeamAction = action;
    builderTeamActionPreviousFocus = document.activeElement;
    builderTeamActionError.hidden = true;
    builderTeamNameInput.value = "";
    builderTeamNameInput.hidden = action === "delete";
    builderTeamNameLabel.hidden = action === "delete";
    const configs = {
        new: {
            title: "CREATE NEW TEAM",
            description: "Give your new team a name to get started.",
            confirm: "CREATE TEAM",
            name: ""
        },
        rename: {
            title: "RENAME TEAM",
            description: "Choose a new name for your current team.",
            confirm: "SAVE NAME",
            name: active?.name || ""
        },
        duplicate: {
            title: "DUPLICATE TEAM",
            description: "Create a copy of your current team, including its units and enchantments.",
            confirm: "DUPLICATE",
            name: `${active?.name || "Team"} (Copy)`
        },
        delete: {
            title: "DELETE TEAM",
            description: `Permanently delete "${active?.name || "this team"}" from this browser? This cannot be undone.`,
            confirm: "DELETE TEAM",
            name: ""
        }
    };
    const config = configs[action];
    if (!config)
        return;
    builderTeamActionTitle.textContent = config.title;
    builderTeamActionDescription.textContent = config.description;
    builderTeamActionConfirm.textContent = config.confirm;
    builderTeamNameInput.value = config.name;
    builderTeamActionConfirm.classList.toggle("builder-team-delete-confirm", action === "delete");
    builderTeamActionModal.hidden = false;
    document.body.style.overflow = "hidden";
    if (action === "delete") {
        builderTeamActionConfirm.focus();
    }
    else {
        builderTeamNameInput.focus();
        builderTeamNameInput.select();
    }
}
function closeBuilderTeamAction() {
    builderTeamActionModal.hidden = true;
    builderTeamAction = null;
    document.body.style.overflow = "";
    builderTeamActionPreviousFocus?.focus();
}
function confirmBuilderTeamAction() {
    const action = builderTeamAction;
    if (!action)
        return;
    const name = builderTeamNameInput.value.trim();
    if (action !== "delete" && !name) {
        builderTeamActionError.textContent = "Please enter a team name.";
        builderTeamActionError.hidden = false;
        builderTeamNameInput.focus();
        return;
    }
    const active = builderSavedTeams.find(team => team.id === builderActiveTeamId);
    if (action === "new") {
        saveBuilderTeams();
        const team = createBuilderTeam(name);
        builderSavedTeams.push(team);
        loadBuilderTeam(team.id);
    }
    if (action === "rename" && active) {
        active.name = name;
        renderBuilderTeamSelector();
        saveBuilderTeams();
    }
    if (action === "duplicate" && active) {
        saveBuilderTeams();
        const copy = createBuilderTeam(name, active.slots);
        builderSavedTeams.push(copy);
        loadBuilderTeam(copy.id);
    }
    if (action === "delete" && active) {
        builderSavedTeams = builderSavedTeams.filter(team => team.id !== active.id);
        if (!builderSavedTeams.length) {
            builderSavedTeams.push(createBuilderTeam("My First Team"));
        }
        loadBuilderTeam(builderSavedTeams[0].id);
    }
    closeBuilderTeamAction();
    updateBuilderActiveTeamInfo();
}
document.getElementById("builder-team-action-close")
    .addEventListener("click", closeBuilderTeamAction);
document.getElementById("builder-team-action-cancel")
    .addEventListener("click", closeBuilderTeamAction);
builderTeamActionConfirm.addEventListener("click", confirmBuilderTeamAction);
builderTeamNameInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        event.preventDefault();
        confirmBuilderTeamAction();
    }
});
builderTeamActionModal.addEventListener("click", event => {
    if (event.target === builderTeamActionModal) {
        closeBuilderTeamAction();
    }
});
document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !builderTeamActionModal.hidden) {
        closeBuilderTeamAction();
    }
});
/* Active team summary */
function updateBuilderActiveTeamInfo() {
    const active = builderSavedTeams.find(team => team.id === builderActiveTeamId);
    if (!active)
        return;
    document.getElementById("builder-active-team-name").textContent =
        active.name;
    const count = builderSlots.filter(Boolean).length;
    document.getElementById("builder-active-team-summary").textContent =
        `${count} / 5 units`;
}
/* Save feedback */
function showBuilderSaveStatus() {
    const status = document.getElementById("builder-save-status");
    const text = document.getElementById("builder-save-status-text");
    if (!status || !text)
        return;
    clearTimeout(builderSaveStatusTimer);
    text.textContent = "SAVED";
    status.classList.add("saved");
    builderSaveStatusTimer = setTimeout(() => {
        text.textContent = "AUTO-SAVE ON";
        status.classList.remove("saved");
    }, 1800);
}
loadSavedBuilderTeams();
