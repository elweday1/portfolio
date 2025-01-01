export function toast(
    title: string,
    message: string,
    variant = "primary",
    icon = "info-circle",
    duration = 8000
  ) {
    const closable = true;
    const innerHTML = `
    <div>
      <h3 class="toast-title">${title}</h3>
      <sl-icon name="${icon}" slot="icon"></sl-icon>
      <span class="toast-message">${message}</span>
    </div>
  `;
    const alertEl = document.createElement("sl-alert");
    const alert = Object.assign(alertEl, {
      variant,
      closable,
      duration,
      innerHTML,
    });
    document.body.append(alert);
    // @ts-ignore should throw
    customElements.whenDefined("sl-alert").then(() => alert.toast());
  }

