// Vista Configuración
export class VistaConfiguracion {
  render(): HTMLElement {
    const page = document.createElement('div');
    page.id = 'page-settings';
    page.className = 'page';
    page.innerHTML = `
      <h1>Configuración</h1>
      <p>Opciones de configuración de la aplicación.</p>
      <button id="clear-data-btn">Limpiar datos</button>
    `;
    return page;
  }
}
