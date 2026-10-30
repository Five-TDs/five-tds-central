/* =========================================
   V2.4.0 — TEAM MANAGEMENT
========================================= */
const builderEditActions = document.getElementById("builder-edit-actions");
const builderMoveModal = document.getElementById("builder-move-modal");
const builderMoveOptions = document.getElementById("builder-move-options");
let builderMoveSource = null;
document.getElementById("builder-config-remove")
    .addEventListener("click", () => {
    if (builderSelectedSlot === null)
        return;
    builderSlots[builderSelectedSlot] = null;
    renderBuilderSlots();
    closeBuilderUnitConfig();
});
document.getElementById("builder-config-replace")
    .addEventListener("click", () => {
    closeBuilderUnitConfig(true);
});
document.getElementById("builder-config-move")
    .addEventListener("click", () => {
    if (builderSelectedSlot === null)
        return;
    builderMoveSource = builderSelectedSlot;
    builderConfigModal.hidden = true;
    builderMoveModal.hidden = false;
    renderBuilderMoveOptions();
    document.getElementById("builder-move-close").focus();
});
function renderBuilderMoveOptions() {
    builderMoveOptions.replaceChildren();
    builderSlots.forEach((selection, index) => {
        if (index === builderMoveSource)
            return;
        const button = document.createElement("button");
        button.type = "button";
        button.className = "builder-move-option";
        const label = document.createElement("span");
        label.className = "builder-move-slot-label";
        label.textContent = `SLOT ${index + 1}`;
        const unitName = document.createElement("span");
        unitName.className = "builder-move-unit-name";
        unitName.textContent = selection?.unitName || "EMPTY";
        button.append(label, unitName);
        button.addEventListener("click", () => {
            const source = builderMoveSource;
            if (source === null)
                return;
            const temporary = builderSlots[source];
            builderSlots[source] = builderSlots[index];
            builderSlots[index] = temporary;
            renderBuilderSlots();
            closeBuilderMoveModal();
        });
        builderMoveOptions.appendChild(button);
    });
}
function closeBuilderMoveModal() {
    builderMoveModal.hidden = true;
    builderMoveSource = null;
    document.body.style.overflow = "";
    builderPreviousFocus?.focus();
}
document.getElementById("builder-move-close")
    .addEventListener("click", closeBuilderMoveModal);
builderMoveModal.addEventListener("click", event => {
    if (event.target === builderMoveModal) {
        closeBuilderMoveModal();
    }
});
document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !builderMoveModal.hidden) {
        closeBuilderMoveModal();
    }
});
/* =========================================
   V2.4.0 — CUSTOM STAT VISIBILITY
========================================= */
const builderStatCheckboxes = document.querySelectorAll("[data-builder-stat]");
const BUILDER_STAT_STORAGE_KEY = "fivetds-team-builder-stat-preferences";
function updateBuilderStatVisibility() {
    const preferences = {};
    builderStatCheckboxes.forEach(checkbox => {
        const key = checkbox.dataset.builderStat;
        const visible = checkbox.checked;
        preferences[key] = visible;
        const statBox = document.querySelector(`[data-stat-box="${key}"]`);
        if (statBox) {
            statBox.hidden = !visible;
        }
    });
    try {
        localStorage.setItem(BUILDER_STAT_STORAGE_KEY, JSON.stringify(preferences));
    }
    catch (error) {
        console.warn("Could not save stat preferences:", error);
    }
}
function loadBuilderStatPreferences() {
    try {
        const saved = localStorage.getItem(BUILDER_STAT_STORAGE_KEY);
        if (saved) {
            const preferences = JSON.parse(saved);
            builderStatCheckboxes.forEach(checkbox => {
                const key = checkbox.dataset.builderStat;
                if (typeof preferences[key] === "boolean") {
                    checkbox.checked = preferences[key];
                }
            });
        }
    }
    catch (error) {
        console.warn("Could not load stat preferences:", error);
    }
    updateBuilderStatVisibility();
}
builderStatCheckboxes.forEach(checkbox => {
    checkbox.addEventListener("change", updateBuilderStatVisibility);
});
loadBuilderStatPreferences();
