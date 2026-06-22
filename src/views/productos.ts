// Vista Productos
export class VistaProductos {
  render(): HTMLElement {
    const page = document.createElement('div');
    page.id = 'page-products';
    page.className = 'page';
    page.innerHTML = `
      <h1>Gestión de Productos</h1>

      <div id="product-message" role="status" aria-live="polite"></div>

      <form id="product-form">
        <div>
          <label for="product-name">Nombre</label>
          <input id="product-name" name="Nombre" type="text" required />
        </div>
        <div>
          <label for="product-description">Descripción</label>
          <input id="product-description" name="Descripcion" type="text" />
        </div>
        <div>
          <label for="product-price">Precio</label>
          <input id="product-price" name="Precio" type="number" step="0.01" min="0" required />
        </div>
        <button id="add-product" type="submit">Guardar producto</button>
      </form>

      <!-- Tabla decorada para mostrar productos -->
      <table id="product-table" class="product-table" aria-live="polite">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody id="product-table-body"></tbody>
      </table>
    `;
    return page;
  }
}
