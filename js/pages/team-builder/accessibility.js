/* =========================================
   V2.4.0 — MODAL KEYBOARD ACCESSIBILITY
========================================= */
const builderAccessibleModals = [
    builderUnitModal,
    builderConfigModal,
    builderMoveModal,
    builderTeamActionModal,
    builderShareModal
].filter(Boolean);
function getBuilderActiveModal() {
    return [...builderAccessibleModals]
        .reverse()
        .find(modal => !modal.hidden);
}
function getBuilderModalFocusableElements(modal) {
    const selector = [
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        'a[href]',
        '[tabindex]:not([tabindex="-1"])'
    ].join(",");
    return [...modal.querySelectorAll(selector)].filter(element => {
        return (!element.hidden &&
            element.getClientRects().length > 0 &&
            getComputedStyle(element).visibility !== "hidden");
    });
}
document.addEventListener("keydown", event => {
    if (event.key !== "Tab")
        return;
    const modal = getBuilderActiveModal();
    if (!modal)
        return;
    const focusable = getBuilderModalFocusableElements(modal);
    // No available controls: keep focus on the modal.
    if (!focusable.length) {
        event.preventDefault();
        if (!modal.hasAttribute("tabindex")) {
            modal.tabIndex = -1;
        }
        modal.focus();
        return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const current = document.activeElement;
    const focusIsInside = modal.contains(current);
    // If focus somehow escaped the modal, bring it back.
    if (!focusIsInside) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
        return;
    }
    // Shift + Tab from first control wraps to last.
    if (event.shiftKey && current === first) {
        event.preventDefault();
        last.focus();
        return;
    }
    // Tab from last control wraps to first.
    if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
    }
});
