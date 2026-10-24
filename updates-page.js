
/* =========================================
   UPDATES PAGE RENDERER
========================================= */

const updatesContent = document.getElementById("updates-content");
const updatesHeader = document.getElementById("updates-header");

function makeElement(tag, className = "", text = null) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== null) el.textContent = text;
    return el;
}

function makeImage(src, alt = "") {
    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    img.loading = "lazy";
    return img;
}

function formatUpdateDate(value) {
    if (!value) return "";

    const date = new Date(value + "T12:00:00");

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
    });
}

/* =========================================
   UPDATES LIST
========================================= */

function renderUpdatesList() {
    updatesContent.replaceChildren();
    updatesHeader.hidden = false;

    const list = makeElement("div", "updates-list");

    const sorted = [...UPDATES].sort(
        (a, b) => b.date.localeCompare(a.date)
    );

    sorted.forEach(update => {
        const card = makeElement("a", "update-list-card");
        card.href = `updates.html?id=${encodeURIComponent(update.id)}`;

        if (update.banner) {
            const banner = makeImage(update.banner, update.name);
            banner.className = "update-list-banner";
            card.appendChild(banner);
        }

        const details = makeElement("div", "update-list-details");

        details.appendChild(
            makeElement("h2", "", update.name)
        );

        details.appendChild(
            makeElement("p", "update-list-alias", update.alias)
        );

        details.appendChild(
            makeElement(
                "span",
                "update-list-date",
                formatUpdateDate(update.date)
            )
        );

        card.appendChild(details);

        card.appendChild(
            makeElement("span", "update-list-arrow", "→")
        );

        list.appendChild(card);
    });

    updatesContent.appendChild(list);
}

/* =========================================
   FEATURES
========================================= */

function renderFeatures(section, container) {
    const list = makeElement("div", "update-features");

    (section.items || []).forEach(item => {
        const feature = makeElement("div", "update-feature");

        const heading = makeElement("div", "update-feature-heading");

        if (item.tag) {
            heading.appendChild(
                makeElement("span", "update-feature-tag", item.tag)
            );
        }

        heading.appendChild(
            makeElement("strong", "", item.title || "")
        );

        feature.appendChild(heading);

        if (item.description) {
            feature.appendChild(
                makeElement("p", "", item.description)
            );
        }

        list.appendChild(feature);
    });

    container.appendChild(list);
}

/* =========================================
   IMAGE GALLERY
========================================= */

function renderGallery(section, container) {
    const gallery = makeElement("div", "update-gallery");

    (section.images || []).forEach(item => {
        const figure = makeElement("figure", "update-figure");
        const img = makeImage(item.src, item.caption || "");

        img.addEventListener("click", () => {
            openUpdateImage(item.src, item.caption || "");
        });

        figure.appendChild(img);

        if (item.caption) {
            figure.appendChild(
                makeElement("figcaption", "", item.caption)
            );
        }

        gallery.appendChild(figure);
    });

    container.appendChild(gallery);
}

/* =========================================
   SPLIT IMAGE + TEXT
========================================= */

function renderSplit(section, container) {
    const split = makeElement("div", "update-split");

    if (section.image) {
        const figure = makeElement("figure", "update-figure");
        const img = makeImage(
            section.image,
            section.caption || section.title || ""
        );

        img.addEventListener("click", () => {
            openUpdateImage(
                section.image,
                section.caption || ""
            );
        });

        figure.appendChild(img);

        if (section.caption) {
            figure.appendChild(
                makeElement("figcaption", "", section.caption)
            );
        }

        split.appendChild(figure);
    }

    const text = makeElement("div", "update-split-text");

    (section.paragraphs || []).forEach(paragraph => {
        text.appendChild(makeElement("p", "", paragraph));
    });

    split.appendChild(text);
    container.appendChild(split);
}

/* =========================================
   TEXT
========================================= */

function renderText(section, container) {
    const text = makeElement("div", "update-text");

    (section.paragraphs || []).forEach(paragraph => {
        text.appendChild(makeElement("p", "", paragraph));
    });

    container.appendChild(text);
}

/* =========================================
   LISTS
========================================= */

