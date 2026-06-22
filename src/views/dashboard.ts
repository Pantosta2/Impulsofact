// Vista Dashboard
export class VistaDashboard {
  render(): HTMLElement {
    const page = document.createElement('div');
    page.id = 'page-dashboard';
    page.className = 'page active';
    page.innerHTML = `
      <h1>Bienvenido a Impulsofact</h1>
      <p>Selecciona una opción del menú lateral para comenzar.</p>
      <p>Esta es una aplicación de gestión de productos con una interfaz moderna y componentes reutilizables.</p>
    `;
    return page;
  }
}
