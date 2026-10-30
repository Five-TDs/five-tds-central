/* =========================================
   V2.4.0 — SHAREABLE TEAMS
========================================= */
const builderShareButton = document.getElementById("builder-share-team");
const builderShareModal = document.getElementById("builder-share-modal");
const builderSharePreview = document.getElementById("builder-share-preview");
const builderShareDescription = document.getElementById("builder-share-description");
let builderIncomingTeam = null;
let builderSharePreviousFocus = null;
/* Encode UTF-8 text safely for URL sharing */
function builderEncodeTeam(data) {
    const bytes = new TextEncoder().encode(JSON.stringify(data));
    let binary = "";
    bytes.forEach(byte => {
        binary += String.fromCharCode(byte);
    });
    return btoa(binary)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/g, "");
}
function builderDecodeTeam(encoded) {
    const normalized = encoded
        .replace(/-/g, "+")
        .replace(/_/g, "/");
    const binary = atob(normalized);
    const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
}
/* Generate share link */
async function shareBuilderTeam() {
    const active = builderSavedTeams.find(team => team.id === builderActiveTeamId);
    if (!active)
        return;
    const data = {
        version: 1,
        name: active.name,
        slots: builderSlots.map(slot => slot
            ? {
                unitName: slot.unitName,
                enchant: slot.enchant || null
            }
            : null)
    };
    const url = new URL(window.location.href);
    url.searchParams.set("team", builderEncodeTeam(data));
    // Avoid carrying an old URL fragment into the shared link.
    url.hash = "";
    try {
        await navigator.clipboard.writeText(url.toString());
        const originalText = builderShareButton.textContent;
        builderShareButton.textContent = "LINK COPIED!";
        setTimeout(() => {
            builderShareButton.textContent = originalText;
        }, 2000);
    }
    catch (error) {
        // Clipboard may be unavailable on HTTP or local file pages.
        window.prompt("Copy your team link:", url.toString());
    }
}
/* Validate imported team data */
function validateBuilderSharedTeam(data) {
    if (!data || data.version !== 1)
        return null;
    if (typeof data.name !== "string" ||
        !Array.isArray(data.slots) ||
        data.slots.length !== 5) {
        return null;
    }
    const usedUnits = new Set();
    const slots = [];
    for (const slot of data.slots) {
        if (slot === null) {
            slots.push(null);
            continue;
        }
        if (!slot ||
            typeof slot.unitName !== "string" ||
            typeof slot.enchant !== "string" && slot.enchant !== null) {
            return null;
        }
        const unit = findUnitByName(slot.unitName);
        if (!unit || usedUnits.has(unit.name)) {
            return null;
        }
        if (slot.enchant && !enchants[slot.enchant]) {
            return null;
        }
        usedUnits.add(unit.name);
        slots.push({
            unitName: unit.name,
            enchant: slot.enchant
        });
    }
    return {
        name: data.name.trim().slice(0, 50) || "Shared Team",
        slots
    };
}
/* Shared team preview */
function openBuilderSharePreview(team) {
    builderIncomingTeam = team;
    builderSharePreviousFocus = document.activeElement;
    builderShareDescription.textContent =
        `Someone shared "${team.name}" with you. ` +
            "Importing creates a new saved team without changing your existing teams.";
    builderSharePreview.replaceChildren();
    team.slots.forEach((selection, index) => {
        const card = document.createElement("div");
        card.className = "builder-share-unit";
        if (!selection) {
            card.textContent = `SLOT ${index + 1} — EMPTY`;
            builderSharePreview.appendChild(card);
            return;
        }
        const unit = findUnitByName(selection.unitName);
        const image = document.createElement("img");
        image.src = unit.image;
        image.alt = "";
        const name = document.createElement("strong");
        name.textContent = unit.name;
        const enchant = document.createElement("span");
        enchant.textContent =
            (selection.enchant || "None").toUpperCase();
        enchant.dataset.enchant =
            selection.enchant || "None";
        enchant.className = "builder-slot-enchant";
        card.append(image, name, enchant);
        builderSharePreview.appendChild(card);
    });
    builderShareModal.hidden = false;
    document.body.style.overflow = "hidden";
    document.getElementById("builder-share-import").focus();
}
function closeBuilderSharePreview() {
    builderShareModal.hidden = true;
    builderIncomingTeam = null;
    document.body.style.overflow = "";
    // Remove the shared team from the URL
    // so refreshing won't reopen the preview.
    const url = new URL(window.location.href);
    if (url.searchParams.has("team")) {
        url.searchParams.delete("team");
        window.history.replaceState(window.history.state, "", url.toString());
    }
    builderSharePreviousFocus?.focus();
}
/* Import as a new saved team */
function importBuilderSharedTeam() {
    if (!builderIncomingTeam)
        return;
    saveBuilderTeams();
    const imported = createBuilderTeam(builderIncomingTeam.name, builderIncomingTeam.slots);
    builderSavedTeams.push(imported);
    closeBuilderSharePreview();
    loadBuilderTeam(imported.id);
    updateBuilderActiveTeamInfo();
    // Remove the share parameter after importing.
    const url = new URL(window.location.href);
    url.searchParams.delete("team");
    window.history.replaceState({}, "", url.toString());
}
/* Button events */
builderShareButton.addEventListener("click", shareBuilderTeam);
document.getElementById("builder-share-close")
    .addEventListener("click", closeBuilderSharePreview);
document.getElementById("builder-share-cancel")
    .addEventListener("click", closeBuilderSharePreview);
document.getElementById("builder-share-import")
    .addEventListener("click", importBuilderSharedTeam);
builderShareModal.addEventListener("click", event => {
    if (event.target === builderShareModal) {
        closeBuilderSharePreview();
    }
});
document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !builderShareModal.hidden) {
        closeBuilderSharePreview();
    }
});
/* Check for a shared team in the URL */
function checkBuilderSharedTeamURL() {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("team");
    if (!encoded)
        return;
    try {
        if (encoded.length > 12000) {
            throw new Error("Shared team link is too long.");
        }
        const decoded = builderDecodeTeam(encoded);
        const team = validateBuilderSharedTeam(decoded);
        if (!team) {
            throw new Error("Invalid shared team data.");
        }
        openBuilderSharePreview(team);
    }
    catch (error) {
        console.warn("Could not load shared team:", error);
        // Remove the invalid team parameter.
        const cleanURL = new URL(window.location.href);
        cleanURL.searchParams.delete("team");
        window.history.replaceState(window.history.state, "", cleanURL.toString());
        alert("This shared team link is invalid or no longer supported. " +
            "Your saved teams have not been changed.");
    }
}
checkBuilderSharedTeamURL();
