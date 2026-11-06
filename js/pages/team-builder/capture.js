/* =========================================
   V2.4.0 — CAPTURE TEAM AS PNG
========================================= */
const builderCaptureButton = document.getElementById("builder-capture-team");
function builderCaptureRoundedRect(ctx, x, y, w, h, radius, fill, stroke) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
    if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
    }
    if (stroke) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 4;
        ctx.stroke();
    }
}
function builderCaptureFitText(ctx, text, maxWidth, fontSize, minSize = 13) {
    let size = fontSize;
    while (size > minSize) {
        ctx.font = `900 ${size}px Arial`;
        if (ctx.measureText(text).width <= maxWidth) {
            break;
        }
        size--;
    }
    return size;
}
function builderCaptureWrapText(ctx, text, maxWidth) {
    const words = text.split(/\s+/);
    const lines = [];
    let line = "";
    words.forEach(word => {
        const test = line ? `${line} ${word}` : word;
        if (ctx.measureText(test).width > maxWidth && line) {
            lines.push(line);
            line = word;
        }
        else {
            line = test;
        }
    });
    if (line)
        lines.push(line);
    return lines;
}
function builderCaptureDrawEnchant(ctx, enchant, x, y) {
    const special = {
        Haywire: ["#8b5cf6", "#98ffcc"],
        Springlock: ["#98ffcc", "#ff3b3b"],
        Soul: ["#14b8a6", "#ff69b4"]
    };
    const normal = {
        Battery: "#b4ffaa",
        Hunt: "#aaaaff",
        Hook: "#ff8787",
        Eco: "#fffa96",
        None: "#aaaaaa"
    };
    ctx.font = "900 20px Arial";
    ctx.textAlign = "center";
    const label = enchant.toUpperCase();
    if (special[enchant]) {
        const width = ctx.measureText(label).width;
        const gradient = ctx.createLinearGradient(x - width / 2, y, x + width / 2, y);
        gradient.addColorStop(0, special[enchant][0]);
        gradient.addColorStop(1, special[enchant][1]);
        ctx.fillStyle = gradient;
    }
    else {
        ctx.fillStyle = normal[enchant] || "#aaaaaa";
    }
    ctx.fillText(label, x, y);
}
async function builderCaptureLoadImage(src) {
    return new Promise(resolve => {
        const image = new Image();
        // Request cross-origin images using CORS
        image.crossOrigin = "anonymous";
        image.onload = () => resolve(image);
        image.onerror = () => {
            console.warn("Could not load image for capture:", src);
            resolve(null);
        };
        image.src = src;
    });
}
async function captureBuilderTeam() {
    const active = builderSavedTeams.find(team => team.id === builderActiveTeamId);
    if (!active)
        return;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const slotWidth = 212;
    const slotHeight = 330;
    const gap = 20;
    const padding = 22;
    canvas.width = padding * 2 + slotWidth * 5 + gap * 4;
    canvas.height = slotHeight + padding * 2;
    ctx.fillStyle = "#101010";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const images = await Promise.all(builderSlots.map(async (selection) => {
        if (!selection)
            return null;
        const unit = findUnitByName(selection.unitName);
        if (!unit)
            return null;
        return builderCaptureLoadImage(unit.image);
    }));
    const missingImages = builderSlots.some((selection, index) => selection && !images[index]);
    if (missingImages) {
        throw new Error("One or more unit images could not be loaded for capture.");
    }
    builderSlots.forEach((selection, index) => {
        const x = padding + index * (slotWidth + gap);
        const y = padding;
        builderCaptureRoundedRect(ctx, x, y, slotWidth, slotHeight, 16, "#151515", "#444444");
        if (!selection) {
            ctx.fillStyle = "#777";
            ctx.textAlign = "center";
            ctx.font = "900 18px Arial";
            ctx.fillText(`SLOT ${index + 1}`, x + slotWidth / 2, y + slotHeight / 2);
            return;
        }
        const unit = findUnitByName(selection.unitName);
        if (!unit)
            return;
        const centerX = x + slotWidth / 2;
        /* Unit image */
        const image = images[index];
        if (image) {
            const imageSize = 118;
            const imageX = centerX - imageSize / 2;
            const imageY = y + 23;
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(imageX, imageY, imageSize, imageSize, 14);
            ctx.clip();
            const scale = Math.max(imageSize / image.width, imageSize / image.height);
            const drawWidth = image.width * scale;
            const drawHeight = image.height * scale;
            ctx.drawImage(image, imageX + (imageSize - drawWidth) / 2, imageY + (imageSize - drawHeight) / 2, drawWidth, drawHeight);
            ctx.restore();
        }
        /* Unit name */
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        const nameSize = builderCaptureFitText(ctx, unit.name, slotWidth - 24, 23, 17);
        ctx.font = `900 ${nameSize}px Arial`;
        const nameLines = builderCaptureWrapText(ctx, unit.name, slotWidth - 24).slice(0, 3);
        let nameY = y + 170;
        nameLines.forEach(line => {
            ctx.fillText(line, centerX, nameY);
            nameY += nameSize + 4;
        });
        /* Enchantment */
        builderCaptureDrawEnchant(ctx, selection.enchant || "None", centerX, y + 255);
        /* Placements */
        const placements = Number(unit.maxLimit);
        ctx.fillStyle = "#b4fcff";
        ctx.textAlign = "center";
        ctx.font = "900 17px Arial";
        ctx.fillText("PLACEMENTS:", centerX, y + 287);
        ctx.font = "900 22px Arial";
        ctx.fillText(Number.isFinite(placements)
            ? String(placements)
            : "—", centerX, y + 313);
    });
    const safeName = active.name
        .trim()
        .replace(/[^a-z0-9]+/gi, "-")
        .replace(/^-|-$/g, "") || "My-Team";
    const filename = `${safeName}.png`;
    canvas.toBlob(blob => {
        if (!blob)
            return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, "image/png");
}
if (builderCaptureButton) {
    builderCaptureButton.addEventListener("click", async () => {
        builderCaptureButton.disabled = true;
        builderCaptureButton.textContent = "CAPTURING...";
        try {
            await captureBuilderTeam();
        }
        catch (error) {
            console.error("Team capture failed:", error);
            alert("Could not capture the team. Please try again.");
        }
        finally {
            builderCaptureButton.disabled = false;
            builderCaptureButton.textContent = "CAPTURE TEAM";
        }
    });
}
