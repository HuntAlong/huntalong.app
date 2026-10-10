// HuntAlong early-access signup. A success message appears ONLY after Formspree confirms receipt.
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("early-access-form");
  if (!form) return;
  const status = document.getElementById("signup-status");
  const button = document.getElementById("signup-submit");
  const success = document.getElementById("signup-success");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const endpoint = form.action;
    if (!/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(endpoint)) {
      status.textContent = "Signup is not configured yet. Please try again later.";
      return;
    }
    button.disabled = true;
    button.textContent = "Submitting…";
    status.textContent = "";
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" }
      });
      if (!response.ok) {
        let message = "We couldn't submit your request. Please try again.";
        try {
          const data = await response.json();
          if (Array.isArray(data.errors) && data.errors.length) {
            message = "We couldn't submit your request. Please check your information and try again.";
          }
        } catch (_) { /* keep safe fallback */ }
        status.textContent = message;
        return;
      }
      form.hidden = true;
      success.hidden = false;
      success.focus();
    } catch (_) {
      status.textContent = "We couldn't confirm your signup. Please check your connection and try again in a moment. If the problem continues, contact support@huntalong.app.";
    } finally {
      button.disabled = false;
      button.textContent = "Join the interest list";
    }
  });
});
