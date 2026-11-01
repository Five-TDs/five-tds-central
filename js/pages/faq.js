(() => {
    const form = document.getElementById("suggestion-form");
    const status = document.getElementById("suggestion-status");
    if (!form || !status)
        return;
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!form.reportValidity())
            return;
        const button = form.querySelector('button[type="submit"]');
        button.disabled = true;
        status.className = "faq-status";
        status.textContent = "Sending your suggestion...";
        try {
            const response = await fetch(form.action, {
                method: "POST",
                body: new FormData(form),
                headers: {
                    Accept: "application/json"
                }
            });
            if (!response.ok) {
                throw new Error("Submission failed");
            }
            form.reset();
            status.className = "faq-status success";
            status.textContent =
                "Thanks! Your suggestion was submitted successfully.";
        }
        catch (error) {
            status.className = "faq-status error";
            status.textContent =
                "We could not send your suggestion. Please try again in a moment.";
        }
        finally {
            button.disabled = false;
        }
    });
})();
