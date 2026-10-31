function initializeVersionHistory() {
    const modal = document.getElementById("version-history-modal");
    const openButton = document.getElementById("open-version-history");
    const closeButton = document.getElementById("close-version-history");
    const sidebar = document.getElementById("version-history-sidebar");
    const content = document.getElementById("version-history-content");
    if (!modal ||
        !openButton ||
        !closeButton ||
        !sidebar ||
        !content) {
        return;
    }
    let previousFocus = null;
    let selectedVersion = 0;
    function displayVersion(index) {
        const version = WEBSITE_VERSION_HISTORY[index];
        if (!version) {
            return;
        }
        selectedVersion = index;
        content.replaceChildren();
        const versionNumber = document.createElement("span");
        versionNumber.className = "version-history-version";
        versionNumber.textContent = version.version;
        const heading = document.createElement("h3");
        heading.textContent = version.title;
        const description = document.createElement("p");
        description.className = "version-history-description";
        description.textContent = version.description || "";
        const releaseDate = document.createElement("div");
        releaseDate.className = "version-history-date";
        releaseDate.textContent = version.date;
        content.appendChild(versionNumber);
        content.appendChild(heading);
        content.appendChild(releaseDate);
        content.appendChild(description);
        Object.entries(Array.isArray(version.changes)
            ? version.changes.reduce((groups, change) => {
                const category = String(change.type || "Changes").toUpperCase();
                (groups[category] ||= []).push(change.text || "");
                return groups;
            }, {})
            : (version.changes || {})).forEach(([groupTitle, changes]) => {
            const group = document.createElement("section");
            group.className = "version-history-group";
            const groupHeading = document.createElement("h4");
            groupHeading.textContent = groupTitle;
            const list = document.createElement("ul");
            changes.forEach(change => {
                const item = document.createElement("li");
                item.textContent = change;
                list.appendChild(item);
            });
            group.appendChild(groupHeading);
            group.appendChild(list);
            content.appendChild(group);
        });
        content.scrollTop = 0;
        sidebar.querySelectorAll(".version-history-tab").forEach((tab, tabIndex) => {
            const active = tabIndex === index;
            tab.classList.toggle("active", active);
            tab.setAttribute("aria-pressed", String(active));
        });
    }
    WEBSITE_VERSION_HISTORY.forEach((version, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "version-history-tab";
        const number = document.createElement("span");
        number.className = "version-history-tab-number";
        number.textContent = version.version;
        const title = document.createElement("span");
        title.className = "version-history-tab-title";
        title.textContent = version.title;
        button.appendChild(number);
        button.appendChild(title);
        button.addEventListener("click", () => {
            displayVersion(index);
        });
        sidebar.appendChild(button);
    });
    function openModal() {
        previousFocus = document.activeElement;
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        displayVersion(0);
        closeButton.focus();
    }
    function closeModal() {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        if (previousFocus && previousFocus.isConnected) {
            previousFocus.focus();
        }
    }
    openButton.addEventListener("click", openModal);
    closeButton.addEventListener("click", closeModal);
    modal.addEventListener("click", event => {
        if (event.target === modal) {
            closeModal();
        }
    });
    modal.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeModal();
            return;
        }
        if (event.key !== "Tab") {
            return;
        }
        const focusable = Array.from(modal.querySelectorAll('button:not([disabled]), a[href], ' +
            'input:not([disabled]), select:not([disabled]), ' +
            'textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(element => element.getClientRects().length > 0);
        if (!focusable.length) {
            return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        }
        else if (!event.shiftKey &&
            document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    });
    displayVersion(selectedVersion);
    if (window.location.hash === "#open-version-history") {
        window.requestAnimationFrame(() => openButton.click());
    }
}
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeVersionHistory);
}
else {
    initializeVersionHistory();
}
