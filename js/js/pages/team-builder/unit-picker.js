/* =========================================
   V2.4.0 — UNIT PICKER
========================================= */
const builderUnitModal = document.getElementById("builder-unit-modal");
const builderUnitSearch = document.getElementById("builder-unit-search");
const builderUnitResults = document.getElementById("builder-unit-results");
const builderRarityFilter = document.getElementById("builder-rarity-filter");
const builderTypeFilter = document.getElementById("builder-type-filter");
const builderModalClose = document.getElementById("builder-unit-modal-close");
const builderSlots = Array(5).fill(null);
let builderSelectedSlot = null;
let builderPreviousFocus = null;
function openBuilderUnitPicker(slotIndex) {
    if (!builderUnitModal)
        return;
    builderSelectedSlot = slotIndex;
    builderPreviousFocus = document.activeElement;
    builderUnitSearch.value = "";
    builderRarityFilter.value = "";
    builderTypeFilter.value = "";
    renderBuilderUnitOptions();
    builderUnitModal.hidden = false;
    document.body.style.overflow = "hidden";
    builderUnitSearch.focus();
}
function closeBuilderUnitPicker() {
    if (!builderUnitModal)
        return;
    builderUnitModal.hidden = true;
    document.body.style.overflow = "";
    builderPreviousFocus?.focus();
}
function renderBuilderUnitOptions() {
    if (!builderUnitResults || typeof units === "undefined")
        return;
    builderUnitResults.innerHTML = "";
    const search = builderUnitSearch.value.trim().toLowerCase();
    const rarity = builderRarityFilter.value;
    const type = builderTypeFilter.value;
    const filtered = units.filter(unit => {
        return (unit.name.toLowerCase().includes(search) &&
            (!rarity || unit.rarity === rarity) &&
            (!type || unit.type === type));
    });
    if (!filtered.length) {
        const empty = document.createElement("p");
        empty.className = "builder-unit-empty";
        empty.textContent = "No matching units found.";
        builderUnitResults.appendChild(empty);
        return;
    }
    filtered.forEach(unit => {
        const option = document.createElement("button");
        option.type = "button";
        option.className = "builder-unit-option";
        const alreadyUsed = builderSlots.some(slot => slot && slot.unitName === unit.name);
        option.disabled = alreadyUsed;
        const img = document.createElement("img");
        img.src = unit.image;
        img.alt = "";
        img.loading = "lazy";
        const name = document.createElement("span");
        name.className = "builder-unit-option-name";
        name.textContent = unit.name;
        const rarityLabel = document.createElement("span");
        rarityLabel.className = "builder-unit-option-rarity";
        rarityLabel.textContent = unit.rarity;
        if (typeof getRarityColor === "function") {
            rarityLabel.style.color = getRarityColor(unit.rarity);
        }
        option.append(img, name, rarityLabel);
        option.addEventListener("click", () => {
            builderIsEditing = Boolean(builderSlots[builderSelectedSlot]);
            // Selecting a replacement opens configuration,
            // but the edit controls are only needed for an
            // already selected unit.
            builderIsEditing = false;
            openBuilderUnitConfig(unit);
        });
        builderUnitResults.appendChild(option);
    });
}
if (builderUnitModal &&
    builderUnitSearch &&
    builderUnitResults &&
    builderRarityFilter &&
    builderTypeFilter &&
    builderModalClose) {
    // Fill filters directly from the existing unit database.
    const rarities = [...new Set(units.map(unit => unit.rarity))];
    const types = [...new Set(units.map(unit => unit.type))];
    rarities.forEach(rarity => {
        builderRarityFilter.add(new Option(rarity, rarity));
    });
    types.forEach(type => {
        builderTypeFilter.add(new Option(type, type));
    });
    document.querySelectorAll(".builder-slot").forEach(slot => {
        slot.addEventListener("click", () => {
            const index = Number(slot.dataset.slot);
            const selection = builderSlots[index];
            if (selection) {
                const unit = findUnitByName(selection.unitName);
                if (unit) {
                    builderSelectedSlot = index;
                    builderPreviousFocus = slot;
                    builderIsEditing = true;
                    openBuilderUnitConfig(unit, selection.enchant);
                }
            }
            else {
                builderIsEditing = false;
                openBuilderUnitPicker(index);
            }
        });
    });
    builderUnitSearch.addEventListener("input", renderBuilderUnitOptions);
    builderRarityFilter.addEventListener("change", renderBuilderUnitOptions);
    builderTypeFilter.addEventListener("change", renderBuilderUnitOptions);
    builderModalClose.addEventListener("click", closeBuilderUnitPicker);
    builderUnitModal.addEventListener("click", event => {
        if (event.target === builderUnitModal) {
            closeBuilderUnitPicker();
        }
    });
    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && !builderUnitModal.hidden) {
            closeBuilderUnitPicker();
        }
    });
}
/* =========================================
   V2.4.0 — UNIT CONFIGURATION
========================================= */
const builderConfigModal = document.getElementById("builder-config-modal");
const builderConfigImage = document.getElementById("builder-config-image");
const builderConfigName = document.getElementById("builder-config-name");
const builderConfigRarity = document.getElementById("builder-config-rarity");
const builderConfigType = document.getElementById("builder-config-type");
const builderEnchantOptions = document.getElementById("builder-enchant-options");
let builderConfigUnit = null;
let builderSelectedEnchant = null;
let builderIsEditing = false;
function openBuilderUnitConfig(unit, savedEnchant = null) {
    if (!builderConfigModal || !unit)
        return;
    builderConfigUnit = unit;
    builderSelectedEnchant = savedEnchant;
    const editActions = document.getElementById("builder-edit-actions");
    const addButton = document.getElementById("builder-config-add");
    editActions.hidden = !builderIsEditing;
    addButton.textContent = builderIsEditing
        ? "SAVE CHANGES"
        : "ADD TO TEAM";
    builderConfigImage.src = unit.image;
    builderConfigImage.alt = unit.name;
    builderConfigName.textContent = unit.name;
    builderConfigRarity.textContent = unit.rarity;
    builderConfigType.textContent = unit.type;
    if (typeof getRarityColor === "function") {
        builderConfigRarity.style.color =
            getRarityColor(unit.rarity);
    }
    /* ENCHANTMENTS */
    builderEnchantOptions.innerHTML = "";
    const enchantNames = ["None", ...Object.keys(enchants)];
    enchantNames.forEach(enchantName => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "builder-enchant-option";
        button.dataset.enchant = enchantName;
        const label = document.createElement("span");
        label.textContent =
            enchantName === "None"
                ? "NONE"
                : enchants[enchantName].name;
        if (["Haywire", "Springlock", "Soul"].includes(enchantName)) {
            label.classList.add("builder-enchant-gradient-text");
        }
        button.appendChild(label);
        button.setAttribute("aria-pressed", String(enchantName === (savedEnchant || "None")));
        if (enchantName === (savedEnchant || "None")) {
            button.classList.add("selected");
        }
        button.addEventListener("click", () => {
            builderSelectedEnchant =
                enchantName === "None" ? null : enchantName;
            builderEnchantOptions
                .querySelectorAll(".builder-enchant-option")
                .forEach(option => {
                const selected = option.dataset.enchant === enchantName;
                option.classList.toggle("selected", selected);
                option.setAttribute("aria-pressed", String(selected));
            });
        });
        builderEnchantOptions.appendChild(button);
    });
    /* SWITCH MODALS */
    builderUnitModal.hidden = true;
    builderConfigModal.hidden = false;
    document.body.style.overflow = "hidden";
    document.getElementById("builder-config-close").focus();
}
function closeBuilderUnitConfig(goBack = false) {
    builderConfigModal.hidden = true;
    if (goBack) {
        builderUnitModal.hidden = false;
        renderBuilderUnitOptions();
        builderUnitSearch.focus();
    }
    else {
        document.body.style.overflow = "";
        builderPreviousFocus?.focus();
    }
}
/* MODAL EVENTS */
document.getElementById("builder-config-close")
    .addEventListener("click", () => {
    closeBuilderUnitConfig();
});
document.getElementById("builder-config-back")
    .addEventListener("click", () => {
    closeBuilderUnitConfig(true);
});
builderConfigModal.addEventListener("click", event => {
    if (event.target === builderConfigModal) {
        closeBuilderUnitConfig();
    }
});
document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !builderConfigModal.hidden) {
        closeBuilderUnitConfig();
    }
});
document.getElementById("builder-config-add")
    .addEventListener("click", () => {
    if (!builderConfigUnit || builderSelectedSlot === null)
        return;
    const duplicate = builderSlots.some((slot, index) => index !== builderSelectedSlot &&
        slot?.unitName === builderConfigUnit.name);
    if (duplicate) {
        alert("This unit is already on your team!");
        return;
    }
    builderSlots[builderSelectedSlot] = {
        unitName: builderConfigUnit.name,
        enchant: builderSelectedEnchant
    };
    renderBuilderSlots();
    closeBuilderUnitConfig();
});