function renderList(section, container) {
    const list = makeElement("div", "update-change-list");

    (section.items || []).forEach(item => {
        const row = makeElement("div", "update-change");

        row.appendChild(
            makeElement(
                "span",
                "update-change-marker",
                section.marker || "★"
            )
        );

        row.appendChild(
            makeElement("span", "", item)
        );

        list.appendChild(row);
    });

    container.appendChild(list);
}

/* =========================================
   CODES
========================================= */

function renderCodes(section, container) {
    const list = makeElement("div", "update-codes");

    (section.items || []).forEach(item => {
        const row = makeElement("div", "update-code");

        row.appendChild(
            makeElement("span", "update-code-icon", "🎁")
        );

        const content = makeElement("div");

        const code = makeElement(
            "strong",
            "update-code-name",
            item.code || ""
        );

        content.appendChild(code);

        if (item.rewards) {
            content.appendChild(
                makeElement("span", "", `: ${item.rewards}`)
            );
        }

        if (item.requirement) {
            content.appendChild(
                makeElement(
                    "span",
                    "update-code-requirement",
                    ` (Requirement: ${item.requirement})`
                )
            );
        }

        row.appendChild(content);
        list.appendChild(row);
    });

    container.appendChild(list);
}

/* =========================================
   SECTION BUILDER
========================================= */

function renderUpdateSection(section) {
    const card = makeElement("section", "update-section");

    card.appendChild(
        makeElement("h2", "update-section-title", section.title || "")
    );

    switch (section.type) {
        case "features":
            renderFeatures(section, card);
            break;

        case "gallery":
            renderGallery(section, card);
            break;

        case "split":
            renderSplit(section, card);
            break;

        case "text":
            renderText(section, card);
            break;

        case "list":
            renderList(section, card);
            break;

        case "codes":
            renderCodes(section, card);
            break;

        default:
            console.warn("Unknown update section type:", section.type);
    }

    return card;
}

/* =========================================
   INDIVIDUAL UPDATE
========================================= */

function renderSingleUpdate(update) {
    updatesContent.replaceChildren();
    updatesHeader.hidden = true;

    const article = makeElement("article", "update-article");

    const back = makeElement(
        "a",
        "update-back-link",
        "← BACK TO UPDATE LOGS"
    );

    back.href = "updates.html";
    article.appendChild(back);

    if (update.banner) {
        const banner = makeImage(update.banner, update.name);
        banner.className = "update-hero-banner";
        article.appendChild(banner);
    }

    const heading = makeElement("header", "update-article-header");

    heading.appendChild(
        makeElement("h1", "", update.name)
    );

    heading.appendChild(
        makeElement("p", "", update.alias || "")
    );

    article.appendChild(heading);

    article.appendChild(
        makeElement("div", "update-accent-divider")
    );

    (update.sections || []).forEach(section => {
        article.appendChild(renderUpdateSection(section));
    });

    updatesContent.appendChild(article);
    document.title = `${update.name} | FIVE TD'S CENTRAL`;
}

/* =========================================
   IMAGE LIGHTBOX
========================================= */

const imageModal = document.getElementById("update-image-modal");
const modalImage = document.getElementById("update-modal-image");

function openUpdateImage(src, alt) {
    modalImage.src = src;
    modalImage.alt = alt;
    imageModal.classList.add("open");
    imageModal.setAttribute("aria-hidden", "false");
}

function closeUpdateImage() {
    imageModal.classList.remove("open");
    imageModal.setAttribute("aria-hidden", "true");
    modalImage.removeAttribute("src");
}

document.querySelector(".update-image-close")
    .addEventListener("click", closeUpdateImage);

imageModal.addEventListener("click", event => {
    if (event.target === imageModal) closeUpdateImage();
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeUpdateImage();
});

/* =========================================
   INITIALIZE
========================================= */

function initializeUpdates() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        renderUpdatesList();
        return;
    }

    const update = UPDATES.find(item => item.id === id);

    if (!update) {
        updatesContent.replaceChildren(
            makeElement(
                "p",
                "updates-error",
                "This update could not be found."
            )
        );
        return;
    }

    renderSingleUpdate(update);
}

initializeUpdates();
